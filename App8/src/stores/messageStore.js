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
      const user = currentUser.value
      console.log(user.friends)
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
          return 'Username or email already exists'
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

  async function getProfile() {
    console.log('inside getProfile')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user'
    const token = localStorage.getItem('authToken')
    console.log(token)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log('got user data')
      const data = await response.json()
      console.log(data)
      return data
    }

    console.log('error fetching user data')
    // TODO: deal with error
  }

  async function findProfile(username) {
    console.log('inside findProfile')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/users?search=${username}`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log('got user data')
      const data = await response.json()
      console.log(data)
      const targetUsername = username

      const foundUser = data.users.filter((user) => user.username === targetUsername)

      const foundUserId = foundUser[0]._id
      return foundUserId
    }

    // TODO: deal with error
  }

  async function sendFriendRequest(username) {
    try {
      if (!username || username === currentUser.value.username) {
        throw new Error('Invalid username')
      }
      const userId = await findProfile(username)
      if (!userId) {
        throw new Error(`Unable to locate "${username}"`)
      }

      console.log('inside sendAddFriend')

      const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

      const url = host + `/friend-request/${userId}`
      const token = localStorage.getItem('authToken')
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await fetch(url, options)

      if (response.ok) {
        console.log(`Friend Added: ${username}`)

        const data = await response.text()

        console.log(data)
        return data
      }
    } catch (error) {
      console.log('sendFriendRequest error:', error)
      return { error: error.message }
    }
  }

  async function getFriendRequests() {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/friend-requests`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Requests Gotten`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  async function acceptFriendRequest(requestId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/friend-request/${requestId}?accept=true`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Friend Request Accepted`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  async function declineFriendRequest(requestId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/friend-request/${requestId}?accept=false`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Friend Request Declined`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  async function removeFriend(userId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/friend/${userId}`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Friend Request Accepted`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  return {
    messages,
    users,
    currentUser,
    confirmNext,
    addMsg,
    signup,
    signin,
    signout,
    getFriendRequests,
    activeChat,
    setActiveChat,
    resetActiveChat,
    getProfile,
    findProfile,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
  }
})
