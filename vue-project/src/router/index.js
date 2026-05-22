import { createRouter, createWebHistory } from 'vue-router'
import homeView from '@/views/homeView.vue'
import loginView from '@/views/loginView.vue'
import registerView from '@/views/registerView.vue'
import profileView from '@/views/profileView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeView,
    },
    {
      path: '/login',
      name: 'login',
      component: loginView,
    },
    {
      path: '/register',
      name: 'register',
      component: registerView,
    },
    {
      path: '/profile/:user_id',
      name: 'profile',
      component: profileView,
    },
  ],
})

export default router
