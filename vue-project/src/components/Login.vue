// ...existing code...
<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Login</h1>
      <p class="description">Sign in with email and password</p>

      <div>
        <input
          class="inputField"
          type="email"
          placeholder="Your email"
          v-model="email"
          autocomplete="username"
        />
      </div>

      <div>
        <input
          class="inputField"
          type="password"
          placeholder="Your password"
          v-model="password"
          autocomplete="current-password"
        />
      </div>

      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading...' : 'Sign in'"
          :disabled="loading"
        />
      </div>

      <!-- link to Register page -->
      <div style="margin-top: 0.5rem">
        <router-link class="button secondary block" :to="{ name: 'Register' }">
          Create an account
        </router-link>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    if (!email.value || !password.value) throw new Error('Email and password are required.')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    // on success, redirect to home (adjust route name if needed)
    router.push({ name: 'Home' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
// ...existing code...
