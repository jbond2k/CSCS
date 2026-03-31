<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const messageStore = useMessageStore()

const targetFriend = computed(() => messageStore.activeChat)

const currentMessage = ref('')

const messages = computed(() => {
  if (!targetFriend.value || !messageStore.currentUser.username) return []
  return messageStore.messages
    .filter(
      (msg) =>
        (msg.from === messageStore.currentUser.username && msg.to === targetFriend.value) ||
        (msg.from === targetFriend.value && msg.to === messageStore.currentUser.username),
    )
    .map((m) => ({ ...m, text: m.message }))
})

function send() {
  const msg = currentMessage.value.trim()
  if (msg) {
    messageStore.addMsg({
      from: messageStore.currentUser.username,
      to: targetFriend.value,
      message: msg,
    })

    currentMessage.value = ''
  }
}

onBeforeRouteLeave((to, from) => {
  if (messageStore.confirmNext) {
    const confirm = window.confirm('Are you sure you want to sign out?')
    messageStore.confirmNext = false
    if (!confirm) {
      return false
    }
    messageStore.signout()
  }
})
</script>

<template>
  <div class="mainPage">
    <h1 class="title">
      {{ targetFriend ? `Chat with ${targetFriend}` : 'Choose friend to chat with' }}
    </h1>

    <div class="chat-window" ref="chatWindow" v-if="targetFriend">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.from === messageStore.currentUser.username ? 'right' : 'left']"
      >
        <div class="sender">
          <strong>{{ message.from }}</strong>
        </div>
        <div class="text">{{ message.text }}</div>
      </div>
    </div>

    <div v-if="targetFriend" class="input-area">
      <span>New Post</span>
      <input v-model="currentMessage" @keydown.enter="send" />
    </div>
  </div>
</template>

<style scoped>
.mainPage {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 12px;
  gap: 12px;
}

.title {
  margin: 0;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.chat-window {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 45%;
  overflow-wrap: break-word;
  display: inline-block;
  padding: 8px 12px 12px 8px;
  border-radius: 10px;
}

.left {
  align-self: flex-start;
  text-align: left;
  background: #e9e9ec;
  clip-path: polygon(100% 0, 0 0, 0 89%, 0 89%, 0 100%, 6% 89%, 100% 89%);
}

.right {
  align-self: flex-end;
  text-align: right;
  background: #68aefe;
  clip-path: polygon(0 0, 100% 0, 100% 87%, 100% 87%, 100% 100%, 92% 87%, 0 87%);
}

.sender {
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: #222;
}

.input-area {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-direction: column;
}
.input-area input {
  flex: 1 1 auto;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  box-sizing: border-box;
}
.input-area span {
  width: 100%;
}
</style>
