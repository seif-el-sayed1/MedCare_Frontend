import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Stethoscope, CreditCard, QrCode, FileText, RefreshCw } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import { useAppointmentById, useGenerateQR, useGenerateReport, useMakePayment } from '../hooks/useAppointments.js'
import { APPOINTMENT_STATUS, SPECIALIZATIONS } from '../constants/index.js'
import { formatDateTime, formatCurrency } from '../utils/formatters.js'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ABSENT:    'bg-gray-100 text-gray-600',
}

const AppointmentDetails = () => {
  const { id } = useParams()
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'
  const navigate = useNavigate()
  const [showQR, setShowQR] = useState(false)

  const { data, isLoading } = useAppointmentById(id)
  const apt = data?.data

  const isConfirmedAndPaid = apt?.appointmentStatus === 'CONFIRMED' && apt?.isFullPaid
  const { data: qrData, isLoading: qrLoading } = useGenerateQR(id, showQR && isConfirmedAndPaid)
  const { mutate: generateReport, isPending: generating } = useGenerateReport()
  const { mutate: payNow, isPending: paying } = useMakePayment()

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-5 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-40 mb-4" />
              <div className="h-20 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (!apt) {
    return (
      <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
        <div className="text-center py-20 text-tertiary-400 dark:text-slate-500">
          {lang === 'ar' ? 'الموعد غير موجود' : 'Appointment not found'}
        </div>
      </PageWrapper>
    )
  }

  const isPending = apt.appointmentStatus === 'PENDING'
  const isConfirmed = apt.appointmentStatus === 'CONFIRMED'
  const isConfirmedOrCompleted = isConfirmed || apt.appointmentStatus === 'COMPLETED'

  return (
    <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back Button */}
        <button 
          type="button" 
          onClick={() => navigate('/appointments')}
          className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              {apt.appointmentCode && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 border border-primary-500/20 text-primary-700 dark:text-primary-300 font-mono font-bold text-sm shadow-sm">
                      #{apt.appointmentCode}
                  </span>
              )}
              <div className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 text-sm mt-3">
                <Calendar size={16} />
                {formatDateTime(apt.appointmentDate, lang)}
              </div>
            </div>
            <span className={`text-xs font-semibold px-4 py-2 rounded-2xl ${statusColors[apt.appointmentStatus]}`}>
              {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang]}
            </span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
              {lang === 'ar' ? 'الطبيب' : 'Doctor'}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-xl flex-shrink-0">
              {apt.doctor?.firstName?.[0]}
            </div>
            <div>
              <p className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
                Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
              </p>
              <p className="text-teal-600 text-sm mt-0.5">
                {SPECIALIZATIONS[apt.doctor?.specialization]?.[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
              {lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
                  { label: lang === 'ar' ? 'الإجمالي' : 'Total', value: formatCurrency(apt.totalPrice, lang), color: 'text-tertiary-900 dark:text-slate-100' },
              { label: lang === 'ar' ? 'المدفوع' : 'Paid', value: formatCurrency(apt.paidAmount, lang), color: 'text-green-600' },
              { label: lang === 'ar' ? 'المتبقي' : 'Remaining', value: formatCurrency(apt.remainingAmount, lang), color: apt.remainingAmount > 0 ? 'text-red-500' : 'text-green-600' },
            ].map((item) => (
              <div key={item.label} className="bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
                <p className="text-xs text-tertiary-500 dark:text-slate-400">{item.label}</p>
                <p className={`text-base font-bold mt-1 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Pay Now Button */}
          {isPending && !apt.isPaid && (
            <button
              type="button"
              onClick={() => payNow(apt.id)}
              disabled={paying}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-60"
            >
              <RefreshCw size={18} className={paying ? 'animate-spin' : ''} />
              {paying
                ? (lang === 'ar' ? 'جاري التحويل...' : 'Redirecting to payment...')
                : (lang === 'ar' ? 'ادفع الآن عبر Paymob' : 'Pay Now via Paymob')
              }
            </button>
          )}

          {isConfirmed && apt.remainingAmount > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-700 text-sm">
              ⚠️ {lang === 'ar' 
                ? `يرجى سداد ${formatCurrency(apt.remainingAmount, lang)} عند الحضور` 
                : `Please pay ${formatCurrency(apt.remainingAmount, lang)} at the clinic`}
            </div>
          )}

          {apt.isFullPaid && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-2 text-green-700">
              <span className="text-lg">✓</span>
              <span className="font-medium">{lang === 'ar' ? 'تم الدفع بالكامل' : 'Fully Paid'}</span>
            </div>
          )}
        </div>

        {/* QR Code Section */}
        {isConfirmedAndPaid && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 font-semibold py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-2xl transition"
            >
              <QrCode size={20} />
              {showQR ? (lang === 'ar' ? 'إخفاء QR Code' : 'Hide QR Code') : (lang === 'ar' ? 'عرض QR Code' : 'Show QR Code')}
            </button>

            {showQR && (
              <div className="flex flex-col items-center mt-6">
                {qrLoading ? (
                  <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                ) : qrData?.data?.qrCode ? (
                  <>
                    <img src={qrData.data.qrCode} alt="QR" className="w-56 h-56 rounded-2xl shadow" />
                    <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-4 text-center">
                      {lang === 'ar' ? 'أظهر هذا الكود عند الوصول' : 'Show this code at the clinic'}
                    </p>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Download Report */}
        {isConfirmedOrCompleted && (
          <button
            onClick={() => generateReport(id)}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-4 rounded-2xl transition disabled:opacity-60"
          >
            <FileText size={18} />
            {generating ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل التقرير' : 'Download Report')}
          </button>
        )}

        {/* Doctor Notes */}
        {apt.notes && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold mb-4">
              {lang === 'ar' ? 'ملاحظات الطبيب' : "Doctor's Notes"}
            </h3>
            <p className="text-tertiary-600 dark:text-slate-400 bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-5 leading-relaxed">
              {apt.notes}
            </p>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}

export default AppointmentDetails