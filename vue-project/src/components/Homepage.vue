<template>
  <div class="container">
    <div class="header">
      <h1>Homepage</h1>
      <router-link :to="{ name: 'CreatePost' }" class="createPostBtn"> Create Post </router-link>
    </div>
  </div>
  <div v-if="loading">Loading…</div>
  <div v-else-if="errorMsg">{{ errorMsg }}</div>
  <div v-else>
    <div v-for="post in posts" :key="post.id" class="card">
      <div>
        <div class="time">{{ new Date(post.createdAt).toLocaleString() }}</div>
      </div>
      <post class="caption">{{ post.caption }}</post>
      <div>
        <div class="likes">
          <button @click="Like(post)" class="likeBtn" :class="{ liked: post.isLiked }">
            {{ post.isLiked ? '❤️' : '♥' }} {{ post.likesCount }} Like
          </button>
          <div>💬 {{ post.commentsCount }} Comment</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const posts = ref([])
const loading = ref(true)
const errorMsg = ref('')
const auth = useAuthStore()
const route = useRoute()
const currentUserId = computed(() => auth.user?.id)

async function loadHome() {
  loading.value = true
  errorMsg.value = ''

  try {
    console.log('Fetching posts')

    const { data: simplePosts, error: simpleError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (simpleError) {
      errorMsg.value = `Error: ${simpleError.message}`
      loading.value = false
      return
    }

    if (!simplePosts || simplePosts.length === 0) {
      errorMsg.value = 'No posts.'
      loading.value = false
      return
    }

    const authorIds = [...new Set(simplePosts.map((p) => p.author_id).filter(Boolean))]
    const { data: profiles } = await supabase.from('profiles').select('*').in('id', authorIds)

    const profileMap = {}
    profiles?.forEach((post) => {
      profileMap[post.id] = post
    })

    const postIds = simplePosts.map((post) => post.id)
    const { data: likes } = await supabase.from('likes').select('*').in('post_id', postIds)
    const { data: comments } = await supabase.from('comments').select('*').in('post_id', postIds)

    const likesMap = {}
    const userLikesMap = {}
    likes?.forEach((like) => {
      if (!likesMap[like.post_id]) likesMap[like.post_id] = []
      likesMap[like.post_id].push(like)
      if (like.user_id === currentUserId.value) {
        userLikesMap[like.post_id] = true
      }
    })

    const commentsMap = {}
    comments?.forEach((c) => {
      if (!commentsMap[c.post_id]) commentsMap[c.post_id] = []
      commentsMap[c.post_id].push(c)
    })

    posts.value = simplePosts.map((row) => ({
      id: row.id,
      caption: row.caption,
      createdAt: row.created_at,
      author: profileMap[row.author_id] || { username: 'Unknown', full_name: 'Unknown User' },
      likesCount: (likesMap[row.id] || []).length,
      commentsCount: (commentsMap[row.id] || []).length,
      isLiked: !!userLikesMap[row.id],
    }))
  } catch (err) {
    console.error('Error', err)
    errorMsg.value = `Error: ${err.message}`
  } finally {
    loading.value = false
  }
}

async function Like(post) {
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

onMounted(loadHome)

watch(
  () => route.name,
  () => {
    if (route.name === 'Home' || route.name === 'DevHomepage') {
      loadHome()
    }
  },
)
</script>

<style scoped>
.dancing-script {
  font-family: 'Dancing Script', cursive;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}

.cause {
  font-family: 'Cause', cursive;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.header {
  font-family: 'Dancing Script', cursive;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.createPostBtn {
  font-family: 'Cause', cursive;
  background: #ca998f;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.card {
  background-color: rgb(248, 246, 244);
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
}

.time {
  font-family: 'Cause', cursive;
  font-size: 12px;
  color: #888;
}

.caption {
  font-family: 'Cause', cursive;
  margin-top: 10px;
  font-size: 15px;
}

.likes {
  display: flex;
  gap: 15px;
  font-size: 14px;
}

.likeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #3b3a3a;
  padding: 0;
  transition: color 0.2s;
}

.likeBtn:hover {
  color: #5c001d;
}

.likeBtn.liked {
  color: #5c001d;
}
</style>
