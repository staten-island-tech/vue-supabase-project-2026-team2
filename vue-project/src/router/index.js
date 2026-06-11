import { createRouter, createWebHistory } from 'vue-router'
/* import { useAuthStore } from '@/stores/auth.js' */
import Account from '@/components/Account.vue'
import Auth from '@/components/Auth.vue'
import Avatar from '@/components/Avatar.vue'
/* import homeView from '@/views/homeView.vue'
import loginView from '@/views/loginView.vue'
import registerView from '../../../old/registerView.vue'
import profileView from '../../../old/profileView.vue'
import postView from '../../../old/postView.vue' */

function isAuthenticated() {
  // Replace with your real auth check (e.g., token in localStorage, Vuex store, Pinia, etc.)
  return !!localStorage.getItem('authToken')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Account,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Auth,
    },
    {
      path: '/addProfile',
      name: 'Register',
      component: Avatar,
    },

    /*  {
      path: '/profile/:user_id',
      name: 'profile',
      component: profileView,
    },
    {
      path: '/post/:id',
      name: 'post',
      component: postView,
    }, */
  ],
})
router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !isAuthenticated() &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
  // If already authenticated and trying to go to login, redirect to home
  if (isAuthenticated() && to.name === 'Login') {
    return { name: 'Home' }
  }
  // Allow navigation
  return true
})

export default router
