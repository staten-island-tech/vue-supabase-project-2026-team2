<script setup>
import { ref, onMounted } from 'vue'
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

<template></template>

<style scoped></style>
