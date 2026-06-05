<template>
  <div>
    <p v-if="error">Error: {{ error }}</p>

    <ul v-else>
      <li v-for="profile in profiles" :key="profile.id">
        ID: {{ profile.id }} | User: {{ profile.user_id }}
      </li>
    </ul>
  </div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const profiles = ref([])
const error = ref(null)

onMounted(async () => {
  // Fetching from the 'profiles' table
  let { data: profileData, error: err } = await supabase.from('profiles').select('*')

  if (err) {
    error.value = err.message
  } else {
    profiles.value = profileData
  }
})
</script>

<style scoped></style>
