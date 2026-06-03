import { CalendarDays, CheckCircle, XCircle, Clock, ChevronRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import useDoctorAuthStore from '../../store/authStore.js'
import { useMyAppointments } from '../../hooks/useDoctor.js'
import { APPOINTMENT_STATUS } from '../../constants/index.js'
import { formatDateTime } from '../../utils/formatters.js'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ABSENT:    'bg-gray-100 text-gray-600',
}

const Dashboard = () => {
  const { lang, isRTL } = useLanguage()
  const { doctor } = useDoctorAuthStore()
  const navigate = useNavigate()

  const { data: todayData } = useMyAppointments({
    appointmentStatus: 'CONFIRMED',
    sort: 'appointmentDate',
    limit: 5,
  })

  const { data: allData } = useMyAppointments({ limit: 1 })
  const { data: completedData } = useMyAppointments({ appointmentStatus: 'COMPLETED', limit: 1 })
  const { data: cancelledData } = useMyAppointments({ appointmentStatus: 'CANCELLED', limit: 1 })
  const { data: pendingData } = useMyAppointments({ appointmentStatus: 'PENDING', limit: 1 })

  const todayAppointments = todayData?.data || []

  const stats = [
    {
      label: { en: 'Total Appointments', ar: 'إجمالي المواعيد' },
      value: allData?.pagination?.totalResults ?? '—',
      icon: CalendarDays,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      label: { en: 'Completed', ar: 'مكتملة' },
      value: completedData?.pagination?.totalResults ?? '—',
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: { en: 'Cancelled', ar: 'ملغية' },
      value: cancelledData?.pagination?.totalResults ?? '—',
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: { en: 'Pending', ar: 'قيد الانتظار' },
      value: pendingData?.pagination?.totalResults ?? '—',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
  ]

  return (
    <PageWrapper title={lang === 'ar' ? 'الرئيسية' : 'Dashboard'}>
      <div className="space-y-6">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-sky-600 rounded-2xl p-6 text-white">
          <p className="text-teal-100 text-sm">
            {lang === 'ar' ? 'مرحباً،' : 'Welcome back,'}
          </p>
          <h2 className="text-2xl font-bold mt-1">
            Dr. {doctor?.firstName} {doctor?.lastName}
          </h2>
          <p className="text-teal-100 text-sm mt-2">
            {lang === 'ar'
              ? `لديك ${todayAppointments.length} موعد مؤكد اليوم`
              : `You have ${todayAppointments.length} confirmed appointments today`
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label.en} 
              className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-5 hover:shadow transition"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <p className="text-3xl font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">{stat.value}</p>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1 font-medium">{stat.label[lang]}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'المواعيد المؤكدة القادمة' : 'Upcoming Confirmed Appointments'}
            </h3>
            <button
              onClick={() => navigate('doctors/appointments')}
              className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-semibold transition"
            >
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-12 text-tertiary-400 dark:text-slate-500">
                <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium">
                  {lang === 'ar' ? 'لا توجد مواعيد مؤكدة اليوم' : 'No confirmed appointments today'}
                </p>
              </div>
            ) : (
              todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/doctors/appointments/${apt.id}`)}
                  className="flex items-center justify-between p-4 bg-neutralSurface-50 dark:bg-gray-700/50 hover:bg-neutralSurface-100 dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-lg flex-shrink-0">
                      {apt.user?.firstName?.[0]}{apt.user?.lastName?.[0]}
                    </div>
                    <div>
                    <p className="text-tertiary-900 dark:text-slate-100 font-semibold">
                      {apt.user?.firstName} {apt.user?.lastName}
                    </p>
                    <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
                        {formatDateTime(apt.appointmentDate, lang)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${statusColors[apt.appointmentStatus]}`}>
                    {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}

export default Dashboard