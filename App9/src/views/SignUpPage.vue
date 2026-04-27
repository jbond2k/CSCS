<script setup>
import { useMessageStore } from '../stores/messageStore'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const messageStore = useMessageStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)

const result = ref('')

const usernameAboveFive = computed(() => username.value.length >= 5)
const usernameBeginLetter = computed(() => /[a-z]/i.test(username.value.charAt(0)))
const usernameLettersNumbers = computed(() => /[A-Za-z][A-Za-z0-9]*$/.test(username.value))

const passwordAboveEight = computed(() => password.value.length >= 8)
const passwordUppercase = computed(() => /[A-Z]/.test(password.value))
const passwordLowercase = computed(() => /[a-z]/.test(password.value))
const passwordNumber = computed(() => /[0-9]/.test(password.value))
const passwordSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))

const validUsername = computed(
  () => usernameAboveFive.value && usernameBeginLetter.value && usernameLettersNumbers.value,
)

const validPassword = computed(
  () =>
    passwordAboveEight.value &&
    passwordUppercase.value &&
    passwordLowercase.value &&
    passwordNumber.value &&
    passwordSpecial.value,
)

async function signup() {
  if (validUsername.value && validPassword.value) {
    result.value = await messageStore.signup({
      username: username.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    })
    console.log(result.value)
    if (!result.value) {
      sessionStorage.setItem('madeAccount', true)
      router.push('/login')
    }
    if (result.value == 'Validation error') {
      if (firstName.value === '' || lastName.value === '' || email.value === '')
        result.value = 'Please fill missing fields'
      else result.value = 'Please enter a valid email'
    }
  }
}
</script>

<template>
  <div class="signin-view view">
    <h1>Sign Up</h1>
    <h2>{{ result }}</h2>
    <div class="signin-content">
      <div class="signin-form">
        <h3>Create Your Account</h3>

        <div class="form-item">
          <label>Username</label>
          <input v-model="username" />
        </div>

        <div class="form-item">
          <label>First Name</label>
          <input v-model="firstName" />
        </div>

        <div class="form-item">
          <label>Last Name</label>
          <input v-model="lastName" />
        </div>

        <div class="form-item">
          <label>Email</label>
          <input type="email" v-model="email" />
        </div>

        <div class="form-item">
          <label>Password</label>

          <label class="switch align-right">
            <input type="checkbox" v-model="showPassword" />
            <span class="slider"></span>
          </label>

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @keydown.enter="signup"
          />
        </div>
        <button @click="signup">Create</button>
      </div>

      <div v-if="!validUsername || !validPassword" class="error-messages">
        <div>
          <span v-if="!validUsername">Username</span>
          <ul>
            <li v-if="!usernameAboveFive"><span>Must have at least 5 characters</span></li>
            <li v-if="!usernameBeginLetter"><span>Must begin with a letter</span></li>
            <li v-if="!usernameLettersNumbers">
              <span>Can only contain letters and numbers</span>
            </li>
          </ul>
        </div>

        <div>
          <span v-if="!validPassword">Password</span>
          <ul>
            <li v-if="!passwordAboveEight"><span>Must have at least 8 characters</span></li>
            <li v-if="!passwordUppercase"><span>Must have 1 uppercase character</span></li>
            <li v-if="!passwordLowercase"><span>Must have 1 lowercase character</span></li>
            <li v-if="!passwordNumber"><span>Must have 1 number</span></li>
            <li v-if="!passwordSpecial"><span>Must have 1 special character</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signin-view {
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
  background: linear-gradient(to right, rgb(230, 230, 230) 0%, rgb(243, 243, 243) 100%);
}

.signin-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 32vh;
}

.signin-form {
  background-color: #f8f8f8;
  box-sizing: border-box;
  padding: 20px;
  font-size: small;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 250px;
}

h1 {
  text-align: center;
  padding: 0;
  font-size: 6em;
  margin: 0;
  margin-top: 6vh;
}

h2 {
  color: #c70d0d;
  padding-top: 40px;
}

h3 {
  display: block;
  font-size: 2.2em;
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
  border-radius: 10px;
  padding: 5px 10px;
  border: 0;
}

.error-messages {
  align-self: center;
  color: #c70d0d;
  font-size: 12px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
