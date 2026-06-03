import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Globe, ArrowLeft, ArrowRight, Mail, Sun, Moon } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useThemeStore from '../../../store/themeStore.js'
import { forgetPassword } from '../../api/endpoints/auth.api.js'

const ForgetPassword = () => {
  const { lang, toggleLang, isRTL } = useLanguage()
  const { theme, toggleTheme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await forgetPassword(data, lang)
      toast.success(res.data.message)
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
            {lang === 'ar' ? 'استعادة الحساب' : 'Account Recovery'}
          </span>
          <h1 className="text-white font-bold text-[32px] xl:text-[36px] leading-[1.2] tracking-tight">
            {lang === 'ar' ? 'نسيت\nكلمة المرور؟' : 'Forgot Your\nPassword?'}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {lang === 'ar'
              ? 'لا تقلق. سنساعدك في استعادة الوصول إلى حسابك.'
              : "Don't worry. We'll help you regain access to your account."}
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="border-t border-white/15 pt-6 grid grid-cols-3 gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">📧</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'بريد فوري' : 'Instant Email'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">🔄</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'آمن' : 'Secure'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">⏱️</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-tight">
              {lang === 'ar' ? 'سريع' : 'Fast'}
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
          {!sent ? (
            <>
              <div className="flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <Mail size={28} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="text-[26px] sm:text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
                    {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </h2>
                  <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1 font-medium">
                    {lang === 'ar' ? 'أدخل إيميلك وسنرسل لك رابط إعادة التعيين' : "Enter your email and we'll send you a reset link"}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-tertiary-700 dark:text-slate-300 mb-1.5">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                      className={`w-full border border-neutralSurface-200 dark:border-gray-700 rounded-xl px-4 py-3 text-tertiary-900 dark:text-slate-200 placeholder:text-tertiary-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-teal-600 transition text-sm bg-white dark:bg-gray-800`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {lang === 'ar' ? 'إيميل غير صحيح' : 'Invalid email'}
                      </p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center"
                  >
                    {loading 
                      ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
                      : (lang === 'ar' ? 'إرسال رابط الاسترداد' : 'Send Reset Link')
                    }
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-10 text-center">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-tertiary-900 dark:text-slate-100 mb-2">
                {lang === 'ar' ? 'تم الإرسال!' : 'Email Sent!'}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400">
                {lang === 'ar' ? 'تفقد بريدك الإلكتروني واتبع التعليمات' : 'Check your email and follow the instructions'}
              </p>
            </div>
          )}

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

export default ForgetPassword