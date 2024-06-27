const Notification = ({ message }) => {
  console.log("Notification component rendered with message:", message);
  if (message === null) {
    return null;
  }

  return <div className="message">{message}</div>;
};

export default Notification;
