import useThemeStore from '../store/themeStore.js'

const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'
  return { theme, toggleTheme, isDark }
}

export default useTheme
