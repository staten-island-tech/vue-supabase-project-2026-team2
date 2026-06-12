// ...existing code...
<template>
  <form class="row flex-center flex" @submit.prevent="handleRegister">
    <div class="col-6 form-widget">
      <h1 class="header">Register</h1>
      <p class="description">Create an account with email and password</p>

      <div>
        <input
          class="inputField"
          type="email"
          placeholder="Your email"
          v-model="email"
          autocomplete="email"
          required
        />
      </div>

      <div>
        <input
          class="inputField"
          type="password"
          placeholder="Password (min 6 chars)"
          v-model="password"
          autocomplete="new-password"
          required
        />
      </div>

      <div>
        <input
          class="inputField"
          type="password"
          placeholder="Confirm password"
          v-model="confirmPassword"
          autocomplete="new-password"
          required
        />
      </div>

      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Creating...' : 'Create account'"
          :disabled="loading"
        />
      </div>

      <!-- link back to Login page -->
      <div style="margin-top: 0.5rem">
        <router-link class="button secondary block" :to="{ name: 'Login' }">
          Already have an account? Sign in
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
const confirmPassword = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    loading.value = true

    if (!email.value || !password.value) throw new Error('Email and password are required.')
    if (password.value.length < 6) throw new Error('Password must be at least 6 characters.')
    if (password.value !== confirmPassword.value) throw new Error('Passwords do not match.')

    // sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    if (data?.user) {
      const userId = data.user.id
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: email.value,
        created_at: new Date().toISOString(),
      })
      if (profileError) console.warn('Profile upsert error:', profileError.message)
      router.push({ name: 'Home' })
    } else {
      alert('Check your email to confirm your account.')
      router.push({ name: 'Login' })
    }
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
