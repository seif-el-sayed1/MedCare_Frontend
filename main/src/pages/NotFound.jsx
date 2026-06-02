const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutralSurface-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4 px-12 py-14">
        <h1 className="text-7xl font-bold text-teal-600">404</h1>
        <p className="text-tertiary-500 dark:text-slate-400 text-lg text-center">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  )
}

export default NotFound