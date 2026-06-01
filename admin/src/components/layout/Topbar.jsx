import { useEffect } from 'react'
import { Globe, Sun, Moon } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useTheme from '../../hooks/useTheme.js'
import useAuthStore from '../../store/authStore.js'

const Topbar = ({ title }) => {
  const { lang, toggleLang } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { admin } = useAuthStore()

  useEffect(() => {
    const el = document.getElementById('debug-html-class')
    if (el) {
      el.textContent = document.documentElement.classList.contains('dark') ? 'YES (has dark)' : 'NO (no dark)'
    }
  }, [isDark])

  return (
    <>
      <div style={{ position: 'fixed', bottom: 0, left: 0, padding: '4px 10px', fontSize: 12, zIndex: 9999, background: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000', borderTop: '2px solid teal', display: 'flex', gap: 8 }}>
        <span>zustand: <b>{isDark ? 'DARK' : 'LIGHT'}</b></span>
        <span>|</span>
        <span>html class: <b id="debug-html-class">?</b></span>
      </div>
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-neutralSurface-200 dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      {/* Title */}
      <div className="flex items-center">
        <h2 className="text-xl sm:text-2xl font-black text-tertiary-900 dark:text-slate-100 tracking-tight">{title}</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 text-tertiary-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 bg-neutralSurface-50 dark:bg-slate-700/50 hover:bg-neutralSurface-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border border-neutralSurface-200 dark:border-slate-600 transition"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-tertiary-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 bg-neutralSurface-50 dark:bg-slate-700/50 hover:bg-neutralSurface-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border border-neutralSurface-200 dark:border-slate-600 transition"
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
    </>
  )
}

export default Topbar