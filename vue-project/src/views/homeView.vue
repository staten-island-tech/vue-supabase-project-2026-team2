<template>
  <div class="container">
    <p v-if="error">Error: {{ error }}</p>
    <ul v-else>
      <li v-for="transaction in transactions" :key="transaction.id">
        ID: {{ transaction.id }} | User: {{ transaction.user_id }} | ...
      </li>
    </ul>
  </div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import postCard from '@/components/postCard.vue'
import { supabase } from './supabase'
const posts = ref([])
const error = ref(null)
onMounted(async () => {
  let { data: postData, error: err } = await supabase.from('posts').select('*')

  if (err) {
    error.value = err.message
  } else {
    posts.value = postData
  }
})
</script>

<style scoped>
.container {
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
