<template>
  <div class="container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import postCard from '@/components/postCard.vue'
const post = ref([])
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
