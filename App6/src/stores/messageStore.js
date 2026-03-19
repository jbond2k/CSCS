import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import Message from '../models/Message.js'
import msgs from '../data/messages.js'
import usrs from '@/data/users.js'

export const useMessageStore = defineStore('messageStore', () => {
  const messages = reactive([...msgs])
  const activeChat = ref(null)

  const users = reactive([...usrs])

  const currentUser = ref({
    username: localStorage.getItem('username'),
    password: localStorage.getItem('password'),
  })

  const confirmNext = ref(false)

  function setActiveChat(name) {
    activeChat.value = name
  }

  function resetActiveChat() {
    activeChat.value = null
  }

  function addMsg(msg) {
    if (msg instanceof Message) {
      messages.push(msg)
    } else {
      messages.push(new Message(msg))
    }
  }

  function signup(usernameT, passwordT) {
    const newUser = {
      username: usernameT,
      password: passwordT,
      friends: [],
      outgoing: [],
      incoming: []
    }
    users.push(newUser)

    localStorage.setItem('username', usernameT)
    localStorage.setItem('password', passwordT)

    currentUser.value.username = usernameT
    currentUser.value.password = passwordT
  }

  function signin(usernameT, passwordT) {
    const foundUser = users.find(
      (user) => user.username === usernameT && user.password === passwordT,
    )

    if (foundUser) {
        localStorage.setItem('username', usernameT)
        localStorage.setItem('password', passwordT)
        currentUser.value = { username: usernameT, password: passwordT }
        return false
    }
    else {
        return true
    }
  }

  function signout() {
    currentUser.value = { username: null, password: null }
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }

  function sendRequest(usernameT) {
    const usernameF = currentUser.value.username
    if (!usernameF || usernameF === usernameT) {
        return false
    }

    const from = users.find((user) => user.username === usernameF && user.password === currentUser.value.password)
    const target = users.find((user) => user.username === usernameT)

    if (!from || !target) return false
    if (from.friends.includes(usernameT)) return false
    if (target.friends.includes(usernameF)) return false
    if (!from.outgoing.includes(usernameT)) from.outgoing.push(usernameT)
    if (!target.incoming.includes(usernameT)) target.incoming.push(usernameF)
    return true
  }

function acceptRequest(usernameT) {
    const usernameF = currentUser.value.username
    if (!usernameF) return false

    const from = users.find((user) => user.username === usernameF && user.password === currentUser.value.password)
    const target = users.find((user) => user.username === usernameT)

    if (!from || !target) return false

    from.outgoing = from.outgoing.filter(u => u !== usernameT)
    from.incoming = from.incoming.filter(u => u !== usernameT)
    target.incoming = target.incoming.filter(u => u !== usernameF)
    target.outgoing = target.outgoing.filter(u => u !== usernameF)

    if (!from.friends.includes(usernameT)) from.friends.push(usernameT)
    if (!target.friends.includes(usernameF)) target.friends.push(usernameF)
    return true
  }

  function declineRequest(usernameT) {
    const usernameF = currentUser.value.username
    if (!usernameF) return false

    const from = users.find((user) => user.username === usernameF && user.password === currentUser.value.password)
    const target = users.find((user) => user.username === usernameT)

    if (!from || !target) return false

    from.outgoing = from.outgoing.filter(u => u !== usernameT)
    from.incoming = from.incoming.filter(u => u !== usernameT)
    target.incoming = target.incoming.filter(u => u !== usernameF)
    target.outgoing = target.outgoing.filter(u => u !== usernameF)
    return true
  }

  return { messages, users, currentUser, addMsg, signup, signin, signout, sendRequest, acceptRequest, declineRequest, activeChat, setActiveChat, resetActiveChat }
})