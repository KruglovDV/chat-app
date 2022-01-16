import React from "react";

const Chat = () => {
  const socketRef = React.useRef(null);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const socket = io();
    socketRef.current = socket;
    socket.on('initialization', console.log);
    socket.on('user connected', console.log);
    socket.on('message', console.log);
    return () => {
      socket.disconnect();
    }
  },[]);

  const handleChangeMessage = React.useCallback((event) => {
    setMessage(event.target.value)
  }, []);

  const handleSubmitMessage = React.useCallback((event) => {
    event.preventDefault();
    setMessage('');
    socketRef.current.emit('message', message, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('message sent');
    });
  }, [message]);

  return <div>
    <form onSubmit={handleSubmitMessage}>
      <input onChange={handleChangeMessage} value={message} />
      <button>send</button>
    </form>
  </div>;
};

export default Chat;