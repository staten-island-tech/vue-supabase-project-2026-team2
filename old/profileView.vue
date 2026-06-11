<template>
  <div></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user_id = computed(() => route.params.user_id || '')
</script>

<style lang="scss" scoped></style>
