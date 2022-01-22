import React from 'react';

const MessageForm = (props) => {
  const { onSubmit } = props;
  const [message, setMessage] = React.useState('');

  const handleSubmit = React.useCallback((event) => {
    onSubmit(message, event);
    setMessage('');
  }, [onSubmit, message]);

  const handleChangeMessage = React.useCallback((event) => {
    setMessage(event.target.value)
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChangeMessage} value={message} />
      <button>send</button>
    </form>
  );
};

export default MessageForm;