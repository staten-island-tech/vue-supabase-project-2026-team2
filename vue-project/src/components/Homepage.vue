<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const posts = ref([])
const loading = ref(true)
const errorMsg = ref('')
const auth = useAuthStore()
const currentUserId = computed(() => auth.user?.id)

async function loadFeed() {
  loading.value = true
  errorMsg.value = ''

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      author_id,
      caption,
      media_url,
      created_at,
      profiles (
        id,
        username,
        full_name,
        avatar_url
      ),
      likes (
        user_id
      ),
      comments (
        author_id
      )
    `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  posts.value = (data || []).map((row) => {
    const userLike = (row.likes || []).find((like) => like.user_id === currentUserId.value)
    return {
      id: row.id,
      caption: row.caption,
      createdAt: row.created_at,
      author: row.profiles,
      mediaUrl: row.media_url,
      likesCount: (row.likes || []).length,
      commentsCount: (row.comments || []).length,
      isLiked: !!userLike,
    }
  })

  loading.value = false
}

async function toggleLike(post) {
  try {
    if (post.isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', currentUserId.value)
      post.isLiked = false
      post.likesCount--
    } else {
      await supabase.from('likes').insert({
        post_id: post.id,
        user_id: currentUserId.value,
      })
      post.isLiked = true
      post.likesCount++
    }
  } catch (err) {
    console.error('Error toggling like:', err)
  }
}

onMounted(loadFeed)
</script>

<template>
  <div class="feed">
    <div v-if="loading" class="status">Loading…</div>
    <div v-else-if="errorMsg" class="status error">{{ errorMsg }}</div>

    <div v-else class="post-list">
      <article v-for="p in posts" :key="p.id" class="post-card">
        <header class="post-header">
          <img v-if="p.author?.avatar_url" :src="p.author.avatar_url" class="avatar" alt="avatar" />
          <div>
            <div class="username">{{ p.author?.username }}</div>
            <div class="timestamp">{{ new Date(p.createdAt).toLocaleString() }}</div>
          </div>
        </header>

        <div class="post-media">
          <!-- TODO: replace with real media -->
          <img v-if="p.mediaUrl" :src="p.mediaUrl" alt="post media" />
          <div v-else class="placeholder">No media yet</div>
        </div>

        <p class="caption">{{ p.caption }}</p>

        <footer class="post-actions">
          <div class="actions-row">
            <button @click="toggleLike(p)" class="action-btn" :class="{ liked: p.isLiked }">
              {{ p.isLiked ? '❤️' : '♥' }} {{ p.likesCount }} Like
            </button>
            <span class="action-btn">💬 {{ p.commentsCount }} Comment</span>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.feed {
  max-width: 600px;
  margin: 0 auto;
}
.post-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
}
.post-header {
  display: flex;
  gap: 10px;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
}
.username {
  font-weight: 700;
}
.post-media img {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}
.placeholder {
  background: #f6f6f6;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 10px;
}
.post-actions {
  margin-top: 10px;
}
.actions-row {
  display: flex;
  gap: 15px;
  font-size: 14px;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  padding: 0;
  transition: color 0.2s;
}
.action-btn:hover {
  color: #e0245e;
}
.action-btn.liked {
  color: #e0245e;
}
.status {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}
.error {
  color: #e0245e;
}
</style>
