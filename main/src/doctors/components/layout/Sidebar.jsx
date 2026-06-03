import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, Star, UserCircle, LogOut, Stethoscope,
  ChevronLeft, ChevronRight, Moon, Sun,
} from 'lucide-react'
import { useState } from 'react'
import useDoctorAuthStore from '../../store/authStore.js'
import useThemeStore from '../../../store/themeStore.js'
import useLanguage from '../../hooks/useLanguage.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { path: '/doctor/dashboard',    icon: LayoutDashboard, label: { en: 'Dashboard',    ar: 'الرئيسية' } },
  { path: '/doctor/appointments', icon: CalendarDays,    label: { en: 'Appointments', ar: 'المواعيد' } },
  { path: '/doctor/ratings',      icon: Star,            label: { en: 'Ratings',      ar: 'التقييمات' } },
  { path: '/doctor/profile',      icon: UserCircle,      label: { en: 'Profile',      ar: 'الملف الشخصي' } },
]

const Sidebar = () => {
  const { lang, isRTL } = useLanguage()
  const { theme, toggleTheme } = useThemeStore()
  const { logout, doctor } = useDoctorAuthStore()
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
          <Stethoscope size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-neutralSurface-50 font-bold text-xl leading-none tracking-tight">MedCare</h1>            <p className="text-tertiary-400 text-xs mt-0.5">Doctor Portal</p>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
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

      {/* Doctor Info + Logout */}
      <div className="border-t border-tertiary-800 p-3 space-y-1">
        {/* Theme Toggle */}
        {!collapsed && (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-tertiary-400 hover:bg-tertiary-800 hover:text-white text-sm transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark'
              ? (lang === 'ar' ? 'الوضع النهاري' : 'Light Mode')
              : (lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode')
            }
          </button>
        )}

        {!collapsed && doctor && (
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-sm font-medium truncate">
              Dr. {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-tertiary-400 text-xs truncate">{doctor.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-tertiary-400 
            hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <buttonmed
        onClick={() => setCollapsed((p) => !p)}
        className={`absolute bg-tertiary-800 border border-tertiary-700 text-tertiary-400 hover:text-white rounded-full p-1 transition-all z-10
          ${isRTL ? '-left-3' : '-right-3'}
        `}
        style={{ top: '72px' }}
      >
        {isRTL
          ? (collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)
          : (collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)
        }
      </buttonmed>
    </aside>
  )
}

export default Sidebar