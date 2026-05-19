<<<<<<< Updated upstream
<template><RouterView /></template>
=======
<template>
  <div>
    <p v-if="error">Error: {{ error }}</p>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        ID: {{ post.id }} | User: {{ post.user_id }} | ...
      </li>
    </ul>
    <div v-for="profile in profiles" :key="profile.id">
      <p>{{ profile.username }}</p>
      <p>{{ profile.password }}</p>
      <p>{{ profile.profilePicture }}</p>
    </div>
  </div>
  <RouterView />
</template>
>>>>>>> Stashed changes

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
