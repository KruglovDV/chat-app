import express from 'express';

import auth from '../auth.js';

export const router = new express.Router();

router.get('/chat', auth, (req, res) => {
  res.render('templates/chat');
})

export const chatSocketController = (io) => (socket) => {
  socket.emit('initialization', {});
  socket.broadcast.emit('user connected', 'user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', (message, acknowledge) => {
    socket.broadcast.emit('message', message);
    acknowledge();
  });
};
