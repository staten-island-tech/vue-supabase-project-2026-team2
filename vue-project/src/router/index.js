import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Account from '@/components/Account.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'

async function isAuthenticated() {
  const auth = useAuthStore()
  // if not initialized, init() will restore session/user
  if (!auth.user && !auth.session) {
    await auth.init()
  }
  return !!auth.user
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
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/changeprofile',
      name: 'ChangeProfile',
      component: Account,
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
router.beforeEach(async (to) => {
  const auth = await isAuthenticated()

  if (!auth && to.name !== 'Login' && to.name !== 'Register') {
    return { name: 'Login' }
  }
  if (auth && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'Home' }
  }
  return true
})

export default router
