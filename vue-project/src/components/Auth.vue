<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Welcome</h1>
      <p>Sign in via magic link with your email below</p>
      <form @submit.prevent="handleLogin">
        <label for="email">Email address</label>
        <input id="email" type="email" placeholder="you@example.com" v-model="email" />
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send magic link' }}
        </button>
      </form>
    </div>
  </div>
</template>
