import { create } from 'zustand'

const savedTheme = localStorage.getItem('theme') || 'light'

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const useThemeStore = create((set) => ({
  theme: savedTheme,

  toggleTheme: () => {
    const isDark = document.documentElement.classList.toggle('dark')
    const newTheme = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    set({ theme: newTheme })
  },
}))

export default useThemeStore
