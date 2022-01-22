import express from 'express';

import auth from '../auth.js';

export const router = new express.Router();

router.get('/chat', auth, (req, res) => {
  res.render('templates/chat');
});

export const chatSocketController = (io) => (socket) => {
  const { userId } = socket.handshake.session;
  socket.emit('init', { messages: [], userId });
  socket.broadcast.emit('user:connected', { userId });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user:disconnected', { userId });
  });

  socket.on('message:send', (messageText, acknowledge) => {
    socket.broadcast.emit('message:get', { userId, text: messageText });
    acknowledge();
  });
};
