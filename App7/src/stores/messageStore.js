import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import Message from '../models/Message.js'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useMessageStore = defineStore('messageStore', () => {
  const messages = reactive([])
  const activeChat = ref(null)

  const users = reactive([])

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

  async function signin(username, password) {
    console.log('userStore: signin()')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }

    console.log(`POST /user/login`)

    try {
      const response = await fetch(url, options)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        return
      }

      const result = await response.json()

      currentUser.value = result.user
      localStorage.setItem('username', result.user.username)
      localStorage.setItem('authToken', result.authToken)
    } catch (error) {
      console.log(error)
    }
  }

  async function signup(user) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }

    console.log(`POST /user`)

    try {
      const response = await fetch(url, options)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const result = await response.json()
        console.log(result)

        if (response.status === 400) {
          return 'Validation error'
        }
        if (response.status === 409) {
          return 'Username already exists'
        }

        return
      }

      // success

      console.log('User account created')
      console.log(user)
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  function signout() {
    currentUser.value = { username: null, password: null }
    localStorage.clear()

    router.push('/login')
  }

  function sendRequest(usernameT) {
    const usernameF = currentUser.value.username
    if (!usernameF || usernameF === usernameT) {
      return false
    }

    const from = users.find(
      (user) => user.username === usernameF && user.password === currentUser.value.password,
    )
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

    const from = users.find(
      (user) => user.username === usernameF && user.password === currentUser.value.password,
    )
    const target = users.find((user) => user.username === usernameT)

    if (!from || !target) return false

    from.outgoing = from.outgoing.filter((u) => u !== usernameT)
    from.incoming = from.incoming.filter((u) => u !== usernameT)
    target.incoming = target.incoming.filter((u) => u !== usernameF)
    target.outgoing = target.outgoing.filter((u) => u !== usernameF)

    if (!from.friends.includes(usernameT)) from.friends.push(usernameT)
    if (!target.friends.includes(usernameF)) target.friends.push(usernameF)
    return true
  }

  function declineRequest(usernameT) {
    const usernameF = currentUser.value.username
    if (!usernameF) return false

    const from = users.find(
      (user) => user.username === usernameF && user.password === currentUser.value.password,
    )
    const target = users.find((user) => user.username === usernameT)

    if (!from || !target) return false

    from.outgoing = from.outgoing.filter((u) => u !== usernameT)
    from.incoming = from.incoming.filter((u) => u !== usernameT)
    target.incoming = target.incoming.filter((u) => u !== usernameF)
    target.outgoing = target.outgoing.filter((u) => u !== usernameF)
    return true
  }

  return {
    messages,
    users,
    currentUser,
    addMsg,
    signup,
    signin,
    signout,
    sendRequest,
    acceptRequest,
    declineRequest,
    activeChat,
    setActiveChat,
    resetActiveChat,
  }
})
