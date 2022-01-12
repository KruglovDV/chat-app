import React from "react";

const Chat = () => {
  const [counter, setCounter] = React.useState(0);
  return <div>
    <button onClick={() => setCounter(counter + 1)}>+1</button>
    <div>{counter}</div>
  </div>;
};

export default Chat;