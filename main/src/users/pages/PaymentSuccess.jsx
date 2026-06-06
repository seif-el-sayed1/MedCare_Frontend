import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, Download, QrCode, ArrowRight, ArrowLeft } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import { useAppointmentById, useGenerateQR, useGenerateReport } from '../hooks/useAppointments.js'
import { formatDateTime, formatCurrency } from '../utils/formatters.js'
import { SPECIALIZATIONS } from '../constants/index.js'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'
  const [showQR, setShowQR] = useState(false)

  const appointmentId =
    searchParams.get('appointmentId') ||
    sessionStorage.getItem('pendingAppointmentId')

  useEffect(() => {
    sessionStorage.removeItem('pendingAppointmentId')
  }, [])

  const { data, isLoading } = useAppointmentById(appointmentId)
  const apt = data?.data

  const { data: qrData, isLoading: qrLoading } = useGenerateQR(appointmentId, showQR)
  const { mutate: downloadReport, isPending: downloading } = useGenerateReport()

  if (!appointmentId) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الدفع' : 'Payment'}>
        <div className="text-center py-20 text-tertiary-400 dark:text-slate-500">
          {lang === 'ar' ? 'لم يتم العثور على الموعد' : 'Appointment not found'}
        </div>
      </PageWrapper>
    )
  }

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'جاري التحميل' : 'Loading'}>
        <div className="max-w-md mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-3/4 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-5 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  const isConfirmed = apt?.appointmentStatus === 'CONFIRMED'
  const isPartial = apt?.paymentType === 'PARTIALLY_PAID'

  return (
    <PageWrapper title={lang === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful'}>
      <div className="max-w-md mx-auto space-y-6">

        {/* Back Button */}
        <button 
          onClick={() => navigate('/appointments')}
          className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === 'ar' ? 'مواعيدي' : 'My Appointments'}
        </button>

        {/* Success Banner */}
        <div className={`rounded-2xl p-6 flex items-center gap-4 ${isConfirmed ? 'bg-emerald-600' : 'bg-amber-500'}`}>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            {isConfirmed ? (
              <CheckCircle size={32} className="text-white" />
            ) : (
              <Clock size={32} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">
              {isConfirmed
                ? (lang === 'ar' ? 'تم تأكيد الحجز! 🎉' : 'Booking Confirmed! 🎉')
                : (lang === 'ar' ? 'في انتظار التأكيد' : 'Pending Confirmation')}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {isConfirmed
                ? (lang === 'ar' ? 'موعدك محجوز بنجاح' : 'Your appointment is confirmed')
                : (lang === 'ar' ? 'سيتم تأكيد الحجز قريباً' : 'Your booking will be confirmed shortly')}
            </p>
          </div>
        </div>

        {/* Appointment Details */}
        {apt && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
            {apt.appointmentCode && (
              <div className="text-center bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl py-4 mb-6">
                <p className="text-xs text-tertiary-500 dark:text-slate-400 mb-1">
                  {lang === 'ar' ? 'كود الموعد' : 'Appointment Code'}
                </p>
                <span className="font-mono text-lg font-bold text-tertiary-900 dark:text-slate-100">
                  #{apt.appointmentCode}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <Row
                label={lang === 'ar' ? 'الطبيب' : 'Doctor'}
                value={`Dr. ${apt.doctor?.firstName} ${apt.doctor?.lastName}`}
              />
              <Row
                label={lang === 'ar' ? 'التخصص' : 'Specialty'}
                value={SPECIALIZATIONS[apt.doctor?.specialization]?.[lang] || apt.doctor?.specialization}
              />
              <Row
                label={lang === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}
                value={formatDateTime(apt.appointmentDate, lang)}
              />
              <Row
                label={lang === 'ar' ? 'الإجمالي' : 'Total'}
                value={formatCurrency(apt.totalPrice, lang)}
              />
              <Row
                label={lang === 'ar' ? 'تم الدفع' : 'Paid'}
                value={formatCurrency(apt.paidAmount, lang)}
                valueClass="text-emerald-600 font-semibold"
              />
              {isPartial && apt.remainingAmount > 0 && (
                <Row
                  label={lang === 'ar' ? 'المتبقي' : 'Remaining'}
                  value={formatCurrency(apt.remainingAmount, lang)}
                  valueClass="text-amber-600 font-semibold"
                />
              )}
            </div>

            {/* Partial Payment Notice */}
            {isPartial && apt.remainingAmount > 0 && (
              <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-700 text-sm">
                ⚠️ {lang === 'ar'
                  ? `يرجى سداد المبلغ المتبقي ${formatCurrency(apt.remainingAmount, lang)} عند الحضور`
                  : `Please pay the remaining ${formatCurrency(apt.remainingAmount, lang)} at the clinic`}
              </div>
            )}
          </div>
        )}

        {/* QR Code Section */}
        {isConfirmed && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-teal-600 dark:text-teal-400 font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-2xl transition"
            >
              <QrCode size={18} />
              {showQR
                ? (lang === 'ar' ? 'إخفاء رمز QR' : 'Hide QR Code')
                : (lang === 'ar' ? 'عرض رمز QR' : 'Show QR Code')}
            </button>

            {showQR && (
              <div className="mt-6 flex flex-col items-center">
                {qrLoading ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                    <p className="text-tertiary-500 text-sm">جاري تحميل الرمز...</p>
                  </div>
                ) : qrData?.data?.qrCode ? (
                  <>
                    <img src={qrData.data.qrCode} alt="QR Code" className="w-56 h-56 rounded-2xl shadow" />
                    <p className="text-tertiary-500 text-sm text-center mt-4">
                      {lang === 'ar' ? 'أظهر هذا الكود عند الوصول للعيادة' : 'Show this code at the clinic'}
                    </p>
                  </>
                ) : (
                  <p className="text-red-500 text-sm">فشل تحميل QR Code</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Download Report Button */}
        {isConfirmed && (
          <button
            onClick={() => downloadReport(appointmentId)}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-60"
          >
            <Download size={18} />
            {downloading
              ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...')
              : (lang === 'ar' ? 'تحميل الإيصال / التقرير' : 'Download Receipt')}
          </button>
        )}

        {/* View Appointments Button */}
        <button
          onClick={() => navigate('/appointments')}
          className="w-full py-4 bg-neutralSurface-100 dark:bg-gray-700 hover:bg-neutralSurface-200 dark:hover:bg-gray-600 text-tertiary-700 dark:text-slate-300 font-semibold rounded-2xl transition"
        >
          {lang === 'ar' ? 'عرض كل مواعيدي' : 'View All Appointments'}
        </button>

      </div>
    </PageWrapper>
  )
}


function Row({ label, value, valueClass = 'text-tertiary-900 dark:text-slate-100 font-medium' }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-neutralSurface-100 dark:border-gray-700 last:border-0">
      <span className="text-tertiary-500 dark:text-slate-400">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

export default PaymentSuccess