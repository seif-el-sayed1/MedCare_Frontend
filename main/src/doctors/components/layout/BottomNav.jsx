import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Star, UserCircle } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'

const NAV_ITEMS = [
  { path: '/doctor/dashboard',    icon: LayoutDashboard, label: { en: 'Dashboard',    ar: 'الرئيسية' } },
  { path: '/doctor/appointments', icon: CalendarDays,    label: { en: 'Appointments', ar: 'المواعيد' } },
  { path: '/doctor/ratings',      icon: Star,            label: { en: 'Ratings',      ar: 'التقييمات' } },
  { path: '/doctor/profile',      icon: UserCircle,      label: { en: 'Profile',      ar: 'الملف الشخصي' } },
]

const BottomNav = () => {
  const { lang } = useLanguage()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-neutralSurface-200 dark:border-gray-700 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'text-teal-600' 
                  : 'text-tertiary-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-teal-50 dark:bg-teal-900/30' : ''}`}>
                  <item.icon size={22} />
                </div>
                <span className="text-xs font-medium">{item.label[lang]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav