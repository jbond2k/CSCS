import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import AboutPage from '@/views/AboutPage.vue'

const routes = [
  { 
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router