import React from 'react';

const Message = (props) => {
  const { message: { text, userId } } = props;
  return (
    <div>
      {userId} {text}
    </div>
  );
};

const MessagesList = (props) => {
  const { messages } = props;

  const renderedMessages = React.useMemo(() => {
    return messages.map((message) => <Message message={message} />)
  }, [messages]);

  return (
    <div>
      {renderedMessages}
    </div>
  );
};

export default MessagesList;