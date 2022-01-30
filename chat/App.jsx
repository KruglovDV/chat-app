import React from 'react';
import MessagesList from './MessagesList.jsx';
import MessageForm from './MessageForm.jsx';

const getRoomName = () => {
  return decodeURI(window.location.pathname.split('/')[2]);
}

const makeMessage = (user, room, text) => {
  const date = new Date();
  return { user, room, text, createdAt: date, updatedAt: date };
};

const Chat = () => {
  const socketRef = React.useRef(null);
  const [allMessages, setMessages] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);

  const handleInit = React.useCallback(({ messages, user }) => {
    setMessages(messages);
    setCurrentUser(user);
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

    const message = makeMessage(currentUser, getRoomName(), trimmedMessageText);
    sendMessage(message);
    setMessages([...allMessages, message]);
  }, [allMessages, currentUser, sendMessage]);

  return (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div
          className="col-10 col-md-8 col-lg-6 h-100"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <MessagesList messages={allMessages} />
          <MessageForm onSubmit={handleSubmitMessage} />
      </div>
      </div>
    </div>
  );
};

export default Chat;