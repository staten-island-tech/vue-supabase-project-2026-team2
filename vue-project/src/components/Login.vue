<template>
  <form @submit.prevent="startLogin">
    <div class="container">
      <h1 class="header">Sign In</h1>
      <div>
        <input class="input" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input class="input" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div>
        <input
          type="submit"
          class="buttonPrimary"
          :value="loading ? 'Loading...' : 'Sign in'"
          :disabled="loading"
        />
      </div>
      <div class="signUp">
        <router-link class="buttonSecondary" :to="{ name: 'Register' }"> Sign Up </router-link>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const startLogin = async () => {
  try {
    loading.value = true
    if (!email.value || !password.value) throw new Error('Email and password are required.')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    await auth.refreshAuth()
    router.push({ name: 'Home' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dancing-script {
  font-family: 'Dancing Script', cursive;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}

.cause {
  font-family: 'Cause', cursive;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}

form {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.signUp {
  margin-top: 0.5rem;
}

.container {
  width: 100%;
  max-width: 380px;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.header {
  font-family: 'Dancing Script', cursive;
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
}

.input {
  font-family: 'Cause', cursive;
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.button {
  font-family: 'Cause', cursive;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
  display: block;
}

.button.secondary {
  background: #f5f5f5;
  color: #333;
}

.button:not(.secondary) {
  background: #ca998f;
  color: white;
}
</style>
