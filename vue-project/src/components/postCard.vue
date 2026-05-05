<template>
  <div class="card"></div>
</template>

<script setup>
defineProps({
  skin: {
    type: Object,
    required: true,
  },
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
