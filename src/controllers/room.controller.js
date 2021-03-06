import express from 'express';

import Room from '../models/room.js';
import Message from '../models/message.js';
import auth from '../auth.js';
import User from '../models/user.js';

export const router = new express.Router();

router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.render('templates/roomsList', { rooms });
  } catch (error) {
    res.status(500);
  }
});

router.get('/createRoom', auth, (req, res) => {
  res.render('templates/roomForm');
});

router.post('/createRoom', auth, async (req, res) => {
  const room = new Room(req.body);
  try {
    await room.save();
    res.status(201).redirect('/rooms');
  } catch (error) {
    const errors = error?.errors ?? {};
    if (error.code === 11000) {
      errors.name = { message: 'name must be unique' };
    }
    res
      .status(400)
      .render('templates/roomForm', { errors, values: req.body });
  }
});

router.get('/room/:roomId', auth, (req, res) => {
  res.render('templates/chat');
});

const getUserId = (socket) => socket.handshake.session.userId;

const getRoom = (socket) => socket.request._query.room;

const handleSendMessage = (socket) => async (message, acknowledge) => {
  try {
    const room = await Room.findOne({ name: message.room });
    const { user, text } = message;
    if (!room) {
      acknowledge({ error: 'room not found' });
      return;
    }
    const createdMessage = new Message({ user: user.userId, text, room: room._id });
    await createdMessage.save();
    const messageWithUser = await createdMessage.populate('user');
    socket.broadcast.to(room.name).emit('message:get', messageWithUser);
    acknowledge();
  } catch (error) {
    acknowledge(error);
  }
};

const handleConnected = async (socket) => {
  const roomName = getRoom(socket);
  const userId = getUserId(socket);
  const targetUser = await User.findById(userId);
  const room = await Room.findOne({ name: roomName });
  if (!room || !targetUser) {
    return;
  }
  const user = { name: targetUser.name, userId };
  const messages = await Message.find({ room: room._id }).populate('user').sort({ createdAt: -1 }).limit(5) ?? [];
  socket.join(room.name);
  socket.emit('init', { messages: messages.reverse(), user });
  socket.broadcast
    .to(room.name)
    .emit('user:connected', { user });
};

const handleDisconnected = (socket) => () => {
  const userId = getUserId(socket);
  const room = getRoom(socket);
  socket.broadcast.to(room).emit('user:disconnected', { userId });
};

export const roomSocketController = () => (socket) => {
  handleConnected(socket);
  socket.on('disconnect', handleDisconnected(socket));
  socket.on('message:send', handleSendMessage(socket));
};
