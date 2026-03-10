<script setup>
import { useUserStore } from "../stores/userStore"
import { ref, computed} from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const usernameAboveFive = computed(() => username.value.length >= 5)
const usernameBeginLetter = computed(() => /[a-z]/i.test(username.value.charAt(0)))
const usernameLettersNumbers = computed(() => /[A-Za-z][A-Za-z0-9]*$/.test(username.value))

const passwordAboveEight = computed(() => password.value.length >= 8)
const passwordUppercase = computed(() => /[A-Z]/.test(password.value))
const passwordLowercase = computed(() => /[a-z]/.test(password.value))
const passwordNumber = computed(() => /[0-9]/.test(password.value))
const passwordSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))

const validUsername = computed(() =>
  usernameAboveFive.value &&
  usernameBeginLetter.value &&
  usernameLettersNumbers.value
)

const validPassword = computed(() =>
  passwordAboveEight.value &&
  passwordUppercase.value &&
  passwordLowercase.value &&
  passwordNumber.value &&
  passwordSpecial.value
)

function login() {
  if (validUsername.value && validPassword.value) {
    userStore.login(username.value, password.value)
    router.push("/home")
  }
}
</script>

<template>
  <div class="login-view view">
    <div class="login-content">
        <div class="login-form">
            <h1>Let's Go!</h1>
            <h3 v-if="userStore.loggedIn === false">Enter your credentials</h3>
            <h3 v-else>Login with another account</h3>

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

                <input :type="showPassword ? 'text' : 'password'" v-model="password"/>
            </div>
            <button @click="login">Log in</button>
        </div>

    <div v-if="!validUsername || !validPassword" class="error-messages">
        <div>
            <span v-if="!validUsername">Username</span>
            <ul>
                <li v-if="!usernameAboveFive"><span>Must have at least 5 characters</span></li>
                <li v-if="!usernameBeginLetter"><span>Must begin with a letter</span></li>
                <li v-if="!usernameLettersNumbers"><span>Can only contain letters and numbers</span></li>
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
.login-view{
    box-sizing: border-box;
    opacity: 97%;
    display: flex;
    flex: 1;
    background-color: #efeded;
}

.view {
  position: relative;
}

.view::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-image: url("../assets/starfish.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: grayscale(100%);
  opacity: .05;
  z-index: -1;
}

.login-content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 20px;
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
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
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

.form-item input{
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
    transition: .4s;
    border-radius: 17px;
}

.slider::before {
    position: absolute;
    content: "";
    height: 13px;
    width: 14px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    transition: .4s;
    border-radius: 50%;
}

.switch input:checked + .slider::before {
  transform: translateX(13px);
}

.switch input:checked+.slider {
    background-color: #2196f3;
}
</style>