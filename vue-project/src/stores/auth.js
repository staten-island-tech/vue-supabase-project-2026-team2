import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const profile = ref(null)
  const loading = ref(false)

  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data?.session ?? null
    user.value = session.value?.user ?? null

    if (user.value) {
      const { data: pgProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      if (!error) profile.value = pgProfile
    }

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession ?? null
      user.value = newSession?.user ?? null
      if (user.value) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single()
          .then(({ data: pgProfile }) => (profile.value = pgProfile))
      } else {
        profile.value = null
      }
    })
  }

  async function refreshAuth() {
    const { data } = await supabase.auth.getSession()
    session.value = data?.session ?? null
    user.value = session.value?.user ?? null
    if (user.value) {
      const { data: pgProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      if (!error) profile.value = pgProfile
    }
  }

  return { user, session, profile, loading, init, refreshAuth }
})
