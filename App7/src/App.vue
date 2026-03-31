<script setup>
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <NavBar />

    <div class="views">
      <div v-if="route.path === '/home'" class="sidebar">
        <RouterView name="sidebar" />
      </div>

      <div class="main">
        <RouterView name="main" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.views {
  display: flex;
  flex: 1;
  width: 100%;
}

.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  min-width: 200px;
  box-sizing: border-box;
  background: linear-gradient(to right, rgb(216, 216, 216) 0%, rgb(236, 235, 235) 100%);
}

.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(to right, rgb(230, 230, 230) 0%, rgb(243, 243, 243) 100%);
}
</style>
