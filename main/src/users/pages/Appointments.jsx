import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Eye, X, QrCode, FileText, CreditCard, Loader2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import { useMyAppointments, useCancelAppointment, useGenerateReport, useMakePayment } from '../hooks/useAppointments.js'
import { APPOINTMENT_STATUS } from '../constants/index.js'
import { formatDateTime, formatCurrency } from '../utils/formatters.js'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import api from '../api/axiosHelper.js' 

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ABSENT:    'bg-gray-100 text-gray-600',
}

const Appointments = () => {
  const { lang } = useLangStore()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  
  const [qrAppointmentId, setQrAppointmentId] = useState(null)
  const [qrImage, setQrImage] = useState(null)
  const [loadingQr, setLoadingQr] = useState(false)
  
  const { data, isLoading } = useMyAppointments({
    appointmentStatus: status || undefined,
    page,
    limit: 10,
    sort: '-createdAt',
  })

  const { mutate: cancelAppointment, isPending: cancelling } = useCancelAppointment()
  const { mutate: payNow, isPending: paying } = useMakePayment()
  const { mutate: generateReport, isPending: generating } = useGenerateReport()

  const appointments = data?.data || []
  const pagination = data?.pagination

  useEffect(() => {
    if (!qrAppointmentId) {
      setQrImage(null)
      return
    }

    const fetchQRCode = async () => {
      setLoadingQr(true)
      try {
        const response = await api.get(`/appointments/${qrAppointmentId}/qr`)
        if (response.data?.success) {
          setQrImage(response.data.data.qrCode)
        }
      } catch (error) {
        console.error("Error fetching QR Code:", error)
      } finally {
        setLoadingQr(false)
      }
    }

    fetchQRCode()
  }, [qrAppointmentId])

  return (
    <PageWrapper title={lang === 'ar' ? 'مواعيدي' : 'My Appointments'}>
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

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { value: '', label: { en: 'All', ar: 'الكل' } },
            ...Object.entries(APPOINTMENT_STATUS).map(([key, val]) => ({ value: key, label: val }))
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => { setStatus(item.value); setPage(1) }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                status === item.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-tertiary-600 dark:text-slate-400 border border-neutralSurface-200 dark:border-gray-700 hover:bg-neutralSurface-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.label[lang]}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-48" />
                      <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-64" />
                    </div>
                  </div>
                </div>
              ))
            : appointments.map((apt) => (
                <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 hover:shadow transition">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-tertiary-900 dark:text-slate-100 font-semibold">
                        Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 text-sm mt-1">
                        <Calendar size={16} />
                        {formatDateTime(apt.appointmentDate, lang)}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-4 py-2 rounded-2xl ${statusColors[apt.appointmentStatus]}`}>
                      {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang]}
                    </span>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-4 flex items-center gap-3 text-sm mb-5">
                    <CreditCard size={18} className="text-teal-600" />
                    <span className="text-tertiary-600 dark:text-slate-400">
                      {lang === 'ar' ? 'السعر:' : 'Price:'}                       <span className="font-semibold text-tertiary-900 dark:text-slate-100">{formatCurrency(apt.totalPrice, lang)}</span>
                    </span>
                    {apt.remainingAmount > 0 && (
                      <span className="text-red-500">
                        | {lang === 'ar' ? 'متبقي:' : 'Rem:'} {formatCurrency(apt.remainingAmount, lang)}
                      </span>
                    )}
                    {apt.isFullPaid && <span className="text-green-600 font-medium">✓ {lang === 'ar' ? 'مدفوع' : 'Paid'}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/appointments/${apt.id}`)}
                      className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 hover:border-teal-200 text-tertiary-700 dark:text-slate-300 rounded-2xl text-sm font-medium transition"
                    >
                      <Eye size={17} />
                      {lang === 'ar' ? 'التفاصيل' : 'Details'}
                    </button>

                    {apt.appointmentStatus === 'PENDING' && !apt.isPaid && (
                      <button
                        onClick={() => payNow(apt.id)}
                        disabled={paying}
                        className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-2xl text-sm font-medium transition disabled:opacity-60"
                      >
                        <CreditCard size={17} />
                        {paying ? '...' : (lang === 'ar' ? 'ادفع الآن' : 'Pay Now')}
                      </button>
                    )}

                    {apt.appointmentStatus === 'CONFIRMED' && apt.isPaid && (
                      <button
                        onClick={() => setQrAppointmentId(apt.id)}
                      className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 hover:border-teal-200 text-teal-600 rounded-2xl text-sm font-medium transition"
                        >
                          <QrCode size={17} />
                        QR Code
                      </button>
                    )}

                    {apt.appointmentStatus === 'COMPLETED' && (
                      <button
                        onClick={() => generateReport(apt.id)}
                        disabled={generating}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 hover:border-teal-200 text-teal-600 rounded-2xl text-sm font-medium transition disabled:opacity-60"
                      >
                        <FileText size={17} />
                        {lang === 'ar' ? 'التقرير' : 'Report'}
                      </button>
                    )}

                    {apt.appointmentStatus === 'PENDING' && !apt.isPaid && (
                      <button
                        onClick={() => setConfirmId(apt.id)}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-sm font-medium transition"
                      >
                        <X size={17} />
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))
          }

          {!isLoading && appointments.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 py-20 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-neutralSurface-200 dark:text-gray-600" />
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
                className="px-6 py-3 text-sm border border-neutralSurface-200 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 transition bg-white font-medium"
              >
                {lang === 'ar' ? 'السابق' : 'Prev'}
              </button>
              <button 
                disabled={page === pagination.totalPages} 
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-3 text-sm border border-neutralSurface-200 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 transition bg-white font-medium"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={!!confirmId}
        onConfirm={() => cancelAppointment(confirmId, { onSuccess: () => setConfirmId(null) })}
        onCancel={() => setConfirmId(null)}
        lang={lang}
        loading={cancelling}
      />

      {/* QR Code Modal */}
      {qrAppointmentId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center relative border border-neutralSurface-200 dark:border-gray-700 shadow-xl">
            <button 
              onClick={() => setQrAppointmentId(null)}
              className="absolute top-4 right-4 text-tertiary-400 dark:text-slate-500 hover:text-tertiary-600 dark:hover:text-slate-300"
            >
              <X size={22} />
            </button>

            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-xl mb-2">
              {lang === 'ar' ? 'رمز الاستجابة السريعة' : 'Appointment QR Code'}
            </h3>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mb-6">
              {lang === 'ar' ? 'أظهر هذا الكود عند الوصول للعيادة' : 'Show this code to the receptionist'}
            </p>

            <div className="bg-neutralSurface-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-neutralSurface-100 dark:border-gray-700 min-h-[240px] flex items-center justify-center">
              {loadingQr ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-teal-600" size={40} />
                  <span className="text-tertiary-500 text-sm">جاري التحميل...</span>
                </div>
              ) : qrImage ? (
                <img src={qrImage} alt="QR Code" className="w-56 h-56" />
              ) : (
                <p className="text-red-500">فشل تحميل الرمز</p>
              )}
            </div>

            <button
              onClick={() => setQrAppointmentId(null)}
              className="mt-8 w-full py-4 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-neutralSurface-200 dark:hover:bg-gray-600 text-tertiary-700 dark:text-slate-300 rounded-2xl font-medium transition"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

export default Appointments