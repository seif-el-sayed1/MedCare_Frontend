import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Eye, EyeOff, Globe, Sun, Moon, AlertTriangle, Loader2,
  Shield, MonitorCheck, Fingerprint, LogIn
} from 'lucide-react'
import useAuthStore from '../../store/authStore.js'
import useLanguage from '../../hooks/useLanguage.js'
import useTheme from '../../hooks/useTheme.js'
import { loginAdmin } from '../../api/endpoints/auth.api.js'

const TRUST_BADGES = [
  { icon: Shield,       label: { en: 'HIPAA Compliant', ar: 'متوافق مع HIPAA' } },
  { icon: MonitorCheck, label: { en: 'SOC-2 Type II',   ar: 'معتمد SOC-2'     } },
  { icon: Fingerprint,  label: { en: 'Biometric Ready', ar: 'جاهز للبصمة'     } },
]

const FEATURE_CHIPS = [
  { en: '256-bit Encryption', ar: 'تشفير 256-بت'      },
  { en: 'Biometric Ready',    ar: 'جاهز للبصمة'        },
  { en: 'Zero-Trust Network', ar: 'شبكة Zero-Trust'    },
]

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { lang, toggleLang, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [capsLock, setCapsLock]         = useState(false)
  const [rememberMe, setRememberMe]     = useState(
    () => localStorage.getItem('rememberedEmail') !== null
  )

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: localStorage.getItem('rememberedEmail') || '' },
  })

  const onCapsLock = (e) => {
    if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'))
  }

  const onSubmit = async (data) => {
    rememberMe
      ? localStorage.setItem('rememberedEmail', data.email)
      : localStorage.removeItem('rememberedEmail')

    setLoading(true)
    try {
      const res = await loginAdmin(data, lang)
      const { token, data: adminData, message } = res.data
      if (!token) { toast.success(message); return }
      setAuth(token, adminData)
      toast.success(message)
      navigate('/dashboard')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (lang === 'ar' ? 'حدث خطأ' : 'Something went wrong')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const copy = {
    title: { en: 'Welcome Back', ar: 'مرحباً بك مجدداً' },
    subtitle: { en: 'Sign in to access your administrative workspace.', ar: 'سجل دخولك للوصول إلى لوحة التحكم الإدارية.' },
    emailLabel: { en: 'Institutional Email', ar: 'البريد الإلكتروني المؤسسي' },
    emailPH: { en: 'admin@medcare.com', ar: 'admin@medcare.com' },
    emailReq: { en: 'Email is required', ar: 'البريد الإلكتروني مطلوب' },
    emailInv: { en: 'Invalid email address', ar: 'بريد إلكتروني غير صحيح' },
    passLabel: { en: 'Account Password', ar: 'كلمة مرور الحساب' },
    forgotPass: { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
    passReq: { en: 'Password is required', ar: 'كلمة المرور مطلوبة' },
    capsOn: { en: 'Caps Lock is on', ar: 'مفتاح Caps Lock مفعّل' },
    remember: { en: 'Remember device for 12 hours', ar: 'تذكر الجهاز لمدة 12 ساعة' },
    submit: { en: 'Sign In to Workspace', ar: 'تسجيل الدخول للنظام' },
    loading: { en: 'Authenticating...', ar: 'جارٍ التحقق...' },
    heroTag: { en: 'Enterprise Security', ar: 'أمان المؤسسات' },
    heroTitle: { en: 'Empowering Medical Administration\nFrameworks.', ar: 'إدارة وتطوير المنظومة\nالطبية المؤسسية.' },
    heroBody: {
      en: 'Integrated high-performance workspace engineered for clinical schedules, doctor routing, and consolidated auditing logs.',
      ar: 'شاشة تحكم متكاملة مخصصة لإدارة الأطباء، جدولة المواعيد، ومتابعة المدفوعات والتقارير اليومية بدقة فائقة.',
    },
  }

  const c = (key) => copy[key]?.[lang] ?? copy[key]?.en ?? ''

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Left Banner Panel */}
      <div 
        className="hidden lg:flex lg:col-span-5 flex-col justify-between p-16 relative overflow-hidden min-h-screen"
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
          <h1 className="text-white font-bold text-[34px] leading-[1.25] tracking-tight whitespace-pre-line">
            {c('heroTitle')}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {c('heroBody')}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {FEATURE_CHIPS.map((chip) => (
              <span key={chip.en} className="bg-white/10 border border-white/5 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                {chip[lang] ?? chip.en}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="border-t border-white/15 pt-6 grid grid-cols-3 gap-4 relative z-10">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label.en} className="space-y-1.5">
              <Icon size={16} className="text-white/80" />
              <p className="text-white text-[11px] font-semibold tracking-wide">{label[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-8 sm:p-16 relative bg-white dark:bg-slate-800 min-h-screen">
        
        {/* Theme & Language Switchers */}
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

        {/* Form Body */}
        <div className="w-full max-w-[400px] mx-auto my-auto space-y-7">
          <div>
            <h2 className="text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">{c('title')}</h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1.5 font-medium">{c('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-800 dark:text-slate-200 block">{c('emailLabel')}</label>
              <input
                type="email"
                placeholder={c('emailPH')}
                {...register('email', {
                  required: c('emailReq'),
                  pattern:  { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c('emailInv') },
                  setValueAs: (v) => v.trim(),
                })}
                className={`w-full bg-white dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:shadow-black/20 ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-tertiary-800 dark:text-slate-200 block">{c('passLabel')}</label>
                <Link to="/forget-password" className="text-xs font-semibold text-teal-600 hover:text-sky-600 transition">
                  {c('forgotPass')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  onKeyDown={onCapsLock}
                  onKeyUp={onCapsLock}
                  {...register('password', { required: c('passReq') })}
                  className={`w-full bg-white dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:shadow-black/20 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 transition`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {capsLock && (
                <div className="flex items-center gap-1.5 mt-1 text-amber-600 text-xs font-medium">
                  <AlertTriangle size={13} />
                  {c('capsOn')}
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white
                bg-gradient-to-r from-teal-600 to-sky-600 hover:brightness-105 active:scale-[.99] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/10"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? c('loading') : c('submit')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-6">
          Version 4.1.0 • Powered by Nexus Architecture
        </p>
      </div>
    </div>
  )
}

export default Login