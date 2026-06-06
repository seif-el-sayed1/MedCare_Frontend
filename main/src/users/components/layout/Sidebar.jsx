import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, CalendarDays, Clock, UserCircle,
  LogOut, ChevronLeft, ChevronRight, Moon, Sun,
} from 'lucide-react'
import { useState } from 'react'
import useUserAuthStore from '../../store/authStore.js'
import useLangStore from '../../../store/langStore.js'
import useThemeStore from '../../../store/themeStore.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { path: '/home',         icon: Home,        label: { en: 'Home',         ar: 'الرئيسية' } },
  { path: '/appointments', icon: CalendarDays, label: { en: 'Appointments', ar: 'مواعيدي' } },
  { path: '/waiting-list', icon: Clock,        label: { en: 'Waiting List', ar: 'قائمة الانتظار' } },
  { path: '/profile',      icon: UserCircle,   label: { en: 'Profile',      ar: 'الملف الشخصي' } },
]

const Sidebar = () => {
  const { lang, toggleLang } = useLangStore()
  const isRTL = lang === 'ar'
  const { theme, toggleTheme } = useThemeStore()
  const { logout, user } = useUserAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success(lang === 'ar' ? 'تم تسجيل الخروج' : 'Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className={`
      relative hidden md:flex flex-col bg-tertiary-900 border-r border-tertiary-800
      transition-all duration-300 min-h-screen flex-shrink-0
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-tertiary-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-600/30">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-neutralSurface-50 font-bold text-xl leading-none tracking-tight">MedCare</h1>
            <p className="text-tertiary-400 text-xs mt-0.5">Patient Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                : 'text-tertiary-400'
              }
              ${collapsed ? 'justify-center' : ''}
              `
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{item.label[lang]}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Actions */}
      <div className="border-t border-tertiary-800 p-3 space-y-1">
        {/* Theme Toggle */}
        {!collapsed && (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-tertiary-400 hover:bg-tertiary-800 hover:text-white text-sm transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark'
              ? (lang === 'ar' ? 'الوضع النهاري' : 'Light Mode')
              : (lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode')
            }
          </button>
        )}

        {/* Lang Toggle */}
        {!collapsed && (
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-tertiary-400 hover:bg-tertiary-800 hover:text-white text-sm transition"
          >
            🌐 {lang === 'en' ? 'عربي' : 'English'}
          </button>
        )}

        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="text-neutralSurface-50 text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-tertiary-400 text-xs truncate">{user.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-sm font-medium text-tertiary-400 hover:bg-red-500/10 hover:text-red-400 transition ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className={`absolute bg-tertiary-800 border border-tertiary-700 text-tertiary-400 hover:text-white rounded-full p-1 transition z-10 ${isRTL ? '-left-3' : '-right-3'}`}
        style={{ top: '72px' }}
      >
        {isRTL
          ? (collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)
          : (collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)
        }
      </button>
    </aside>
  )
}

export default Sidebar