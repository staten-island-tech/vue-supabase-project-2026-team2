<template>
  <div>
    <p v-if="loading">Loading profiles...</p>

    <p v-else-if="error">Error: {{ error }}</p>

    <ul v-else-if="profiles.length">
      <li v-for="profile in profiles" :key="profile.id">
        ID: {{ profile.id }} | User: {{ profile.user_id }}
      </li>
    </ul>

    <p v-else>No profiles found.</p>
  </div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const profiles = ref([])
const error = ref(null)
const loading = ref(true) // Start with loading as true

onMounted(async () => {
  try {
    const { data: profileData, error: err } = await supabase.from('profiles').select('id, user_id')

    if (err) throw err // Jump straight to the catch block if there's an error

    profiles.value = profileData
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false // Turn off loading whether it succeeded or failed
  }
})
</script>

<style scoped>
/* Your styles here */
</style>
