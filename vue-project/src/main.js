import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const auth = useAuthStore()
await auth.init()

app.mount('#app')
// https://supabase.com/docs/guides/getting-started/tutorials/with-vue-3
