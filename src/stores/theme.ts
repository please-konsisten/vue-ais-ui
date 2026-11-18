import { defineStore } from "pinia"
import { ref, watch } from "vue"

type Theme = "dark" | "light" | "system"

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = (localStorage.getItem('user-theme') as Theme) || 'system'
  const theme = ref<Theme>(savedTheme)

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem('user-theme', newTheme)
  }

  function applyTheme(currentTheme: Theme) {
    const root = document.documentElement
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (currentTheme === 'dark' || (currentTheme === 'system' && isSystemDark)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: true })

  return {
    theme,
    setTheme
  }
})
