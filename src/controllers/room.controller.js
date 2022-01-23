import express from 'express';

import Room from '../models/room.js';
import Message from '../models/message.js';
import auth from '../auth.js';

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
    const errors = {};
    if (error.code === 11000) {
      errors.name = 'name must be unique';
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

const messageSendController = (socket) => async (message, acknowledge) => {
  try {
    const room = await Room.findOne({ name: message.room });
    const { user, text } = message;
    if (!room) {
      acknowledge({ error: 'room not found' });
      return;
    }
    const createdMessage = new Message({ user, text, room: room._id });
    await createdMessage.save();
    socket.broadcast.to(room.name).emit('message:get', createdMessage);
    acknowledge();
  } catch (error) {
    acknowledge(error);
  }
};

const handleConnected = async (socket) => {
  const roomName = getRoom(socket);
  const userId = getUserId(socket);
  const room = await Room.findOne({ name: roomName });
  if (!room) {
    return;
  }
  const messages = await Message.find({ room: room._id }).sort({ createdAt: -1 }).limit(20) ?? [];
  socket.join(room.name);
  socket.emit('init', { messages: messages.reverse(), userId });
  socket.broadcast.to(room.name).emit('user:connected', { userId });
};

const handleDisconnected = (socket) => () => {
  const userId = getUserId(socket);
  const room = getRoom(socket);
  socket.broadcast.to(room).emit('user:disconnected', { userId });
};

export const roomSocketController = () => async (socket) => {
  handleConnected(socket);
  socket.on('disconnect', handleDisconnected(socket));
  socket.on('message:send', messageSendController(socket));
};
