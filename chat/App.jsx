import React from 'react';
import MessagesList from './MessagesList.jsx';
import MessageForm from './MessageForm.jsx';

const Chat = () => {
  const socketRef = React.useRef(null);
  const [allMessages, setMessages] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState(null);

  const handleInit = React.useCallback(({ messages, userId }) => {
    setMessages(messages);
    setCurrentUserId(userId);
  }, []);

  const handleMessage = React.useCallback((message) => {
    setMessages((prevMessages) => ([...prevMessages, message]));
  }, []);

  React.useEffect(() => {
    const socket = io();
    socketRef.current = socket;
    socket.on('init', handleInit);
    socket.on('user:connected', console.log);
    socket.on('user:disconnected', console.log);
    socket.on('message:get', handleMessage);
    return () => {
      socket.disconnect();
    }
  },[]);

  const sendMessage = React.useCallback((messageText) => {
    socketRef.current.emit('message:send', messageText, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('message sent');
    });
  }, []);

  const handleSubmitMessage = React.useCallback((message, event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }
    sendMessage(trimmedMessage);
    setMessages([...allMessages, { userId: currentUserId, text: message }]);
  }, [allMessages, currentUserId, sendMessage]);

  return (
    <div>
      <div>
        <MessagesList messages={allMessages} />
      </div>
      <MessageForm onSubmit={handleSubmitMessage} />
    </div>
  );
};

export default Chat;