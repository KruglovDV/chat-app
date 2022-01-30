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
      <div className="input-group mb-3">
        <button className="btn btn-outline-secondary" type="submit" id="button-addon1">Send</button>
        <input onChange={handleChangeMessage} value={message} type="text" className="form-control" placeholder="Enter text here..." />
      </div>
    </form>
  );
};

export default MessageForm;