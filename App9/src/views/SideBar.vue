<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref, computed } from 'vue'

const messageStore = useMessageStore()

const sideBarType = ref(false)
const showInfo = ref(false)
const addUsername = ref('')

const reqs = ref([])
const friends = ref([])
const activeUser = ref({})

const chats = ref([])
const currentChat = ref('')
const chatInvites = ref('')
const showMembersList = ref(false)
const newChat = ref('')
let poll = null

const getNewRequests = async () => {
  const data = await messageStore.getFriendRequests()
  console.log(data)
  if (data.length === 0) return

  for (let i = 0; i < data.length; i++) {
    const dataId = data[i]._id ?? data[i].id
    const exists = reqs.value.some((r) => r._id === dataId)
    if (!exists) {
      reqs.value.push(data[i])
      console.log('request added: ', data[i])
    }
  }
  const userData = await messageStore.getProfile()

  const invites = userData.requests
    .filter((request) => request.kind !== 'FriendRequest')
    .map((request) => ({
      chatId: request.chat.chatId,
      chatName: request.chat.name,
      Id: request._id,
    }))

  if (invites.length === 0) return

  for (let i = 0; i < invites.length; i++) {
    const dataId = invites[i].Id
    const exists = chatInvites.value.some((r) => r.Id === dataId)
    if (!exists) {
      chatInvites.value.push(invites[i])
      console.log('request added: ', invites[i])
    }
  }
}

const loadRequests = async () => {
  try {
    const data = await messageStore.getFriendRequests()
    reqs.value = data

    const userData = await messageStore.getProfile()
    friends.value = userData.friends.map((friend) => ({
      id: friend.userId,
      username: friend.username,
    }))
    chatInvites.value = userData.requests
      .filter((request) => request.kind !== 'FriendRequest')
      .map((request) => ({
        chatId: request.chat.chatId,
        chatName: request.chat.name,
        Id: request._id,
      }))
    console.log('chat Requests: ', chatInvites.value)
    for (var i = 0; i < userData.chat_sessions.length; i++) {
      const chatInfo = await getChats(userData.chat_sessions[i])

      console.log(chatInfo)
      chats.value.push(chatInfo)
      console.log('chats Array: ')
      console.log(chats)
    }

    activeUser.value = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      chatSessions: userData.chat_sessions,
      groupRequests: userData.requests,
    }
    console.log('Active User: ', activeUser.value)
    poll = setInterval(getNewRequests, 10000)
  } catch (error) {
    console.error('Failed to load requests:', error)
  }
}

loadRequests()

console.log(reqs)
console.log(friends)

const outgoing = ref([])

const incoming = computed(() => {
  if (!Array.isArray(reqs.value)) return []
  return reqs.value
    .filter((req) => req.receiver.username === messageStore.currentUser.username)
    .map((req) => ({ id: req._id, username: req.sender.username }))
})

console.log(incoming)

function setSideBarType() {
  sideBarType.value = sideBarType.value ? false : true
}

async function createChat() {
  const createdChat = await messageStore.createChat(newChat.value)
  newChat.value = ''
  console.log('createdChat', createdChat)
  chats.value.push(createdChat)
}

function setCurrentChat(chat) {
  console.log(chat)
  currentChat.value = chat
  console.log(currentChat)
  messageStore.setActiveChat(chat)
}

function showMembers() {
  showMembersList.value = showMembersList.value ? false : true
  console.log('Show Members changed')
}

function sendChatRequest() {
  if (addUsername.value) {
    messageStore.sendGroupInvite(addUsername.value, currentChat.value._id)
    addUsername.value = ''
  }
  console.log(reqs)
}

async function acceptGroupInvite(chatId, groupId) {
  const acceptedGroup = await messageStore.acceptGroupInvite(chatId, groupId)
  console.log('Accepted Invite: ', acceptedGroup)
  chats.value.push(acceptedGroup)
  chatInvites.value = chatInvites.value.filter((req) => req.Id !== groupId)
}

function declineGroupInvite(chatId, groupId) {
  messageStore.declineGroupInvite(chatId, groupId)
  chatInvites.value = chatInvites.value.filter((req) => req.Id !== groupId)
}

async function leaveChat(chatId) {
  const leaveResult = await messageStore.leaveChat(chatId)
  if (leaveResult) {
    chats.value = chats.value.filter((chat) => chat._id !== chatId)
  }
}

function sendRequest() {
  if (
    addUsername.value &&
    friends.value.filter((friend) => friend.username === addUsername.value)
  ) {
    messageStore.sendFriendRequest(addUsername.value)
    messageStore.getProfile()
    outgoing.value.push(addUsername.value)
    addUsername.value = ''
  }
  console.log(reqs)
}

function acceptRequest(id) {
  messageStore.acceptFriendRequest(id)
  const request = reqs.value.find((req) => req._id === id)
  reqs.value = reqs.value.filter((req) => req._id !== id)
  friends.value.push({ id: request.sender._id, username: request.sender.username })
}

function declineRequest(id) {
  messageStore.declineFriendRequest(id)
  reqs.value = reqs.value.filter((req) => req._id !== id)
}

function removeFriend(id) {
  messageStore.removeFriend(id)
  friends.value = friends.value.filter((friend) => friend.id !== id)
}

function showUser() {
  showInfo.value = showInfo.value ? false : true
  console.log('Show User changed')
}

async function getChats(chatId) {
  const chat = await messageStore.getChat(chatId)
  return chat
}
</script>

<template>
  <div class="sidebar">
    <button @click="setSideBarType">
      <span v-if="!sideBarType">Friends</span><span v-if="sideBarType">Chats</span>
    </button>
    <div v-show="!sideBarType">
      <div class="friends friendAdd">
        <h1>Add Friend</h1>
        <div class="row">
          <input
            id="addUser"
            v-model="addUsername"
            placeholder="Enter Username"
            @keydown.enter="sendRequest"
          />
          <button @click="sendRequest">Add</button>
        </div>
      </div>
      <div class="friends">
        <h1>Friends</h1>
        <ul class="list">
          <li v-for="friend in friends" :key="friend">
            <div class="friendDivs">
              <button class="friendButtons">
                {{ friend.username }}
              </button>
              <button class="removeFriendButtons" @click="removeFriend(friend.id)">X</button>
            </div>
          </li>
          <li v-if="!friends || friends.length === 0">No friends</li>
        </ul>
      </div>
      <div class="friends">
        <h1>Friend Requests</h1>
        <div>
          <ul class="list">
            <li v-for="inc in incoming" :key="inc">
              <span>{{ inc.username }} </span>
              <button class="requestButtons" @click="acceptRequest(inc.id)">Accept</button>
              <button class="requestButtons" @click="declineRequest(inc.id)">Decline</button>
            </li>
            <li v-if="!incoming || incoming.length === 0">No incoming requests</li>
          </ul>
          <br />
          <ul class="list">
            <li v-for="out in outgoing" :key="out">
              <span>{{ out }}</span
              ><span style="color: gray"> (pending)</span>
            </li>
            <li v-if="!outgoing || outgoing.length === 0">No outgoing requests</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-show="sideBarType">
      <div class="friends friendAdd">
        <h1>Create Chat</h1>
        <div class="row">
          <input
            id="createChat"
            v-model="newChat"
            placeholder="Enter Chat Name"
            @keydown.enter="createChat"
          />
          <button @click="createChat">Create</button>
        </div>
      </div>
      <div class="friends">
        <h1>Group Chats</h1>
        <ul class="list">
          <li v-for="(chat, index) in chats" :key="chat">
            <div class="friendDivs">
              <button class="friendButtons" @click="setCurrentChat(chat)">
                {{ chats[index].group_name }}
              </button>
              <button class="removeFriendButtons" @click="leaveChat(chat._id)">X</button>
            </div>
          </li>
          <li v-if="!chats || chats.length === 0">No chats</li>
        </ul>
      </div>
      <div v-if="currentChat">
        <div class="friends friendAdd">
          <h1>Invite to chat</h1>
          <div class="row">
            <input
              id="inviteUser"
              v-model="addUsername"
              placeholder="Enter Username"
              @keydown.enter="sendChatRequest"
            />
            <button @click="sendChatRequest">Invite</button>
          </div>
        </div>
      </div>
      <div class="friends">
        <h1>Chat Invites</h1>
        <div>
          <ul class="list">
            <li v-for="inv in chatInvites" :key="inv">
              <span>{{ inv.chatName }} </span>
              <button class="requestButtons" @click="acceptGroupInvite(inv.chatId, inv.Id)">
                Accept
              </button>
              <button class="requestButtons" @click="declineGroupInvite(inv.chatId, inv.Id)">
                Decline
              </button>
            </li>
            <li v-if="!chatInvites || chatInvites.length === 0">No incoming Invites</li>
          </ul>
          <br />
        </div>
      </div>
      <div v-if="currentChat" class="users">
        <span class="clickable" @click="showMembers"
          ><span v-if="!showMembersList"></span>{{ currentChat.group_name }} members</span
        >
        <ul v-if="showMembersList">
          <li v-for="member in currentChat.users" :key="member">
            <span>{{ member.username }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="user">
      <span class="clickable" @click="showUser"
        ><span v-if="!showInfo">Logged in as: </span>{{ messageStore.currentUser.username }}</span
      >
      <ul v-if="showInfo">
        <li>{{ activeUser.email }}</li>
        <li>{{ activeUser.firstName }}</li>
        <li>{{ activeUser.lastName }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.user {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: 0;
}

.users {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: 0;
  padding-top: 40px;
}

.users ul {
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 14vh;
  overflow-y: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.clickable {
  cursor: pointer;
}

.user ul {
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 14vh;
  overflow-y: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.sidebar {
  background-color: #dcdcdc;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  height: 100%;
  min-height: 94vh;
  max-height: 94vh;
  overflow-y: auto;
}

.friends {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 8px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  max-height: 14vh;
  overflow-y: auto;
}

.friendDivs {
  flex: auto;
  width: auto;
  max-width: 150px;
  padding: 2px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ccc;
  gap: 5px;
}

.friendButtons {
  flex: 1 1 auto;
  width: 100px;
  padding: 8px 16px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.removeFriendButtons {
  background: #e51010;
  border: 1px solid #000000;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
}

.requestButtons {
  padding: 4px 6px;
  border-radius: 8px;
  margin-left: 4px;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
}

.friendAdd .row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
  box-sizing: border-box;
}

.friendAdd label {
  margin: 0;
  text-align: left;
  width: 100%;
  font-weight: 600;
  font-size: 0.95em;
}

.friendAdd input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
}

.friendAdd h1 {
  margin-bottom: 10px;
}

.friendAdd button {
  width: 45%;
  padding: 6px 12px;
  border-radius: 8px;
  background: blue;
  color: #fff;
  cursor: pointer;
  align-self: center;
  font-size: 1em;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
