import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {

  const username = ref(localStorage.getItem('username'))
  const password = ref(localStorage.getItem('password'))
  const loggedIn = ref(localStorage.getItem('loggedIn') === 'true')

  function login(usernameT, passwordT) {
    const capitalUsername = usernameT.charAt(0).toUpperCase() + usernameT.slice(1)
      username.value = capitalUsername
      password.value = passwordT
      loggedIn.value = true
      localStorage.setItem('username', usernameT)
      localStorage.setItem('password', passwordT)
      localStorage.setItem('loggedIn', true)
  }

  function logout() {
    username.value = ''
    password.value = ''
    loggedIn.value = false
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    localStorage.removeItem('loggedIn')
  }

  return { username, password, loggedIn, login, logout }
})