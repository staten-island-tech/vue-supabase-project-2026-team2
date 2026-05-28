<template>
  <div>
    <p v-if="error">Error: {{ error }}</p>

    <div v-else>
      <pre>{{ profiles }}</pre>

      <div v-for="(profile, index) in profiles" :key="index" class="profile-card">
        <p><strong>ID:</strong> {{ profile.id }}</p>
        <p><strong>Username:</strong> {{ profile.username }}</p>
        <p><strong>Password:</strong> {{ profile.password }}</p>

        <img
          v-if="profile.profile_picture"
          :src="profile.profile_picture"
          alt="Profile Picture"
          width="120"
        />
      </div>
    </div>

    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const profiles = ref([])
const error = ref(null)

onMounted(async () => {
  let { data: profileData, error: err } = await supabase.from('profiles').select('*')

  console.log(profileData)

  if (err) {
    error.value = err.message
  } else {
    profiles.value = profileData
  }
})
</script>

<style scoped></style>
