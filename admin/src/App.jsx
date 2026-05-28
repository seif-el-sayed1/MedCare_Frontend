import { Toaster } from 'react-hot-toast'
import AppRouter from './router/index.jsx'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />
      <AppRouter />
    </>
  )
}

export default App