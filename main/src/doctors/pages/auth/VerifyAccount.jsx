import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Globe, ShieldCheck, ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useThemeStore from '../../../store/themeStore.js'
import { verifyAccount } from '../../api/endpoints/auth.api.js'

const VerifyAccount = () => {
  const { lang, toggleLang, isRTL } = useLanguage()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const { token } = useParams()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    if (!token) {
      toast.error(lang === 'ar' ? 'رابط غير صالح' : 'Invalid link')
      return
    }

    setLoading(true)
    try {
      const res = await verifyAccount({ password: data.password, confirmPassword: data.confirmPassword }, token, lang)
      toast.success(res.data.message || (lang === 'ar' ? 'تم التفعيل بنجاح' : 'Account verified successfully'))
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-neutralSurface-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-tertiary-900 dark:text-slate-100 max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} className="text-red-500" />
          </div>
          <p className="text-xl font-semibold mb-2">
            {lang === 'ar' ? 'رابط غير صالح' : 'Invalid verification link'}
          </p>
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
            {lang === 'ar' ? 'رجوع لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-12"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Left Banner Panel */}
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
            {lang === 'ar' ? 'تفعيل الحساب' : 'Account Activation'}
          </span>
          <h1 className="text-white font-bold text-[32px] xl:text-[36px] leading-[1.2] tracking-tight">
            {lang === 'ar' ? 'فعل حسابك\nالطبي' : 'Activate Your\nMedical Account'}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {lang === 'ar'
              ? 'أكمل تفعيل حسابك بإعداد كلمة مرور آمنة.'
              : 'Complete your account activation by setting a secure password.'}
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="border-t border-white/15 pt-6 grid grid-cols-3 gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">🔒</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'مشفر 256 بت' : '256-bit Encrypted'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">🛡️</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'حماية كاملة' : 'Fully Protected'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'فوري' : 'Instant'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 bg-neutralSurface-50 dark:bg-gray-800/50 min-h-screen">

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
              className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-neutralSurface-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              title={lang === 'ar' ? 'تغيير الوضع' : 'Toggle theme'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-neutralSurface-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Globe size={13} />
              {lang === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="w-full max-w-[420px] mx-auto my-auto space-y-6">
          <div className="flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <ShieldCheck size={28} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-[26px] sm:text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
                {lang === 'ar' ? 'تفعيل الحساب' : 'Verify Account'}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1 font-medium">
                {lang === 'ar' ? 'أدخل كلمة المرور لتفعيل حسابك' : 'Set your password to activate your account'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-tertiary-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', { required: true, minLength: 8 })}
                    className={`w-full border border-neutralSurface-200 dark:border-gray-700 rounded-xl px-4 py-3 text-tertiary-900 dark:text-slate-200 placeholder:text-tertiary-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-600 transition text-sm bg-white dark:bg-gray-800`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition right-4"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.type === 'minLength' && (
                  <p className="text-red-500 text-xs mt-1">
                    {lang === 'ar' ? 'على الأقل 8 أحرف' : 'At least 8 characters'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: true,
                      validate: (val) => val === password || (lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'),
                    })}
                    className={`w-full border border-neutralSurface-200 dark:border-gray-700 rounded-xl px-4 py-3 text-tertiary-900 dark:text-slate-200 placeholder:text-tertiary-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-600 transition text-sm bg-white dark:bg-gray-800`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition right-4"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center"
              >
                {loading
                  ? (lang === 'ar' ? 'جاري التفعيل...' : 'Activating...')
                  : (lang === 'ar' ? 'تفعيل الحساب' : 'Activate Account')
                }
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition"
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {lang === 'ar' ? 'رجوع لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-8">
          © 2026 MedCare. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default VerifyAccount