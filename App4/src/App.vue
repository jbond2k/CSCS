<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Messenger from './components/Messenger.vue'

const currentUser = ref(JSON.parse(localStorage.getItem('user')))

function login(chosenUser) {
  localStorage.setItem('user', JSON.stringify(chosenUser))
  currentUser.value = chosenUser
}

function logout() {
  localStorage.removeItem('user')
  currentUser.value = null
}

</script>

<template>
  <Login v-if="!currentUser" @login="login" />
  <Messenger v-else :user="currentUser" @logout="logout" />
</template>