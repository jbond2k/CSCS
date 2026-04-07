<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref, computed } from 'vue'

const messageStore = useMessageStore()

const addUsername = ref('')

const reqs = ref([])
const friends = ref([])

const loadRequests = async () => {
  try {
    const data = await messageStore.getFriendRequests()
    reqs.value = data

    const userData = await messageStore.getProfile()
    friends.value = userData.friends.map((friend) => ({
      id: friend.userId,
      username: friend.username,
    }))
  } catch (error) {
    console.error('Failed to load requests:', error)
  }
}

loadRequests()

console.log(reqs)
console.log(friends)

/*
const outgoing = computed(() => {
  if (!Array.isArray(reqs.value)) return []
  return reqs.value
    .filter((req) => req.receiver.username !== messageStore.currentUser.username)
    .map((req) => ({ id: req._id, username: req.sender.username }))
})*/
const outgoing = ref([])

const incoming = computed(() => {
  if (!Array.isArray(reqs.value)) return []
  return reqs.value
    .filter((req) => req.receiver.username === messageStore.currentUser.username)
    .map((req) => ({ id: req._id, username: req.sender.username }))
})

console.log(incoming)

function setActiveChat(name) {
  messageStore.setActiveChat(name)
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
</script>

<template>
  <div class="sidebar">
    <div class="friends friendAdd">
      <h1>Add Friend</h1>
      <div class="row">
        <input id="addUser" v-model="addUsername" placeholder="Enter Username" />
        <button @click="sendRequest">Add</button>
      </div>
    </div>
    <div class="friends">
      <h1>Friends</h1>
      <ul class="list">
        <li v-for="friend in friends" :key="friend">
          <div class="friendDivs">
            <button class="friendButtons" @click="setActiveChat(friend)">
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
</template>

<style scoped>
.sidebar {
  background-color: #dcdcdc;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 16px;
  height: 100%;
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
