<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Messenger from './components/Messenger.vue'

const currentUser = ref(JSON.parse(localStorage.getItem('user')))

function logout() {
  localStorage.removeItem('user')
  currentUser.value = null
}
</script>

<template>
  <Login v-if="!currentUser" v-model="currentUser" />
  <Messenger v-else :user="currentUser" @logout="logout" />
</template>