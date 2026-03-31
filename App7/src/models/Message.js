class Message {
  from;
  to;
  message;

  constructor({ from, to, message }) {
    this.from = from
    this.to = to
    this.message = message
  }
}

export default Message