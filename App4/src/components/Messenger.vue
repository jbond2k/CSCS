<script setup>
import { ref, computed } from 'vue'
import { useMessageStore } from '../stores/messageStore'

const messageStore = useMessageStore()
const currentMessage = ref('')
const props = defineProps({
  user: Object
})

const messages = computed(() => messageStore.messages)

function send() {
    const msg = currentMessage.value.trim()
    if (msg) {

        messageStore.add({
            username: props.user.username,
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            message: msg
        })
    }
  currentMessage.value = ''
}

</script>

<template>
    <div>
        <div class="chat">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.username === props.user.username ? 'right' : 'left']" >
                <strong>{{ message.firstName }}</strong>
                <p>{{ message.redacted ? '████████████████████' : message.message }}</p>

                <div v-if="message.username === props.user.username">
                    <button v-if="!message.redacted" @click="messageStore.redact(index, props.user.username)">Redact</button>
                    <button v-else @click="messageStore.unredact(index, props.user.username)">Unredact</button>
                </div>
            </div>

            <div class="messageInput">
                <input v-model="currentMessage" />
                <button @click="send">Send</button>
            </div>
        </div>

        <button @click="$emit('logout')">Logout</button>
    </div>
</template>

<style scoped>
.chat {
    overflow-wrap: break-word;
    max-width: 80vw;
    margin: auto;
}

.message {
    margin: 5px;
    padding: 5px;
}

.left {
    text-align: left;
    margin-right: 50%;
}

.right {
    text-align: right;
    margin-left: 50%;
}

.messageInput {
    display: flex;
    justify-content: center;
}
</style>