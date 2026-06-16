import { defineStore } from 'pinia'
import { ref } from 'vue'

export const THEMES = ['light', 'dark', 'forest', 'sunset']

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light')

  function apply(name) {
    theme.value = name
    document.documentElement.setAttribute('data-theme', name)
  }

  function load(savedTheme) {
    const t = THEMES.includes(savedTheme) ? savedTheme : 'light'
    apply(t)
  }

  return { theme, apply, load }
})
