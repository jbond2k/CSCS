<script setup>
import { useMessageStore } from '../stores/messageStore'

const messageStore = useMessageStore()

const emit = defineEmits(['login'])

function login(user) {
  emit('login', user)
}
</script>

<template>
  <div>
    <div class="login">
        <h2>Select User</h2>
        <div class="buttons">
            <button v-for="user in messageStore.users" :key="user.username" @click="login(user)">
            {{ user.firstName }}
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 95vh;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
}
</style>