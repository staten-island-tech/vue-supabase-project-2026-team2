<template>
  <div class="card">
    <h1 class="author">{{ post.author }}</h1>
    <img v-if="post.image_url" :src="post.image_url" :alt="post.title" />
    <p class="caption">{{ post.text }}</p>
    <div class="actions">
      <button @click="$emit('view', post)">View</button>
      <button @click="$emit('delete', post)">Delete</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'delete'])
</script>

<style scoped>
.card {
  width: 20vw;
  height: 20vw;
  border: 5px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
}
.card img {
  object-fit: contain;
  width: auto;
  height: auto;
}
</style>
