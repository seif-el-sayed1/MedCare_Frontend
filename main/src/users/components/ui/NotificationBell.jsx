import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import {
  useNotifications,
  useMarkNotificationSeen,
  useMarkAllNotificationsSeen,
} from '../../hooks/useNotifications.js'
import useLangStore from '../../../store/langStore.js'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { lang } = useLangStore()

  const { data } = useNotifications()
  const notifications = data?.data || []
  const unreadCount = notifications.filter((n) => !n.seen).length

  const { mutate: markSeen }    = useMarkNotificationSeen()
  const { mutate: markAllSeen } = useMarkAllNotificationsSeen()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification) => {
    if (!notification.seen) markSeen(notification.id)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-9 h-9 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-neutralSurface-200 dark:hover:bg-gray-600 rounded-2xl transition"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute top-12 z-50 w-80 bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutralSurface-100 dark:border-gray-700">
            <span className="text-base font-semibold text-tertiary-900 dark:text-slate-100">
              {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllSeen()}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition"
              >
                {lang === 'ar' ? 'تعليم الكل كمقروء' : 'Mark all as read'}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-neutralSurface-100 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <p className="text-center text-tertiary-400 dark:text-slate-500 text-sm py-12">
                {lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-5 py-4 cursor-pointer hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition ${!notification.seen ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.seen && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    )}
                    <div className={!notification.seen ? '' : 'pl-5'}>
                      <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100">{notification.title}</p>
                      {notification.body && (
                        <p className="text-sm text-tertiary-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.body}</p>
                      )}
                      <p className="text-xs text-tertiary-400 dark:text-slate-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString(
                          lang === 'ar' ? 'ar-EG' : 'en-US',
                          { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell