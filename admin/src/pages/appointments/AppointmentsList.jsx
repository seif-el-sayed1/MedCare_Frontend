import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2, Search, Calendar, FileText, AlertTriangle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useAppointments, useDeleteAppointment, useGenerateReport } from '../../hooks/useAppointments.js'
import { APPOINTMENT_STATUS, SPECIALIZATIONS } from '../../constants/index.js'
import { formatDateTime, formatCurrency } from '../../utils/formatters.js'

const DeleteConfirmDialog = ({ apt, lang, isRTL, onConfirm, onCancel }) => {
  if (!apt) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base">
              {lang === 'ar' ? 'حذف الموعد' : 'Delete Appointment'}
            </h3>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
              {lang === 'ar'
                ? 'هل أنت متأكد من حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this appointment? This action cannot be undone.'}
            </p>
          </div>
        </div>

        {/* Appointment info pill */}
        <div className="bg-neutralSurface-50 dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
          <span className="font-mono text-xs text-tertiary-500 dark:text-slate-400">
            {apt.appointmentCode || apt.id}
          </span>
          <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100 mt-0.5">
            {apt.user?.firstName} {apt.user?.lastName}
          </p>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 text-tertiary-900 dark:text-slate-100 rounded-xl hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 transition"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
          >
            {lang === 'ar' ? 'حذف' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const AppointmentsList = () => {
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useAppointments({
    search: search || undefined,
    appointmentStatus: status || undefined,
    page,
    limit: 10,
    sort: '-createdAt',
  })

  const { mutate: deleteApt } = useDeleteAppointment()
  const { mutate: generateReport } = useGenerateReport()

  const appointments = data?.data || []
  const pagination = data?.pagination

  const statusColors = {
    PENDING:   'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-teal-50 text-teal-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-green-100 text-green-700',
    ABSENT:    'bg-neutralSurface-50 text-tertiary-500',
  }

  const paymentColors = {
    FULLY_PAID:     'bg-green-100 text-green-700',
    PARTIALLY_PAID: 'bg-orange-100 text-orange-700',
    NOT_PAID:       'bg-red-100 text-red-600',
  }

  const handleConfirmDelete = () => {
    deleteApt(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'المواعيد' : 'Appointments'}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'إدارة المواعيد' : 'Appointments Management'}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
              {pagination?.totalResults ?? 0} {lang === 'ar' ? 'موعد' : 'appointments'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-500 dark:text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث باسم المريض أو الكود...' : 'Search by patient or code...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={`w-full border border-neutralSurface-200 dark:border-slate-600 rounded-xl py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-500 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 bg-white dark:bg-slate-700/50 transition ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 focus:outline-none focus:border-teal-600 bg-white dark:bg-slate-700/50 transition"
          >
            <option value="">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            {Object.entries(APPOINTMENT_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val[lang]}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutralSurface-50 dark:bg-slate-700/50 border-b border-neutralSurface-200 dark:border-slate-700">
                <tr>
                  {[
                    lang === 'ar' ? 'الكود' : 'Code',
                    lang === 'ar' ? 'المريض' : 'Patient',
                    lang === 'ar' ? 'الطبيب' : 'Doctor',
                    lang === 'ar' ? 'التاريخ' : 'Date',
                    lang === 'ar' ? 'السعر' : 'Price',
                    lang === 'ar' ? 'الحالة' : 'Status',
                    lang === 'ar' ? 'الدفع' : 'Payment',
                    lang === 'ar' ? 'الإجراءات' : 'Actions',
                  ].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-tertiary-500 dark:text-slate-400 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutralSurface-50 dark:divide-slate-700/50">
                {isLoading
                  ? [...Array(6)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(8)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-neutralSurface-50 dark:bg-slate-700/50 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-teal-50/30 transition">
                        {/* Code */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-neutralSurface-200 dark:border-slate-700">
                            {apt.appointmentCode || '—'}
                          </span>
                        </td>
                        {/* Patient */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-tertiary-900 dark:text-slate-100">{apt.user?.firstName} {apt.user?.lastName}</p>
                          <p className="text-tertiary-500 dark:text-slate-400 text-xs">{apt.user?.phone}</p>
                        </td>
                        {/* Doctor */}
                        <td className="px-4 py-3">
                          <p className="text-tertiary-900 dark:text-slate-100">Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</p>
                          <p className="text-tertiary-500 dark:text-slate-400 text-xs">{SPECIALIZATIONS[apt.doctor?.specialization]?.[lang] || apt.doctor?.specialization}</p>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400">
                            <Calendar size={13} />
                            <span className="text-xs">{formatDateTime(apt.appointmentDate, lang)}</span>
                          </div>
                        </td>
                        {/* Price */}
                        <td className="px-4 py-3">
                          <p className="text-tertiary-900 dark:text-slate-100 font-medium text-xs">{formatCurrency(apt.totalPrice, lang)}</p>
                          {apt.remainingAmount > 0 && (
                            <p className="text-red-400 text-xs">{lang === 'ar' ? 'متبقي:' : 'Rem:'} {formatCurrency(apt.remainingAmount, lang)}</p>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[apt.appointmentStatus] || 'bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400'}`}>
                            {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang] || apt.appointmentStatus}
                          </span>
                        </td>
                        {/* Payment */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${paymentColors[apt.paymentType] || 'bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400'}`}>
                            {apt.isFullPaid
                              ? (lang === 'ar' ? 'مدفوع' : 'Paid')
                              : apt.paidAmount > 0
                                ? (lang === 'ar' ? 'جزئي' : 'Partial')
                                : (lang === 'ar' ? 'غير مدفوع' : 'Unpaid')
                            }
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/appointments/${apt.id}`)}
                              className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => generateReport(apt.id)}
                              className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
                            >
                              <FileText size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(apt)}
                              className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
                {!isLoading && appointments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-tertiary-500 dark:text-slate-400">
                      {lang === 'ar' ? 'لا توجد مواعيد' : 'No appointments found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutralSurface-200 dark:border-slate-700">
              <p className="text-sm text-tertiary-500 dark:text-slate-400">
                {lang === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
                  {lang === 'ar' ? 'السابق' : 'Prev'}
                </button>
                <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
                  {lang === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        apt={deleteTarget}
        lang={lang}
        isRTL={isRTL}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </PageWrapper>
  )
}

export default AppointmentsList