import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutralSurface-50 flex flex-col items-center justify-center gap-6 px-4">
      <div className="bg-white rounded-2xl border border-neutralSurface-200 shadow-sm flex flex-col items-center gap-4 px-12 py-14">
        <h1 className="text-7xl font-bold text-teal-600">404</h1>
        <p className="text-tertiary-500 text-lg text-center">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-2 px-6 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}

export default NotFound