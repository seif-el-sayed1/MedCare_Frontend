import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, Eye, FileText } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useMyAppointments } from '../../hooks/useDoctor.js'
import { useGenerateReport } from '../../hooks/useAppointments.js'
import { APPOINTMENT_STATUS } from '../../constants/index.js'
import { formatDateTime, formatCurrency } from '../../utils/formatters.js'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ABSENT:    'bg-gray-100 text-gray-600',
}

const AppointmentsList = () => {
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyAppointments({
    search: search || undefined,
    appointmentStatus: status || undefined,
    page,
    limit: 10,
    sort: '-appointmentDate',
  })

  const { mutate: generateReport } = useGenerateReport()

  const appointments = data?.data || []
  const pagination = data?.pagination

  return (
    <PageWrapper title={lang === 'ar' ? 'المواعيد' : 'Appointments'}>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-2xl">
            {lang === 'ar' ? 'مواعيدي' : 'My Appointments'}
          </h2>
          <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
            {pagination?.totalResults ?? 0} {lang === 'ar' ? 'موعد' : 'appointments'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث باسم المريض...' : 'Search by patient name...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={`w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl py-3.5 text-sm text-tertiary-900 dark:text-slate-200 placeholder:text-tertiary-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-600 bg-white dark:bg-gray-800 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-sm text-tertiary-900 dark:text-slate-200 focus:outline-none focus:border-teal-600 bg-white dark:bg-gray-800 w-full sm:w-auto"
          >
            <option value="">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            {Object.entries(APPOINTMENT_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val[lang]}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded w-48" />
                      <div className="h-3 bg-neutralSurface-100 dark:bg-gray-700 rounded w-64" />
                    </div>
                  </div>
                </div>
              ))
            : appointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-5 cursor-pointer hover:shadow transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-lg flex-shrink-0">
                        {apt.user?.firstName?.[0]}
                      </div>
                      <div>
                        <p className="text-tertiary-900 dark:text-slate-100 font-semibold">
                          {apt.user?.firstName} {apt.user?.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 text-sm mt-1">
                          <Calendar size={16} />
                          {formatDateTime(apt.appointmentDate, lang)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${statusColors[apt.appointmentStatus]}`}>
                        {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang]}
                      </span>
                      <span className="text-xs text-tertiary-400 dark:text-slate-500 font-mono">
                        {apt.appointmentCode}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutralSurface-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-tertiary-500 dark:text-slate-400">
                      <span>{lang === 'ar' ? 'السعر:' : 'Price:'} <span className="text-tertiary-900 dark:text-slate-100 font-medium">{formatCurrency(apt.totalPrice, lang)}</span></span>
                      {apt.remainingAmount > 0 && (
                        <span className="text-red-500">
                          {lang === 'ar' ? 'متبقي:' : 'Rem:'} {formatCurrency(apt.remainingAmount, lang)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); generateReport(apt.id) }}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 hover:border-teal-200 hover:text-teal-600 text-tertiary-600 dark:text-slate-300 rounded-2xl text-sm font-medium transition"
                      >
                        <FileText size={16} />
                        {lang === 'ar' ? 'تقرير' : 'Report'}
                      </button>
                      <div className="flex items-center gap-1 text-teal-600 text-sm font-medium">
                        <Eye size={16} />
                        {lang === 'ar' ? 'التفاصيل' : 'Details'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          }

          {!isLoading && appointments.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 py-20 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-tertiary-300 dark:text-gray-600" />
              <p className="text-tertiary-500 dark:text-slate-400">
                {lang === 'ar' ? 'لا توجد مواعيد' : 'No appointments found'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-tertiary-500 dark:text-slate-400">
              {lang === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
            </p>
            <div className="flex gap-3">
              <button 
                disabled={page === 1} 
                onClick={() => setPage((p) => p - 1)}
                className="px-5 py-2.5 text-sm border border-neutralSurface-200 dark:border-gray-700 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                {lang === 'ar' ? 'السابق' : 'Prev'}
              </button>
              <button 
                disabled={page === pagination.totalPages} 
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2.5 text-sm border border-neutralSurface-200 dark:border-gray-700 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}

export default AppointmentsList