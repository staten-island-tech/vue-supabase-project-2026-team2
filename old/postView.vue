<template>
  <div class="container">
    <p v-if="error">Error: {{ error }}</p>
    <ul v-else>
      <postCard v-for="post in posts" :key="post.id"> </postCard>
    </ul>
  </div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import { useCounterStore } from '@/stores/counter.js'
import postCard from '@/components/postCard.vue'
const store = useCounterStore()
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
