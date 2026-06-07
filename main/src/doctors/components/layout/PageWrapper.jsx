import Sidebar from './Sidebar.jsx'
import Topbar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'
import useLanguage from '../../hooks/useLanguage.js'

const PageWrapper = ({ children, title }) => {
  const { isRTL } = useLanguage()

  return (
    <div className="flex min-h-screen bg-neutralSurface-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Nav — mobile only */}
      <BottomNav />
    </div>
  )
}

export default PageWrapper