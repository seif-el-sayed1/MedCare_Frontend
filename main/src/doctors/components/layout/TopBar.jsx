import { Globe, LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useLanguage from '../../hooks/useLanguage.js'
import useThemeStore from '../../../store/themeStore.js'
import useDoctorAuthStore from '../../store/authStore.js'

const Topbar = ({ title }) => {
  const { lang, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useThemeStore()
  const { doctor, logout } = useDoctorAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success(lang === 'ar' ? 'تم تسجيل الخروج' : 'Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-neutralSurface-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Page Title */}
      <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-base md:text-lg">{title}</h2>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-neutralSurface-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded-xl text-xs md:text-sm transition font-medium"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Lang Toggle */}
        <button
          type="button"
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-neutralSurface-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded-xl text-xs md:text-sm transition font-medium"
        >
          <Globe size={15} />
          {lang === 'en' ? 'عربي' : 'English'}
        </button>

        {/* Avatar */}
        {doctor && (
          <div className="w-8 h-8 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {doctor.firstName?.[0]?.toUpperCase()}
          </div>
        )}

        {/* Logout — desktop only */}
        <button
          type="button"
          onClick={handleLogout}
          className="hidden md:flex items-center gap-1.5 text-tertiary-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-xl text-sm transition"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}

export default Topbar