<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10" />
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="claims.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>

    <div>
      <label for="bio">Bio</label>
      <textarea id="bio" v-model="bio" rows="4" />
    </div>

    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </form>
</template>

<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import Avatar from './Avatar.vue'

const props = defineProps(['claims'])
const { claims } = toRefs(props)

const loading = ref(true)
const username = ref('')
const bio = ref('')
const avatar_url = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    // determine user id from passed claims or from supabase client
    let userId = claims.value?.sub
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser()
      userId = userData?.user?.id
    }
    if (!userId) throw new Error('No authenticated user')

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, bio, avatar_url`)
      .eq('id', userId)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.username ?? ''
      bio.value = data.bio ?? ''
      avatar_url.value = data.avatar_url ?? ''
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    alert(msg)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    // determine user id as above
    let userId = claims.value?.sub
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser()
      userId = userData?.user?.id
    }
    if (!userId) throw new Error('No authenticated user')

    const updates = {
      id: userId,
      username: username.value,
      bio: bio.value,
      avatar_url: avatar_url.value,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
    // optional: show success feedback
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    alert(msg)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* small adjustments so textarea and avatar look decent */
.form-widget textarea {
  width: 100%;
  min-height: 4rem;
  resize: vertical;
  padding: 0.5rem;
  box-sizing: border-box;
}
</style>
