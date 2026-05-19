<template>
  <div>
    <p v-if="error">Error: {{ error }}</p>
    <ul v-else>
      <li v-for="profile in profiles" :key="profile.id">
        ID: {{ profile.id }} | User: {{ profile.user_id }} | ...
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
  let { data: profileData, error: err } = await supabase.from('profiles').select('*')

  console.log('profileData:', profileData)
  console.log('err:', err)

  if (err) {
    error.value = err.message
  } else {
    profiles.value = profileData
  }
})
const {
  data: { session },
} = await supabase.auth.getSession()
console.log('session:', session) // null if not logged in
</script>

<style scoped></style>
