import React from 'react';

const autoscroll = () => {
  // New message element
  const $messages = document.querySelector('#messagesList')
  const $newMessage = $messages.lastElementChild
  if (!$newMessage) {
    return;
  }
  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

const Message = (props) => {
  const { message: { text, user, updatedAt } } = props;
  const localeDate = new Date(updatedAt).toLocaleString();
  return (
    <div className="card" style={{ margin: '16px 0' }}>
      <div className="card-header">
        {user.name}
      </div>
      <div className="card-body">
        <blockquote className="blockquote mb-0">
          <p>{text}</p>
          <small className="text-muted">{localeDate}</small>
        </blockquote>
      </div>
    </div>
  );
};

const MessagesList = (props) => {
  const { messages } = props;

  React.useEffect(() => {
    autoscroll();
  }, [messages]);

  const renderedMessages = React.useMemo(() => {
    return messages.map((message) => <Message message={message} />)
  }, [messages]);

  return (
    <div id="messagesList" style={{ flexGrow: '1', overflow: 'scroll' }}>
      {renderedMessages}
    </div>
  );
};

export default MessagesList;