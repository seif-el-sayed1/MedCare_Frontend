import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Globe, Mail, RefreshCw, Loader2, ShieldCheck, Clock, Lock, Sun, Moon } from 'lucide-react'
import useLangStore from '../../../store/langStore.js'
import useThemeStore from '../../../store/themeStore.js'
import useUserAuthStore from '../../store/authStore.js'
import { verifyOtp, sendOtp } from '../../api/endpoints/auth.api.js'

const BANNER_FEATURES = [
  { icon: ShieldCheck, label: { en: 'End-to-End Encrypted', ar: 'مشفر بالكامل'         } },
  { icon: Clock,       label: { en: 'Code expires in 10min', ar: 'الكود صالح 10 دقائق' } },
  { icon: Lock,        label: { en: 'One-Time Use Only',     ar: 'للاستخدام مرة واحدة' } },
]

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, toggleLang } = useLangStore()
  const { theme, toggleTheme } = useThemeStore()
  const isRTL = lang === 'ar'
  const { setAuth } = useUserAuthStore()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((p) => p - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setOtp(pasted.split(''))
      inputsRef.current[3]?.focus()
    }
  }

  const handleSubmit = async () => {
    const code = otp.join('')
    if (code.length < 4) {
      toast.error(lang === 'ar' ? 'أدخل الكود كاملاً' : 'Enter the complete code')
      return
    }
    setLoading(true)
    try {
      const res = await verifyOtp({ otp: code })
      const { data: userData, message } = res.data
      const token = userData?.token
      setAuth(token, userData)
      toast.success(message)
      navigate('/home', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
      setOtp(['', '', '', ''])
      inputsRef.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    try {
      const res = await sendOtp({ email })
      toast.success(res.data.message)
      setCountdown(60)
      setOtp(['', '', '', ''])
      inputsRef.current[0]?.focus()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setResending(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-12"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/*Left Banner Panel */}
      <div
        className="hidden lg:flex lg:col-span-5 flex-col justify-between p-14 xl:p-16 relative overflow-hidden min-h-screen"
        style={{ background: 'linear-gradient(145deg, #0d9488 0%, #06b6d4 60%, #0ea5e9 100%)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <span className="text-white font-black text-base">M</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">MedCare</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-md my-auto space-y-6">
          <span className="inline-block bg-white/15 border border-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {lang === 'ar' ? 'التحقق بخطوتين' : 'Two-Step Verification'}
          </span>
          <h1 className="text-white font-bold text-[32px] xl:text-[36px] leading-[1.2] tracking-tight">
            {lang === 'ar' ? 'حسابك\nمحمي بشكل كامل.' : 'Your Account\nIs Fully Protected.'}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {lang === 'ar'
              ? 'أرسلنا كوداً مكوناً من 4 أرقام إلى بريدك الإلكتروني. أدخله للتحقق من هويتك وتفعيل حسابك.'
              : 'We sent a 4-digit code to your email address. Enter it to verify your identity and activate your account.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['OTP Secured', '256-bit TLS', 'Privacy First'].map((chip) => (
              <span key={chip} className="bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="border-t border-white/15 pt-6 grid grid-cols-3 gap-4 relative z-10">
          {BANNER_FEATURES.map(({ icon: Icon, label }) => (
            <div key={label.en} className="space-y-1.5">
              <Icon size={16} className="text-white/80" />
              <p className="text-white text-[11px] font-semibold leading-tight">{label[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/*Right Form Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 bg-neutralSurface-50 dark:bg-gray-900 min-h-screen">

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-bold text-tertiary-900 dark:text-slate-100 text-base tracking-tight">MedCare</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-400 hover:text-teal-600 border border-neutralSurface-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              title={lang === 'ar' ? 'تغيير الوضع' : 'Toggle theme'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-400 hover:text-teal-600 border border-neutralSurface-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Globe size={13} />
              {lang === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="w-full max-w-[420px] mx-auto my-auto space-y-6">

          {/* Icon + Heading */}
          <div className="flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Mail size={26} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-[26px] sm:text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
                {lang === 'ar' ? 'تحقق من بريدك' : 'Verify your email'}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1 font-medium">
                {lang === 'ar' ? 'أدخل الكود المرسل إلى' : 'Enter the code sent to'}
              </p>
              {email && (
                <p className="text-teal-600 text-sm font-bold mt-0.5 truncate">{email}</p>
              )}
            </div>
          </div>

          {/* OTP Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">

            {/* OTP Inputs */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 text-center text-tertiary-900 dark:text-slate-100 text-2xl font-bold bg-white dark:bg-gray-800 border-2 ${
                    digit ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30' : 'border-neutralSurface-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || otp.join('').length < 4}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-sky-500 hover:brightness-105 active:scale-[.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/10"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                : (lang === 'ar' ? 'تحقق من الكود' : 'Verify Code')
              }
            </button>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
              <p className="text-tertiary-500 dark:text-slate-400 text-xs font-medium">
                {lang === 'ar' ? `إعادة الإرسال بعد ${countdown}ث` : `Resend in ${countdown}s`}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-bold transition disabled:opacity-60"
                >
                  <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                  {lang === 'ar' ? 'إعادة إرسال الكود' : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-6">
          © 2026 MedCare. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default VerifyOtp