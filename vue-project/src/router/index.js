import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Homepage from '@/components/Homepage.vue'
import CreatePost from '@/components/createPost.vue'

async function isAuthenticated() {
  const auth = useAuthStore()
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
      component: Homepage,
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
      path: '/create-post',
      name: 'CreatePost',
      component: CreatePost,
      meta: { requiresAuth: true },
    },
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
