<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailPassword } from '@/lib/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref(null)

async function onSubmit() {
  errorMsg.value = null

  try {
    await signInWithEmailPassword(email.value, password.value)
    router.push('/') // go to home after login
  } catch (e) {
    errorMsg.value = e?.message || 'Login failed'
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button type="submit">Login</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </form>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>
      <form class="login-form" @submit.prevent="onSubmit">
        <label>
          Email
          <input v-model="email" type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input v-model="password" type="password" placeholder="••••••••" />
        </label>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" class="btn">Sign in</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
  padding: 26px;
}

.login-card h1 {
  margin: 0 0 18px;
  font-size: 24px;
  color: #111827;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #111827;
}

input {
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  font-size: 14px;
  background: #fff;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
}

.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-size: 13px;
}

.btn {
  margin-top: 8px;
  padding: 12px 14px;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  transition:
    transform 0.05s ease,
    background 0.15s ease;
}

.btn:hover {
  background: #4338ca;
}

.btn:active {
  transform: translateY(1px);
}
</style>
