<script setup>
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "../stores/userStore"

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

function logout(){
  userStore.logout()
  router.push("/")
}
</script>

<template>
  <nav>
    <div>
        <RouterLink v-if="userStore.loggedIn" to="/home" class="links">Home</RouterLink>
    </div>
    <div v-if="route.path !== '/login' && userStore.loggedIn === true" class="links">
        <span @click="logout">Log out</span>
    </div>
    <div v-if="route.path === '/about' && userStore.loggedIn === false" class="links">
        <RouterLink to="/login" style="color: black;">Log in</RouterLink>
    </div>
  </nav>
</template>

<style>
.links {
    display: inline-block;
    cursor: pointer;
    text-decoration: underline;
    padding: 5px 10px;
    color: black;
}

.links.router-link-active {
  background-color: gray;
  color: #fff;
  border-radius: 999px;
  transition: background-color .25s ease-in, color 0s ease-in .25s;
}

nav{
  background-color: #dcdcdc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  height: 28.5px;
}
</style>