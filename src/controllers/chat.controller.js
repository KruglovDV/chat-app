const chatController = (io) => (socket) => {
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

export default chatController;
