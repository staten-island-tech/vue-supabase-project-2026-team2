<template>
  <form class="row flex-center flex" @submit.prevent="handleRegister">
    <div class="col-6 form-widget">
      <h1 class="header">Sign Up</h1>

      <div>
        <input
          class="input"
          type="email"
          placeholder="Your email"
          v-model="email"
          autocomplete="email"
          required
        />
      </div>

      <div>
        <input class="input" type="password" placeholder="Password" v-model="password" required />
      </div>

      <div>
        <input
          class="input"
          type="password"
          placeholder="Confirm password"
          v-model="confirmPassword"
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

      <div style="margin-top: 0.5rem">
        <router-link class="button secondary block" :to="{ name: 'Login' }"> Sign in </router-link>
      </div>
    </div>
  </form>
  <RouterView />
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
    if (password.value !== confirmPassword.value) throw new Error('Passwords do not match.')

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
      alert('Confirm your account through your email.')
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

<style scoped>
.dancing-script-<uniquifier > {
  font-family: 'Dancing Script', cursive;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}

.cause-<uniquifier > {
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

.form-widget {
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

.input:focus {
  font-family: 'Cause', cursive;
  outline: none;
  border-color: #ca998f;
  box-shadow: 0 0 0 3px #0066cc26;
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
}

.button.block {
  display: block;
  width: 100%;
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
