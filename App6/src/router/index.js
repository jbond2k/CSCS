import { createRouter, createWebHistory } from 'vue-router'

import SideBar from '@/views/SideBar.vue'
import MainPage from '@/views/MainPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import LogoPage from '@/views/LogoPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'
import { useMessageStore } from '../stores/messageStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/logo' },
    {
      path: '/home',
      components: {
        sidebar: SideBar,
        main: MainPage,
      },
    },
    {
      path: '/logo',
      components: {
        main: LogoPage,
      },
    },
    {
      path: '/login',
      components: {
        main: LoginPage,
      },
    },
    {
      path: '/signup',
      components: {
        main: SignUpPage,
      },
    },
    {
    path: '/:pathMatch(.*)*', redirect: '/logo'}
  ]
})

router.beforeEach(async (to, from) => {

  const messageStore = useMessageStore()

  if (to.path == '/home' && !messageStore.currentUser.username) {
    return { path: '/logo' }
  }

  if (to.path == '/login' || to.path == '/signup' || to.path == '/logo') {
     return messageStore.currentUser.username ? { path: '/home' } : true
  }
})

router.afterEach(() => {
  const messageStore = useMessageStore()
  messageStore.resetActiveChat()
})

export default router