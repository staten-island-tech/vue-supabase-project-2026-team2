<template>
  <!-- <div>
    <p v-if="error">Error: {{ error }}</p>
    <div v-for="profile in profiles" :key="profile.id">
      <p>{{ profile.username }}</p>
      <p>{{ profile.password }}</p>
      <p>{{ profile.profilePicture }}</p>
    </div>
  </div>
  <RouterView /> -->

  <div>
    <p v-if="error">Error: {{ error }}</p>

    <div v-else>
      <pre>{{ profiles }}</pre>

      <div v-for="profile in profiles" :key="profile.id" class="profile-card">
        <p>{{ profile }}</p>
        <p><strong>Username:</strong> {{ profile.username }}</p>
        <p><strong>Password:</strong> {{ profile.password }}</p>
        console.log(profile)

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
import postCard from '@/components/postCard.vue'

const profiles = ref([])
const error = ref(null)

onMounted(async () => {
  let { data: profileData, error: err } = await supabase.from('profiles').select('*')
  if (err) {
    error.value = err.message
  } else {
    profiles.value = profileData
  }
})
</script>

<style scoped></style>
