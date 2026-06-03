import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, User, Calendar, CreditCard, FileText, Save, Download } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useWriteDiagnosis } from '../../hooks/useDoctor.js'
import { useGenerateReport } from '../../hooks/useAppointments.js'
import { getMyAppointments } from '../../api/endpoints/doctor.api.js'
import { APPOINTMENT_STATUS } from '../../constants/index.js'
import { formatDateTime, formatCurrency } from '../../utils/formatters.js'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ABSENT:    'bg-gray-100 text-gray-600',
}

const DoctorAppointmentDetails = () => {
  const { id } = useParams()
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [diagnosis, setDiagnosis] = useState('')

  const {  isLoading } = useQuery({
    queryKey: ['my-appointment', id],
    queryFn: () => getMyAppointments({ id }).then((r) => r.data),
    enabled: !!id,
  })

  const { data: listData } = useQuery({
    queryKey: ['appointment-detail', id],
    queryFn: async () => {
      const res = await getMyAppointments({ limit: 100 })
      return res.data?.data?.find((a) => a.id === id) || null
    },
    enabled: !!id,
  })

  const apt = listData

  const { mutate: saveDiagnosis, isPending: saving } = useWriteDiagnosis(id)
  const { mutate: generateReport, isPending: generating } = useGenerateReport()

  const handleSaveDiagnosis = () => {
    if (!diagnosis.trim()) return
    saveDiagnosis({ diagnosis }, {
      onSuccess: () => setDiagnosis('')
    })
  }

  if (!apt && !isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
        <div className="text-center py-20 text-tertiary-400 dark:text-slate-500">
          {lang === 'ar' ? 'الموعد غير موجود' : 'Appointment not found'}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/doctor/appointments')}
          className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        {!apt ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-5 animate-pulse">
                <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded w-32 mb-3" />
                <div className="space-y-2">
                  <div className="h-10 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl" />
                  <div className="h-10 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Header with Status + Download Report */}
            <div className="bg-white rounded-2xl border border-neutralSurface-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-neutralSurface-100 dark:bg-gray-700 text-tertiary-600 dark:text-slate-300 px-3 py-1 rounded-xl">
                      {apt.appointmentCode}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${statusColors[apt.appointmentStatus]}`}>
                      {APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 text-sm mt-3">
                    <Calendar size={16} />
                    {formatDateTime(apt.appointmentDate, lang)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => generateReport(apt.id)}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-2xl transition shadow-sm w-full sm:w-auto"
                >
                  <Download size={18} />
                  {generating
                    ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...')
                    : (lang === 'ar' ? 'تحميل التقرير' : 'Download Report')
                  }
                </button>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-teal-600" />
                <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
                  {lang === 'ar' ? 'بيانات المريض' : 'Patient Information'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: lang === 'ar' ? 'الاسم' : 'Name', value: `${apt.user?.firstName} ${apt.user?.lastName}` },
                  { label: lang === 'ar' ? 'التليفون' : 'Phone', value: apt.user?.phone },
                  { label: lang === 'ar' ? 'الإيميل' : 'Email', value: apt.user?.email },
                ].map((item) => (
                  <div key={item.label} className="bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-4">
                    <p className="text-xs text-tertiary-500 dark:text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-tertiary-900 dark:text-slate-200 mt-1">{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-teal-600" />
                <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
                  {lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: lang === 'ar' ? 'السعر الكلي' : 'Total', value: formatCurrency(apt.totalPrice, lang), color: 'text-tertiary-900 dark:text-slate-100' },
                  { label: lang === 'ar' ? 'المدفوع' : 'Paid', value: formatCurrency(apt.paidAmount, lang), color: 'text-green-600' },
                  { label: lang === 'ar' ? 'المتبقي' : 'Remaining', value: formatCurrency(apt.remainingAmount, lang), color: apt.remainingAmount > 0 ? 'text-red-500' : 'text-green-600' },
                ].map((item) => (
                  <div key={item.label} className="bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-tertiary-500 dark:text-slate-400">{item.label}</p>
                    <p className={`text-sm font-bold mt-1 ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              {apt.isFullPaid && (
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
                  <span className="text-sm font-medium">✓ {lang === 'ar' ? 'تم الدفع بالكامل' : 'Fully Paid'}</span>
                </div>
              )}
            </div>

            {/* Diagnosis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText size={18} className="text-teal-600" />
                <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
                  {lang === 'ar' ? 'التشخيص' : 'Diagnosis'}
                </h3>
              </div>

              {apt.notes && (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl p-5 mb-5">
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium mb-2">
                    {lang === 'ar' ? 'التشخيص المسجل:' : 'Recorded Diagnosis:'}
                  </p>
                  <p className="text-tertiary-900 dark:text-slate-200">{apt.notes}</p>
                </div>
              )}

              {apt.appointmentStatus === 'COMPLETED' ? (
                <div className="space-y-4">
                  <textarea
                    rows={5}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب التشخيص هنا...' : 'Write diagnosis here...'}
                    className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-tertiary-900 dark:text-slate-200 placeholder:text-tertiary-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-600 resize-none transition bg-white dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={handleSaveDiagnosis}
                    disabled={saving || !diagnosis.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-2xl transition disabled:opacity-60 w-full justify-center"
                  >
                    <Save size={16} />
                    {saving ? '...' : (lang === 'ar' ? 'حفظ التشخيص' : 'Save Diagnosis')}
                  </button>
                </div>
              ) : (
                <div className="bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl p-8 text-center">
                  <p className="text-tertiary-500 dark:text-slate-400">
                    {lang === 'ar'
                      ? 'يمكن كتابة التشخيص فقط للمواعيد المكتملة'
                      : 'Diagnosis can only be written for completed appointments'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </PageWrapper>
  )
}

export default DoctorAppointmentDetails