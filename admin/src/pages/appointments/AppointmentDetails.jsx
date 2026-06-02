import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, User, Stethoscope, CreditCard, FileText } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useAppointment, useUpdateAppointmentStatus, useUpdateAppointmentPayment, useGenerateReport } from '../../hooks/useAppointments.js'
import { APPOINTMENT_STATUS, SPECIALIZATIONS } from '../../constants/index.js'
import { formatDateTime, formatCurrency } from '../../utils/formatters.js'

const AppointmentDetails = () => {
  const { id } = useParams()
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [paymentAmount, setPaymentAmount] = useState('')

  const { data, isLoading } = useAppointment(id)
  const apt = data?.data

  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateAppointmentStatus(id)
  const { mutate: updatePayment, isPending: updatingPayment } = useUpdateAppointmentPayment(id)
  const { mutate: generateReport, isPending: generating } = useGenerateReport()

  const statusColors = {
    PENDING:   'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-teal-50 text-teal-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-green-100 text-green-700',
    ABSENT:    'bg-neutralSurface-50 text-tertiary-500',
  }

  const handlePayment = () => {
    const amount = Number(paymentAmount)
    if (!amount || amount <= 0) return
    updatePayment(amount, { onSuccess: () => setPaymentAmount('') })
  }

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 p-6 animate-pulse">
              <div className="h-5 bg-neutralSurface-50 dark:bg-slate-700/50 rounded w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => <div key={j} className="h-12 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (!apt) {
    return (
      <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
        <div className="text-center py-20 text-tertiary-500 dark:text-slate-400">
          {lang === 'ar' ? 'الموعد غير موجود' : 'Appointment not found'}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Back */}
        <button type="button" onClick={() => navigate('/appointments')}
          className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 text-sm font-bold transition">
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400 px-3 py-1 rounded-xl border border-neutralSurface-200 dark:border-slate-700">
                  {apt.appointmentCode || '—'}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[apt.appointmentStatus]}`}>
                  {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang] || apt.appointmentStatus}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 text-sm mt-2">
                <Calendar size={14} />
                {formatDateTime(apt.appointmentDate, lang)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Download Report */}
              <button
                type="button"
                onClick={() => generateReport(apt.id)}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
              >
                <FileText size={14} />
                {generating ? '...' : (lang === 'ar' ? 'تحميل التقرير' : 'Download Report')}
              </button>

              {/* Change Status */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-tertiary-500 dark:text-slate-400">{lang === 'ar' ? 'تغيير الحالة:' : 'Change Status:'}</label>
                <select
                  value={apt.appointmentStatus}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-tertiary-900 dark:text-slate-100 focus:outline-none focus:border-teal-600 bg-white dark:bg-slate-700/50 disabled:opacity-60 transition"
                >
                  {Object.entries(APPOINTMENT_STATUS)
                    .filter(([key]) => key !== 'PENDING')
                    .map(([key, val]) => (
                      <option key={key} value={key}>
                        {val[lang]}
                      </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patient & Doctor */}
        <div className="grid grid-cols-2 gap-4">
          {/* Patient */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-teal-600" />
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-sm">{lang === 'ar' ? 'المريض' : 'Patient'}</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: lang === 'ar' ? 'الاسم' : 'Name', value: `${apt.user?.firstName} ${apt.user?.lastName}` },
                { label: lang === 'ar' ? 'الإيميل' : 'Email', value: apt.user?.email },
                { label: lang === 'ar' ? 'التليفون' : 'Phone', value: apt.user?.phone },
              ].map((item) => (
                <div key={item.label} className="bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-xs text-tertiary-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100 mt-0.5">{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope size={16} className="text-teal-600" />
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-sm">{lang === 'ar' ? 'الطبيب' : 'Doctor'}</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: lang === 'ar' ? 'الاسم' : 'Name', value: `Dr. ${apt.doctor?.firstName} ${apt.doctor?.lastName}` },
                { label: lang === 'ar' ? 'التخصص' : 'Specialization', value: SPECIALIZATIONS[apt.doctor?.specialization]?.[lang] || apt.doctor?.specialization },
                { label: lang === 'ar' ? 'التليفون' : 'Phone', value: apt.doctor?.phone },
              ].map((item) => (
                <div key={item.label} className="bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-xs text-tertiary-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100 mt-0.5">{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={16} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-sm">{lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: lang === 'ar' ? 'إجمالي السعر' : 'Total Price', value: formatCurrency(apt.totalPrice, lang), color: 'text-tertiary-900' },
              { label: lang === 'ar' ? 'المدفوع' : 'Paid', value: formatCurrency(apt.paidAmount, lang), color: 'text-green-600' },
              { label: lang === 'ar' ? 'المتبقي' : 'Remaining', value: formatCurrency(apt.remainingAmount, lang), color: apt.remainingAmount > 0 ? 'text-red-500' : 'text-green-600' },
            ].map((item) => (
              <div key={item.label} className="bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl p-4 text-center border border-neutralSurface-200 dark:border-slate-700">
                <p className="text-xs text-tertiary-500 dark:text-slate-400 mb-1">{item.label}</p>
                <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Update Payment */}
          {!apt.isFullPaid && (
            <div className="border border-neutralSurface-200 dark:border-slate-700 rounded-2xl p-4 bg-neutralSurface-50 dark:bg-slate-700/50">
              <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100 mb-3">
                {lang === 'ar' ? 'تسجيل دفعة' : 'Record Payment'}
              </p>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={lang === 'ar' ? `المبلغ المتبقي: ${apt.remainingAmount}` : `Remaining: ${apt.remainingAmount}`}
                  className="flex-1 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-500 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 bg-white dark:bg-slate-700/50 transition"
                />
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={updatingPayment || !paymentAmount}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition disabled:opacity-60"
                >
                  {updatingPayment ? '...' : (lang === 'ar' ? 'تأكيد' : 'Confirm')}
                </button>
              </div>
            </div>
          )}

          {apt.isFullPaid && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl p-4 border border-green-100">
              <span className="text-sm font-medium">✓ {lang === 'ar' ? 'تم الدفع بالكامل' : 'Fully Paid'}</span>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}

export default AppointmentDetails