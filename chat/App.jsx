import React from 'react';
import MessagesList from './MessagesList.jsx';
import MessageForm from './MessageForm.jsx';

const getRoomName = () => {
  return decodeURI(window.location.pathname.split('/')[2]);
}

const makeMessage = (user, room, text) => {
  return { user, room, text, createdAt: new Date() };
};

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
    const socket = io({ query: `room=${getRoomName()}` });
    socketRef.current = socket;
    socket.on('init', handleInit);
    socket.on('user:connected', console.log);
    socket.on('user:disconnected', console.log);
    socket.on('message:get', handleMessage);
    return () => {
      socket.disconnect();
    }
  },[]);

  const sendMessage = React.useCallback((message) => {
    socketRef.current.emit('message:send', message, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('message sent');
    });
  }, []);

  const handleSubmitMessage = React.useCallback((messageText, event) => {
    event.preventDefault();
    const trimmedMessageText = messageText.trim();

    if (!trimmedMessageText) {
      return;
    }

    const message =  makeMessage(currentUserId, getRoomName(), trimmedMessageText);
    sendMessage(message);
    setMessages([...allMessages, message]);
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