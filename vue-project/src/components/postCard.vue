<template>
  <div class="card">
    <img v-if="post.image_url" :src="post.image_url" :alt="post.title" class="card-image" />
    <div class="card-body">
      <h3 class="card-title">{{ post.title }}</h3>
      <p class="card-meta">
        <span>{{ post.author || 'Unknown' }}</span>
        <span v-if="formattedDate">{{ formattedDate }}</span>
      </p>
      <p class="card-excerpt">{{ post.excerpt || post.body }}</p>
      <div class="card-actions">
        <button @click="emit('view', post)">View</button>
        <button @click="emit('edit', post)">Edit</button>
        <button @click="emit('delete', post)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])

const formattedDate = computed(() => {
  const t = props.post?.created_at || props.post?.createdAt
  if (!t) return ''
  const d = new Date(t)
  return isNaN(d.getTime()) ? '' : d.toLocaleString()
})
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
