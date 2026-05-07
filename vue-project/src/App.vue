<template>
  <div>
    <ul>
      <li v-for="profile in profiles" :key="profile.id">{{ profile.id }}</li>
    </ul>
  </div>
  <RouterView />
</template>

<script setup>
/* import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

const todos = ref([])

async function getTodos() {
  const { data } = await supabase.from('todos').select()
  todos.value = data
}

onMounted(() => {
  getTodos()
})
 */
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

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
