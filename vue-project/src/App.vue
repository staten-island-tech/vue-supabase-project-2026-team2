<<<<<<< HEAD
=======
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

>>>>>>> 843e350 (j)
<script setup>
import { onMounted, ref } from 'vue'
import Account from './components/Account.vue'
import Auth from './components/Auth.vue'
import { supabase } from './supabase'

const claims = ref()

onMounted(() => {
  supabase.auth.getClaims().then(({ data }) => {
    claims.value = data.claims
  })

  supabase.auth.onAuthStateChange(async () => {
    const { data } = await supabase.auth.getClaims()
    claims.value = data.claims
  })
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="claims" :claims="claims" />
    <Auth v-else />
  </div>
</template>
