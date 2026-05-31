import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import useLanguage from '../../hooks/useLanguage.js'

const PageWrapper = ({ children, title }) => {
  const { isRTL } = useLanguage()

  return (
    <div className="flex min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageWrapper