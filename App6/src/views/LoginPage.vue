<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const messageStore = useMessageStore()

const result = ref(false)
const username = ref('')
const password = ref('')
const showPassword = ref(false)

function signin() {
    result.value = messageStore.signin(username.value, password.value)
    if (result.value == false) {
      router.push('/home')
    }
  }
</script>

<template>
  <div class="login-view view">
    <h1>Sign In</h1>

    <div class="login-content">

      <div class="login-form">
        <h3 v-if="!messageStore.currentUser.username">Enter your credentials</h3>
        <h3 v-else>Log In To Another Account</h3>

        <div class="form-item">
          <label>Username</label>
          <input v-model="username" />
        </div>

        <div class="form-item">
          <label>Password</label>

          <label class="switch align-right">
            <input type="checkbox" v-model="showPassword" />
            <span class="slider"></span>
          </label>

          <input :type="showPassword ? 'text' : 'password'" v-model="password" />
        </div>
        <span v-if="result" class="error-messages">Invalid username or password</span>
        <button @click="signin">Sign In</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  box-sizing: border-box;
  opacity: 0.97;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background-color: #efeded;
}

.view {
  position: relative;
  background: linear-gradient(
    to right,
    rgb(230, 230, 230) 0%,
    rgb(243, 243, 243) 100%
  );
}

.login-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 22vh;
}

.login-form {
  background-color: #f8f8f8;
  box-sizing: border-box;
  padding: 20px;
  font-size: small;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 200px;
}

h1 {
  text-align: center;
  padding: 0;
  font-size: 8em;
  margin: 0;
  margin-top: 5vh;
}

h3 {
  display: block;
  font-size: 2em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  text-align: center;
  margin-top: 0;
}

.form-item {
  box-sizing: border-box;
  width: 160px;
  margin-bottom: 5px;
}

.form-item label {
  display: inline-block;
  margin-bottom: 5px;
}

.form-item input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 5px;
}

button {
  font-size: medium;
  color: #f8f8f8;
  background-color: #000;
  border-radius: 999px;
  padding: 5px 10px;
  border: 0;
}

.error-messages {
  color: #c70d0d;
}

.error-messages ul {
  padding-left: 15px;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  flex-shrink: 0;
}

.align-right {
  float: right;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 17px;
}

.slider::before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 50%;
}

.switch input:checked + .slider::before {
  transform: translateX(14px);
}

.switch input:checked + .slider {
  background-color: #2196f3;
}
</style>
