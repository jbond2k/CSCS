<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useMessageStore } from '../stores/messageStore'
const messageStore = useMessageStore()
const router = useRouter()
const route = useRoute()

function signout() {
    messageStore.confirmNext = true
    router.push('/logo')
}

</script>

<template>
  <nav>
      <RouterLink v-if="messageStore.currentUser.username" to="/logo" @click="signout" class="links">Sign Out</RouterLink>
      <RouterLink v-if="!messageStore.currentUser.username && route.path !== '/signup'" to="/signup" class="links">Create</RouterLink>
      <RouterLink v-if="!messageStore.currentUser.username && route.path !== '/login'" to="/login" class="links">Sign In</RouterLink>
  </nav>
</template>

<style>
.links {
  display: inline-block;
  cursor: pointer;
  padding: 5px 10px;
  color: black;
  margin: 0 5px;
  border-width: 1px;
  background-color: white;
  border-style: solid;
}

nav {
  background-color: #dcdcdc;
  padding: 10px;
  display: flex;
  justify-content: right;
  height: 30px;
}
</style>
