import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'
import useLangStore from '../../../store/langStore.js'

const PageWrapper = ({ children, title }) => {
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'

  return (
    <div className="flex min-h-screen bg-neutralSurface-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default PageWrapper