import { useEffect, useRef, useState } from 'react'
import { CheckCircle, XCircle, ScanLine, RefreshCw, CreditCard, Wifi } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { scanAppointment } from '../../api/endpoints/appointments.api.js'
import { formatCurrency } from '../../utils/formatters.js'

const QRScanner = () => {
  const { lang } = useLanguage()
  const inputRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!loading) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [loading, result])

  const handleScan = async (appointmentId) => {
    if (!appointmentId.trim()) return
    setLoading(true)
    setInputValue('')
    try {
      const res = await scanAppointment(appointmentId.trim())
      setResult({ type: 'success', data: res.data.data, message: res.data.message })
    } catch (err) {
      const status = err.response?.status
      const paymentData = err.response?.data?.paymentData

      if (status === 400 && paymentData) {
        setResult({ type: 'payment', data: paymentData })
      } else {
        setResult({
          type: 'error',
          message: err.response?.data?.message || (lang === 'ar' ? 'حدث خطأ' : 'Something went wrong'),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleScan(inputValue)
    }
  }

  const reset = () => {
    setResult(null)
    setInputValue('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'مسح QR' : 'QR Scanner'}>
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
            {lang === 'ar' ? 'مسح QR Code للموعد' : 'Scan Appointment QR Code'}
          </h2>
          <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
            {lang === 'ar'
              ? 'وجّه الـ Scanner نحو الـ QR Code الخاص بالموعد'
              : 'Point the Scanner at the appointment QR Code'}
          </p>
        </div>

        {/* Scanner Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 p-6">

          {/* Waiting State */}
          {!result && (
            <div className="flex flex-col items-center justify-center py-8 gap-6">

              {/* Animated scan area */}
              <div className={`relative w-36 h-36 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                loading ? 'bg-teal-50 border-2 border-teal-400' : isActive ? 'bg-teal-50 border-2 border-teal-500' : 'bg-neutralSurface-50 dark:bg-slate-700/50 border-2 border-neutralSurface-200 dark:border-slate-600'
              }`}>
                {/* Corner accents */}
                {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((pos, i) => (
                  <span key={i} className={`absolute w-5 h-5 ${pos} ${isActive || loading ? 'border-teal-500' : 'border-neutralSurface-200 dark:border-slate-600'} transition-colors duration-300`} />
                ))}

                {loading
                  ? <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  : <ScanLine size={44} className={`transition-colors duration-300 ${isActive ? 'text-teal-600' : 'text-tertiary-500 dark:text-slate-400'}`} />
                }

                {/* Scan line animation when active */}
                {(isActive && !loading) && (
                  <div className="absolute inset-x-3 h-0.5 bg-teal-500/60 rounded-full animate-bounce top-1/2" />
                )}
              </div>

              {/* Status text */}
              <div className="text-center">
                <p className="text-tertiary-900 dark:text-slate-100 font-semibold text-sm">
                  {loading
                    ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                    : isActive
                      ? (lang === 'ar' ? 'جاهز — امسح الآن' : 'Ready — Scan Now')
                      : (lang === 'ar' ? 'جاهز للمسح' : 'Ready to Scan')
                  }
                </p>
                <p className="text-tertiary-500 dark:text-slate-400 text-xs mt-1">
                  {lang === 'ar' ? 'امسح الـ QR Code بالـ Scanner' : 'Scan the QR Code with your Scanner'}
                </p>
              </div>

              {/* Hidden input */}
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                className="opacity-0 absolute w-0 h-0"
                readOnly={loading}
              />

              {/* Activate button */}
              <button
                onClick={() => inputRef.current?.focus()}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 border-dashed font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'border-teal-500 bg-teal-50 text-teal-600'
                    : 'border-neutralSurface-200 dark:border-slate-600 bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400 hover:border-teal-400 hover:text-teal-600'
                }`}
              >
                <Wifi size={16} />
                {isActive
                  ? (lang === 'ar' ? 'متصل ✓' : 'Connected ✓')
                  : (lang === 'ar' ? 'اضغط لتفعيل الـ Scanner' : 'Click to activate Scanner')
                }
              </button>
            </div>
          )}

          {/* Success */}
          {result?.type === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-green-600 font-bold text-xl mb-1">
                  {lang === 'ar' ? 'تم بنجاح!' : 'Success!'}
                </h3>
                <p className="text-tertiary-500 dark:text-slate-400 text-sm">{result.message}</p>
              </div>
              {result.data && (
                <div className="bg-neutralSurface-50 dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-700 rounded-xl p-4 text-start space-y-2">
                  {[
                    { label: lang === 'ar' ? 'المريض' : 'Patient', value: `${result.data.user?.firstName} ${result.data.user?.lastName}` },
                    { label: lang === 'ar' ? 'الطبيب' : 'Doctor', value: `Dr. ${result.data.doctor?.firstName} ${result.data.doctor?.lastName}` },
                    { label: lang === 'ar' ? 'كود الموعد' : 'Code', value: result.data.appointmentCode },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-tertiary-500 dark:text-slate-400">{item.label}</span>
                      <span className="text-tertiary-900 dark:text-slate-100 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={reset}
                className="flex items-center gap-2 mx-auto bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                <RefreshCw size={16} />
                {lang === 'ar' ? 'مسح جديد' : 'Scan Again'}
              </button>
            </div>
          )}

          {/* Payment Required */}
          {result?.type === 'payment' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <CreditCard size={40} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-orange-500 font-bold text-xl mb-1">
                  {lang === 'ar' ? 'يتطلب دفع!' : 'Payment Required!'}
                </h3>
                <p className="text-tertiary-500 dark:text-slate-400 text-sm">
                  {lang === 'ar' ? 'لم يتم إتمام الدفع بالكامل' : 'Payment not completed yet'}
                </p>
              </div>
              {result.data && (
                <div className="bg-orange-50 dark:bg-slate-700/50 border border-orange-100 dark:border-slate-600 rounded-xl p-4 text-start space-y-2.5">
                  {[
                    { label: lang === 'ar' ? 'المريض' : 'Patient', value: result.data.patient },
                    { label: lang === 'ar' ? 'الطبيب' : 'Doctor', value: result.data.doctor },
                    { label: lang === 'ar' ? 'إجمالي السعر' : 'Total', value: formatCurrency(result.data.totalPrice, lang) },
                    { label: lang === 'ar' ? 'المدفوع' : 'Paid', value: formatCurrency(result.data.paidAmount, lang) },
                    { label: lang === 'ar' ? 'المتبقي' : 'Remaining', value: formatCurrency(result.data.remainingAmount, lang) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-tertiary-500 dark:text-slate-400">{item.label}</span>
                      <span className={`font-medium ${item.label.includes('متبقي') || item.label === 'Remaining' ? 'text-red-500' : 'text-tertiary-900 dark:text-slate-100'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={reset}
                className="flex items-center gap-2 mx-auto bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                <RefreshCw size={16} />
                {lang === 'ar' ? 'مسح جديد' : 'Scan Again'}
              </button>
            </div>
          )}

          {/* Error */}
          {result?.type === 'error' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle size={40} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-red-500 font-bold text-xl mb-1">
                  {lang === 'ar' ? 'خطأ!' : 'Error!'}
                </h3>
                <p className="text-tertiary-500 dark:text-slate-400 text-sm">{result.message}</p>
              </div>
              <button onClick={reset}
                className="flex items-center gap-2 mx-auto bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                <RefreshCw size={16} />
                {lang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
              </button>
            </div>
          )}

        </div>

        {/* Tip */}
        <p className="text-center text-tertiary-500 dark:text-slate-400 text-xs">
          {lang === 'ar'
            ? '💡 تأكد إن الـ Scanner متصل وفعّال — الـ input هيتملى تلقائياً'
            : '💡 Make sure the Scanner is connected and active — input will be filled automatically'}
        </p>

      </div>
    </PageWrapper>
  )
}

export default QRScanner