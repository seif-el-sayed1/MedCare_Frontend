import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Clock, UserCircle } from 'lucide-react'
import useLangStore from '../../../store/langStore.js'

const NAV_ITEMS = [
  { path: '/home',         icon: Home,         label: { en: 'Home',         ar: 'الرئيسية' } },
  { path: '/appointments', icon: CalendarDays,  label: { en: 'Appointments', ar: 'مواعيدي' } },
  { path: '/waiting-list', icon: Clock,         label: { en: 'Waiting',      ar: 'الانتظار' } },
  { path: '/profile',      icon: UserCircle,    label: { en: 'Profile',      ar: 'حسابي' } },
]

const BottomNav = () => {
  const { lang } = useLangStore()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-neutralSurface-200 dark:border-gray-700 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all ${
                isActive 
                  ? 'text-teal-600' 
                  : 'text-tertiary-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-teal-50 dark:bg-teal-900/30' : ''}`}>
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