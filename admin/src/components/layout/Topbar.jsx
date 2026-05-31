import { Globe } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useAuthStore from '../../store/authStore.js'

const Topbar = ({ title }) => {
  const { lang, toggleLang } = useLanguage()
  const { admin } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-neutralSurface-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      {/* Title */}
      <div className="flex items-center">
        <h2 className="text-xl sm:text-2xl font-black text-tertiary-900 tracking-tight">{title}</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">

        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-tertiary-700 hover:text-teal-600 bg-neutralSurface-50 hover:bg-neutralSurface-100 px-4 py-2 rounded-xl text-sm font-black border border-neutralSurface-200 transition"
        >
          <Globe size={16} />
          {lang === 'en' ? 'عربي' : 'English'}
        </button>

        {/* Profile Avatar */}
        {admin && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white text-sm font-black shadow-sm shadow-sky-600/20">
            {admin.firstName?.[0]?.toUpperCase() || 'A'}
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar