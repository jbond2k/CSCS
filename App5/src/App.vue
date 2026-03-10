<script setup>
import NavBar from "./components/NavBar.vue"
</script>

<template>
  <div class="app">
    <NavBar />
      <RouterView />
    <footer>
      <RouterLink to="/about" class="links">About</RouterLink>
    </footer>
  </div>
</template>

<style>
.app{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-height: 100vh;
}

.links {
    display: inline-block;
    cursor: pointer;
    text-decoration: underline;
    padding: 5px 10px;
}

.router-link-active {
    background-color: gray;
    color: #fff;
    transition: background-color .25s ease-in, color 0s ease-in .25s;
    border-radius: 999px;
}

footer{
  background-color: #dcdcdc;
    padding: 10px;
    height: 28.5px;
    display: flex;
    justify-content: center;
}

body {
  margin: 0;
}
</style>