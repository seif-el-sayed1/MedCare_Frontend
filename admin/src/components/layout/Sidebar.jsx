import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Stethoscope, CalendarDays,
  Users, UserCog, ClipboardList,
  LogOut, ChevronLeft, ScanLine,
  ChevronRight, QrCode, UserCircle
} from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore.js'
import useLanguage from '../../hooks/useLanguage.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: { en: 'Dashboard', ar: 'الرئيسية' },
  },
  {
    path: '/doctors',
    icon: Stethoscope,
    label: { en: 'Doctors', ar: 'الأطباء' },
  },
  {
    path: '/appointments',
    icon: CalendarDays,
    label: { en: 'Appointments', ar: 'المواعيد' },
  },
  {
    path: '/users',
    icon: Users,
    label: { en: 'Users', ar: 'المرضى' },
  },
  {
    path: '/admins',
    icon: UserCog,
    label: { en: 'Admins', ar: 'الأدمنز' },
  },
  {
    path: '/waiting-list',
    icon: ClipboardList,
    label: { en: 'Waiting List', ar: 'قائمة الانتظار' },
  },
  {
    path: '/scanner',
    icon: QrCode,
    label: { en: 'QR Scanner', ar: 'مسح QR' },
  },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { logout, admin } = useAuthStore()
  const { lang, isRTL } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
    navigate('/login')
  }

  return (
    <div 
      className={`sticky top-0 h-screen bg-white dark:bg-slate-800 border-e border-neutralSurface-200 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 flex-shrink-0 z-30 shadow-sm dark:shadow-black/20
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-neutralSurface-200 dark:border-slate-700 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-sky-600 flex items-center justify-center shadow-md shadow-teal-600/20 flex-shrink-0">
          <ScanLine size={20} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-black text-2xl text-tertiary-900 dark:text-slate-100 tracking-tight block">
            MedCare
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-black transition-all duration-200 group
              ${isActive 
              ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-md shadow-teal-600/20' 
              : 'text-tertiary-600 dark:text-slate-400 hover:bg-neutralSurface-100 dark:hover:bg-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon size={22} className="flex-shrink-0 transition-colors" />
            {!collapsed && <span className="tracking-wide">{item.label[lang]}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin Info + Profile + Logout */}
      <div className="border-t border-neutralSurface-200 dark:border-slate-700 p-3 space-y-1 bg-neutralSurface-50/50 dark:bg-slate-800/50">
        {!collapsed && admin && (
          <div className="px-4 py-3 mb-1 bg-white dark:bg-slate-700 rounded-xl border border-neutralSurface-200 dark:border-slate-600 shadow-sm">
            <p className="text-tertiary-900 dark:text-slate-100 text-sm font-black truncate">
              {admin.firstName} {admin.lastName}
            </p>
            <p className="text-tertiary-500 dark:text-slate-400 text-xs font-bold truncate mt-0.5">{admin.email}</p>
          </div>
        )}
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-base font-black transition-all duration-200
            ${isActive
              ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-md shadow-teal-600/20'
              : 'text-tertiary-600 dark:text-slate-400 hover:bg-neutralSurface-100 dark:hover:bg-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400'}
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <UserCircle size={22} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-base font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={22} className="flex-shrink-0" />
          {!collapsed && <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed((p) => !p)}
        className={`absolute top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 border border-neutralSurface-200 dark:border-slate-600 text-tertiary-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500 rounded-full p-2 transition-all z-40 shadow-md
          ${isRTL ? '-start-4' : '-end-4'}`}
      >
        {collapsed ? (
          isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
        ) : (
          isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
        )}
      </button>
    </div>
  )
}

export default Sidebar