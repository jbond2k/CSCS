import { defineStore } from 'pinia'
import { reactive } from 'vue'
import Message from '../models/Message.js'
import msgs from '../data/messages.js'

export const useMessageStore = defineStore('messageStore', () => {
  const messages = reactive([...msgs])

  const users = reactive([
    { username: 'Detective', firstName: 'David', lastName: 'Lynch' },
    { username: 'Jack', firstName: 'Jack', lastName: 'Monkey' },
  ])

  function add(msg) {
    if (msg instanceof Message) {
      messages.push(msg)
    }
    else {
      messages.push(new Message(msg))
    }
  }

  function redact(index, username) {
    if (index >= 0 && index < messages.length) {
        const msg = messages[index]

        if (msg.username === username) {
            msg.redacted = true
        }
    }
  }

  function unredact(index, username) {
    if (index >= 0 && index < messages.length) {
        const msg = messages[index]

        if (msg.username === username) {
            msg.redacted = false
        }
    }
  }

  return { messages, users, add, redact, unredact }
})