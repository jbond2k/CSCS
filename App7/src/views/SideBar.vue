<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref, computed } from 'vue'

const messageStore = useMessageStore()

const addUsername = ref('')

const activeUser = computed(() => {
  return messageStore.users.find((u) => u.username === messageStore.currentUser.username)
})

const friends = computed(() => (activeUser.value ? activeUser.value.friends : []))
const outgoing = computed(() => (activeUser.value ? activeUser.value.outgoing : []))
const incoming = computed(() => (activeUser.value ? activeUser.value.incoming : []))

function setActiveChat(name) {
  messageStore.setActiveChat(name)
}

function sendRequest() {
  if (addUsername.value) {
    messageStore.sendRequest(addUsername.value)
    addUsername.value = ''
  }
}

function acceptRequest(name) {
  messageStore.acceptRequest(name)
}

function declineRequest(name) {
  messageStore.declineRequest(name)
}
</script>

<template>
  <div class="sidebar">
    <div class="friends">
      <h1>Friends</h1>
      <ul class="list">
        <li v-for="friend in friends" :key="friend">
          <button class="friendButtons" @click="setActiveChat(friend)">{{ friend }}</button>
        </li>
        <li v-if="!friends || friends.length === 0">No friends</li>
      </ul>
    </div>
    <div class="friends">
      <h1>Friend Requests</h1>
      <div>
        <ul class="list">
          <li v-for="inc in incoming" :key="inc">
            <span>{{ inc }} </span>
            <button class="requestButtons" @click="acceptRequest(inc)">Accept</button>
            <button class="requestButtons" @click="declineRequest(inc)">Decline</button>
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

    <div class="friends friendAdd">
      <h1>Add Friend</h1>
      <div class="row">
        <label for="addUser">username</label>
        <input id="addUser" v-model="addUsername" />
        <button @click="sendRequest">Add</button>
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

.friendButtons {
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ccc;
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
  padding-top: 4px;
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

h1 {
  text-decoration: underline;
}
</style>
