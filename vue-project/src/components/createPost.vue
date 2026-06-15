<template>
  <div class="container">
    <div class="form">
      <h1>Create a Post</h1>
      <div v-if="errorMsg">{{ errorMsg }}</div>
      <div>
        <label for="caption">Write something...</label>
        <textarea
          id="caption"
          v-model="caption"
          class="input"
          placeholder="Write..."
          rows="4"
          :disabled="loading"
        />
      </div>
      <div class="buttonGroup">
        <button @click="handleCreatePost" class="btn-primary" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Post' }}
          <svg class="underline" viewBox="0 0 100 4" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2 Q50 6 100 2" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
        <router-link :to="{ name: 'Home' }" class="btn-secondary"> Cancel </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')
const caption = ref('')

const handleCreatePost = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    if (!caption.value.trim()) {
      throw new Error('Caption is required')
    }

    const userId = auth.user?.id
    if (!userId) {
      throw new Error('You must be logged in to create a post')
    }

    const { error } = await supabase.from('posts').insert({
      author_id: userId,
      caption: caption.value,
      created_at: new Date().toISOString(),
    })

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`)
    }

    router.push({ name: 'Home' })
  } catch (err) {
    errorMsg.value = err instanceof Error ? err.message : String(err)
    console.error('Error creating post:', err)
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

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  font-family: 'Cause', cursive;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h1 {
  font-family: 'Dancing Script', cursive;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.buttonGroup {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn .underline {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -6px;
  width: calc(100% - 20px);
  height: 8px;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.25s,
    transform 0.25s;
}

.btn:hover .underline {
  opacity: 1;
  transform: translateY(0);
}

button {
  font-family: 'Cause', cursive;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
  position: relative;
  border: none;
  background: #ca998f;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary {
  background: #ca998f;
  color: white;
}

.btn-secondary {
  font-family: 'Cause', cursive;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
  position: relative;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
