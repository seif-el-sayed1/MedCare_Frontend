import { Toaster } from 'react-hot-toast'
import AppRouter from './router/index.jsx'
import ThemeSync from './components/ThemeSync.jsx'
import useTheme from './hooks/useTheme.js'

function App() {
  const { isDark } = useTheme()

  return (
    <>
      <ThemeSync />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e293b' : '#0f172a',
            color: '#F8FAFC',
            borderRadius: '12px',
            fontSize: '14px',
            border: '1px solid #64748B',
          },
        }}
      />

      <AppRouter />
    </>
  )
}

export default App