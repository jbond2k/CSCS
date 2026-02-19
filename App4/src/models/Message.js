class Message {
  username;
  firstName;
  lastName;
  message;
  redacted;

  constructor({ username, firstName, lastName, message }) {
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.message = message
    this.redacted = false
  }
}

export default Message
