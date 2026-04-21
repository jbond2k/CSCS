import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import Message from '../models/Message.js'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useMessageStore = defineStore('messageStore', () => {
  const messages = reactive([])
  const activeChat = ref(null)
  const users = reactive([])
  const offset = ref(0)
  var timer = null

  const currentUser = ref({
    username: localStorage.getItem('username'),
    password: localStorage.getItem('password'),
  })

  const confirmNext = ref(false)

  watch(activeChat, (newValue) => {
    messages.splice(0, messages.length)
    offset.value = 0
    getMsgs()
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    timer = setInterval(checkMessages, 5000)
  })

  /*
  watch(messages, (newValue) => {
    if (messages.length < 11 && messages.length > 1) {
      getOldMsgs()
    }
    console.log('messages array: ', messages)
  })
*/
  async function checkMessages() {
    if (!activeChat.value || !activeChat.value._id) return
    try {
      const recent = await getMessages(activeChat.value._id, 0)
      if (recent.length === 0) return

      for (let i = 0; i < recent.length; i++) {
        const recentId = recent[i]._id ?? recent[i].id
        const exists = messages.some((m) => m.id === recentId)
        if (!exists) {
          addMsg(recent[i])
          console.log('message added: ', recent[i].content)
        }
      }
    } catch (err) {
      console.error('checkMessages error', err)
    }
  }

  function setActiveChat(chat) {
    console.log('AC Input:', chat)
    activeChat.value = chat
    console.log('activeChat Store value: ', activeChat)
  }

  function resetActiveChat() {
    activeChat.value = null
  }

  function addMsg(msg) {
    const sender = users.find((u) => u.user_id === msg.sender)
    console.log('sender: ', sender)
    const content = msg.content
    const id = msg._id ?? msg.id
    messages.push({ sender: sender.username, content: content, id: id })
  }

  async function getMsgs() {
    if (!activeChat.value || !activeChat.value._id) return
    const msgs = await getMessages(activeChat.value._id, offset.value)
    for (var i = 0; i < msgs.length; i++) {
      addMsg(msgs[i])
    }
    console.log('msgs: ', msgs)
    offset.value = msgs.length
    console.log(offset.value)
  }

  async function getOldMsgs() {
    if (!activeChat.value || !activeChat.value._id) return
    const msgs = await getMessages(activeChat.value._id, offset.value)
    for (var i = 0; i < msgs.length; i++) {
      addOldMsg(msgs[i])
    }
    console.log('msgs: ', msgs)
    offset.value += msgs.length
    console.log(offset.value)
  }

  function addOldMsg(msg) {
    const sender = users.find((u) => u.user_id === msg.sender)
    console.log('sender: ', sender)
    const content = msg.content
    const id = msg._id ?? msg.id
    var matched = false
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].id === id) {
        matched = true
      }
    }
    if (!matched) messages.unshift({ sender: sender.username, content: content, id: id })
  }

  async function createChat(chat) {
    console.log(chat)
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/chat'
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_name: chat,
        chat_type: 'group',
      }),
    }

    console.log(`POST /chat`)

    try {
      const response = await fetch(url, options)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const result = await response.json()
        console.log(result)

        return
      }

      // success

      const text = await response.json()
      console.log('Text: ', text)
      return text
    } catch (error) {
      console.log(error)
    }
  }

  async function getChat(chatId) {
    console.log('inside getChat')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}`
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
      console.log('got chat data')
      const data = await response.json()
      console.log(data)
      for (var i = 0; i < data.users.length; i++) {
        if (!users.some((u) => u.user_id === data.users[i].user_id)) {
          users.push({ username: data.users[i].username, user_id: data.users[i].user_id })
        }
      }
      console.log('users held: ', users)
      return data
    }

    console.log('error fetching user data')
    // TODO: deal with error
  }

  async function sendGroupInvite(username, chatId) {
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

      const url = host + `/chat/${chatId}/invitation/${userId}`
      const token = localStorage.getItem('authToken')
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await fetch(url, options)

      if (response.ok) {
        console.log(`User Invited: ${username} ChatId: ${chatId}`)

        const data = await response.text()

        console.log(data)
        return data
      }
    } catch (error) {
      console.log('sendGroupInvite error:', error)
      return { error: error.message }
    }
  }

  async function acceptGroupInvite(chatId, requestId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}/invitation/${requestId}?accept=true`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Group Invite Accepted`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  async function declineGroupInvite(chatId, requestId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}/invitation/${requestId}?accept=false`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Group Invite Declined`)
      const data = await response.json()
      console.log(data)

      return data
    }
  }

  async function leaveChat(chatId) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}/membership`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log(`Chat Left`)

      return true
    }
  }

  async function sendMessage(chatId, msg) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}/message`
    const token = localStorage.getItem('authToken')
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: msg,
      }),
    }

    console.log(`POST /chat/${chatId}/message`)

    try {
      const response = await fetch(url, options)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const result = await response.json()
        console.log(result)

        return
      }

      // success

      const text = await response.json()
      console.log('Text: ', text)
      addMsg(text)
      return text
    } catch (error) {
      console.log(error)
    }
  }

  async function getMessages(chatId, offset) {
    console.log('inside getProfile')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + `/chat/${chatId}/messages?limit=10&offset=${offset}`
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
      console.log('got message data')
      const data = await response.json()
      console.log(data)
      return data
    }

    console.log('error fetching user data')
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
    getChat,
    createChat,
    sendGroupInvite,
    acceptGroupInvite,
    declineGroupInvite,
    leaveChat,
    sendMessage,
    getMsgs,
    getOldMsgs,
  }
})
