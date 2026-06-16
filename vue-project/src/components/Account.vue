<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import Avatar from './Avatar.vue'
import { useThemeStore, THEMES } from '../stores/theme'

const props = defineProps(['claims'])
const { claims } = toRefs(props)

const themeStore = useThemeStore()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url, theme`)
      .eq('id', claims.value.sub)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.username
      website.value = data.website
      avatar_url.value = data.avatar_url
      themeStore.load(data.theme)
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const updates = {
      id: claims.value.sub,
      username: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      theme: themeStore.theme,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    let { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <form @submit.prevent="updateProfile">
        <div class="avatar-wrapper">
          <Avatar v-model:path="avatar_url" @upload="updateProfile" size="8" />
        </div>

        <label for="email">Email</label>
        <input id="email" type="text" :value="claims.email" disabled />

        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" placeholder="Your name" />

        <label for="website">Website</label>
        <input id="website" type="url" v-model="website" placeholder="https://yoursite.com" />

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Update profile' }}
        </button>
        <button type="button" class="btn btn-outline" @click="signOut" :disabled="loading">
          Sign out
        </button>
      </form>

      <div class="theme-section">
        <h2>Theme</h2>
        <div class="theme-grid">
          <button
            v-for="t in THEMES"
            :key="t"
            :class="['theme-swatch', `swatch-${t}`, { active: themeStore.theme === t }]"
            :title="t"
            @click="themeStore.apply(t)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
