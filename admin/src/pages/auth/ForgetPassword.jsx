import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Globe, Sun, Moon, ArrowLeft, ArrowRight, Mail, Shield,
  Loader2, CheckCircle2, Send, Lock
} from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useTheme from '../../hooks/useTheme.js'
import { forgetPassword } from '../../api/endpoints/auth.api.js'

const STEPS = [
  {
    num: '01',
    title: { en: 'Request Reset',   ar: 'طلب إعادة التعيين'   },
    desc:  { en: 'Enter your institutional email address.', ar: 'أدخل بريدك الإلكتروني المؤسسي.' },
  },
  {
    num: '02',
    title: { en: 'Verify Identity', ar: 'التحقق من الهوية'     },
    desc:  { en: 'Check your inbox for the secure reset link.', ar: 'تحقق من بريدك للحصول على رابط إعادة التعيين.' },
  },
  {
    num: '03',
    title: { en: 'Set New Password', ar: 'تعيين كلمة مرور جديدة' },
    desc:  { en: 'Create a strong password following policy.', ar: 'أنشئ كلمة مرور قوية وفق السياسة.' },
  },
]

const ForgetPassword = () => {
  const { lang, toggleLang, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

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

  const copy = {
    heroTag:    { en: 'Password Recovery',           ar: 'استرداد كلمة المرور'              },
    heroTitle:  { en: 'Secure Account\nRecovery',    ar: 'استرداد آمن\nللحساب'               },
    heroBody:   { en: 'Follow these steps to securely regain access to your MedCare administrative account.', ar: 'اتبع هذه الخطوات لاستعادة الوصول الآمن إلى حساب إدارة MedCare.' },
    expiry:     { en: 'Reset links expire after 30 minutes for security.', ar: 'تنتهي صلاحية روابط الاسترداد بعد 30 دقيقة لأسباب أمنية.' },
    title:      { en: 'Forgot Password?',             ar: 'نسيت كلمة المرور؟'                 },
    subtitle:   { en: "Enter your email and we'll send you a reset link.", ar: 'أدخل بريدك وسنرسل لك رابط إعادة التعيين.' },
    emailLabel: { en: 'Email Address',                ar: 'البريد الإلكتروني'                },
    emailPH:    { en: 'Enter your email address',     ar: 'أدخل بريدك الإلكتروني'            },
    emailErr:   { en: 'Invalid email address',        ar: 'بريد إلكتروني غير صحيح'          },
    sending:    { en: 'Sending...',                   ar: 'جارٍ الإرسال...'                  },
    sendBtn:    { en: 'Send Reset Link',              ar: 'إرسال رابط الاسترداد'             },
    notice:     { en: 'Reset emails are sent only to verified institutional addresses. Links expire in 30 minutes.', ar: 'تُرسل رسائل الاسترداد فقط إلى العناوين المؤسسية الموثقة. تنتهي الروابط خلال 30 دقيقة.' },
    sentTitle:  { en: 'Email Sent!',                  ar: 'تم الإرسال!'                       },
    sentBody:   { en: 'Check your inbox and follow the instructions to reset your password. The link expires in 30 minutes.', ar: 'تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور. ينتهي الرابط خلال 30 دقيقة.' },
    back:       { en: 'Back to Login',                ar: 'العودة لتسجيل الدخول'              },
  }

  const c = (key) => copy[key]?.[lang] ?? copy[key]?.en ?? ''

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Left Panel */}
      <div 
        className="hidden lg:flex lg:col-span-5 flex-col justify-between p-16 relative overflow-hidden min-h-screen"
        style={{ background: 'linear-gradient(145deg, #0d9488 0%, #06b6d4 60%, #0ea5e9 100%)' }}
      >
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <span className="text-white font-black text-base">M</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">MedCare</span>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3.5 py-1 mb-2">
            <Lock size={12} className="text-white" />
            <span className="text-[10px] text-white font-bold tracking-wider uppercase">{c('heroTag')}</span>
          </div>
          <h2 className="text-white font-bold text-3xl xl:text-4xl leading-[1.2] whitespace-pre-line">{c('heroTitle')}</h2>
          
          <div className="flex flex-col gap-4 pt-4">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 font-bold text-xs text-white">
                  {num}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title[lang]}</p>
                  <p className="text-white/70 text-xs mt-0.5 font-medium leading-relaxed">{desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-6 border-t border-white/15 text-white/80 text-[11px] font-semibold">
          <Shield size={14} />
          {c('expiry')}
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-8 sm:p-16 relative bg-white dark:bg-slate-800 min-h-screen">
        <div className="flex justify-end gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-400 hover:text-teal-600 border border-neutralSurface-200 dark:border-slate-700 bg-neutralSurface-50/50 dark:bg-slate-700/30 hover:bg-neutralSurface-50 dark:hover:bg-slate-700/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm dark:shadow-black/20"
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}
          </button>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-400 hover:text-teal-600 border border-neutralSurface-200 dark:border-slate-700 bg-neutralSurface-50/50 dark:bg-slate-700/30 hover:bg-neutralSurface-50 dark:hover:bg-slate-700/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm dark:shadow-black/20"
          >
            <Globe size={13} />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </div>

        <div className="w-full max-w-[400px] mx-auto my-auto space-y-7">
          {!sent ? (
            <>
              <div>
                <h2 className="text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">{c('title')}</h2>
                <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1.5 font-medium">{c('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-tertiary-800 dark:text-slate-200 block">{c('emailLabel')}</label>
                  <div className="relative">
                    <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 pointer-events-none">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      placeholder={c('emailPH')}
                      {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                      className={`w-full bg-white dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl ps-10 pe-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:shadow-black/20 ${errors.email ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1">{c('emailErr')}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white
                    bg-gradient-to-r from-teal-600 to-sky-600 hover:brightness-105 active:scale-[.99] transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/10"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                  {loading ? c('sending') : c('sendBtn')}
                </button>
              </form>

              <div className="bg-sky-50 dark:bg-slate-700/50 border border-sky-100 dark:border-slate-600 rounded-xl p-3.5 flex gap-2.5 items-start">
                <Shield size={14} className="text-sky-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-sky-800 leading-relaxed font-medium">{c('notice')}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-slate-700/50 border border-teal-100 dark:border-slate-600 flex items-center justify-center mx-auto mb-5 shadow-sm dark:shadow-black/20">
                <CheckCircle2 size={32} className="text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-tertiary-900 dark:text-slate-100 mb-2">{c('sentTitle')}</h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{c('sentBody')}</p>
            </div>
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-sky-600 font-bold transition">
              {isRTL ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              {c('back')}
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-6">
          Version 4.1.0 • Powered by Nexus Architecture
        </p>
      </div>
    </div>
  )
}

export default ForgetPassword