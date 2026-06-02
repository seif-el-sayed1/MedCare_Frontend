import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Eye, EyeOff, Globe, Stethoscope, User, Sun, Moon,
  CalendarCheck, HeartPulse, ShieldCheck, LogIn, Loader2,
} from 'lucide-react'
import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import useUserAuthStore from '../users/store/authStore.js'
import useDoctorAuthStore from '../doctors/store/authStore.js'
import useLangStore from '../store/langStore.js'
import useThemeStore from '../store/themeStore.js'
import { loginUser } from '../users/api/endpoints/auth.api.js'
import { loginDoctor } from '../doctors/api/endpoints/auth.api.js'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

const getFCMToken = async () => {
  if (!('Notification' in window)) return null
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if (Notification.permission !== 'granted') return null
  try {
    const messaging = getMessaging(firebaseApp)
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })
    return token || null
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

const USER_FEATURES = [
  { icon: CalendarCheck, label: { en: 'Easy Appointment Booking',   ar: 'حجز المواعيد بسهولة'   } },
  { icon: HeartPulse,    label: { en: 'Track Your Health Records',  ar: 'تتبع سجلاتك الصحية'    } },
  { icon: ShieldCheck,   label: { en: 'Secure & Private',           ar: 'آمن وخاص تمامًا'        } },
]

const DOCTOR_FEATURES = [
  { icon: CalendarCheck, label: { en: 'Manage Your Schedule',        ar: 'إدارة جدول المواعيد'   } },
  { icon: HeartPulse,    label: { en: 'Patient Overview Dashboard',  ar: 'لوحة متابعة المرضى'    } },
  { icon: ShieldCheck,   label: { en: 'HIPAA Compliant Platform',    ar: 'منصة متوافقة مع HIPAA' } },
]

const USER_CHIPS = [
  { en: 'Free Booking',      ar: 'حجز مجاني'       },
  { en: 'Instant Reminders', ar: 'تنبيهات فورية'    },
  { en: 'Verified Doctors',  ar: 'أطباء موثوقون'    },
]

const DOCTOR_CHIPS = [
  { en: 'Smart Scheduling',    ar: 'جدولة ذكية'      },
  { en: 'Secure Messaging',    ar: 'مراسلة آمنة'     },
  { en: 'Analytics Dashboard', ar: 'لوحة التحليلات'  },
]

const Login = () => {
  const navigate = useNavigate()
  const { setAuth: setUserAuth } = useUserAuthStore()
  const { setAuth: setDoctorAuth } = useDoctorAuthStore()
  const { lang, toggleLang } = useLangStore()
  const { theme, toggleTheme } = useThemeStore()
  const isRTL = lang === 'ar'
  const [activeTab, setActiveTab] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const isDoctor = activeTab === 'doctor'

  const features = isDoctor ? DOCTOR_FEATURES : USER_FEATURES
  const chips    = isDoctor ? DOCTOR_CHIPS    : USER_CHIPS

  useEffect(() => {
    if (!isDoctor) {
      if (!('Notification' in window)) {
        console.warn('Notifications not supported')
      } else if (Notification.permission === 'default') {
        toast.dismiss()
        toast(
          lang === 'ar'
            ? 'يرجى السماح بالإشعارات لتصلك مواعيدك وتنبيهات الأطباء أولاً بأول 🔔'
            : 'Please enable notifications to receive your appointments and updates! 🔔',
          { id: 'notification-reminder', icon: '📢', duration: 5000 }
        )
      } else if (Notification.permission === 'denied') {
        toast.dismiss()
        toast.error(
          lang === 'ar'
            ? 'الإشعارات معطلة. يرجى تفعيلها من إعدادات المتصفح لتلقي التحديثات.'
            : 'Notifications are blocked. Please enable them from browser settings.',
          { id: 'notification-denied', duration: 4000 }
        )
      }
    }
  }, [activeTab, lang])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    reset()
    setShowPassword(false)
  }

  const onSubmit = async (formData) => {
    setLoading(false)
    setLoading(true)
    try {
      let notificationToken = null

      if (!isDoctor) {
        notificationToken = await getFCMToken()
      }

      if (!isDoctor) {
        const { email, password } = formData
        const requestData = { email, password }

        if (notificationToken && typeof notificationToken === 'string') {
          requestData.notificationToken = notificationToken
        }

        const res = await loginUser(requestData, lang)
        const { data: userData, message } = res.data
        const token = userData?.token

        if (!token) {
          toast.success(message)
          navigate('/verify-otp', { state: { email: formData.email } })
          return
        }

        setUserAuth(token, { ...userData, token: undefined })
        toast.success(message)
        navigate('/home')
      } else {
        const res = await loginDoctor(formData, lang)
        const { token, data: doctorData, message } = res.data

        if (!token) {
          toast.success(message)
          return
        }

        if (!doctorData?.isVerified) {
          localStorage.setItem('verify_token', token)
          toast.success(message)
          navigate('/doctor/verify-account')
          return
        }

        setDoctorAuth(token, doctorData)
        toast.success(message)
        navigate('/doctor/dashboard')
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        (lang === 'ar' ? 'حدث خطأ' : 'Something went wrong')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const texts = {
    en: {
      user: {
        title:     'Welcome Back!',
        subtitle:  'Sign in to your patient account',
        heroTag:   'Patient Portal',
        heroTitle: 'Your Health,\nOur Priority.',
        heroBody:  'Book appointments, track your medical history, and connect with verified doctors — all in one place.',
      },
      doctor: {
        title:     'Welcome Back, Doctor',
        subtitle:  'Sign in to your doctor account',
        heroTag:   'Doctor Portal',
        heroTitle: 'Manage Your Practice\nWith Confidence.',
        heroBody:  'Access your schedule, review patient details, and manage your clinical workflows from a single dashboard.',
      },
      email:          'Email Address',
      emailPH:        'Enter your email',
      password:       'Password',
      submit:         'Sign In',
      loading:        'Signing in...',
      forgotPassword: 'Forgot your password?',
      noAccount:      "Don't have an account?",
      register:       'Register now',
    },
    ar: {
      user: {
        title:     'مرحباً بعودتك!',
        subtitle:  'سجل دخولك على حسابك',
        heroTag:   'بوابة المرضى',
        heroTitle: 'صحتك،\nأولويتنا.',
        heroBody:  'احجز مواعيدك، تابع سجلاتك الطبية، وتواصل مع الأطباء الموثوقين — كل ذلك في مكان واحد.',
      },
      doctor: {
        title:     'مرحباً بعودتك، دكتور',
        subtitle:  'سجل دخولك على حسابك',
        heroTag:   'بوابة الأطباء',
        heroTitle: 'أدر عيادتك\nباحترافية.',
        heroBody:  'تابع جدولك، راجع بيانات مرضاك، وأدر سير العمل الطبي من لوحة تحكم واحدة.',
      },
      email:          'البريد الإلكتروني',
      emailPH:        'أدخل بريدك الإلكتروني',
      password:       'كلمة المرور',
      submit:         'تسجيل الدخول',
      loading:        'جاري تسجيل الدخول...',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount:      'ليس لديك حساب؟',
      register:       'سجل الآن',
    },
  }

  const t    = texts[lang]
  const mode = t[activeTab]

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-12 transition-all duration-500"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/*  Left Banner Panel  */}
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
            {mode.heroTag}
          </span>
          <h1 className="text-white font-bold text-[32px] xl:text-[36px] leading-[1.2] tracking-tight whitespace-pre-line">
            {mode.heroTitle}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {mode.heroBody}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <span
                key={chip.en}
                className="bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
              >
                {chip[lang] ?? chip.en}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="border-t border-white/15 pt-6 grid grid-cols-3 gap-4 relative z-10">
          {features.map(({ icon: Icon, label }) => (
            <div key={label.en} className="space-y-1.5">
              <Icon size={16} className="text-white/80" />
              <p className="text-white text-[11px] font-semibold leading-tight">{label[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/*  Right Form Panel  */}
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
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-tertiary-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-neutralSurface-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              title={lang === 'ar' ? 'تغيير الوضع' : 'Toggle theme'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <button
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

          {/* Tab Toggle */}
          <div className="bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 rounded-2xl p-1.5 flex gap-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isDoctor
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 hover:bg-neutralSurface-50 dark:hover:bg-gray-700'
              }`}
            >
              <User size={15} />
              {lang === 'ar' ? 'مريض' : 'Patient'}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isDoctor
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 hover:bg-neutralSurface-50 dark:hover:bg-gray-700'
              }`}
            >
              <Stethoscope size={15} />
              {lang === 'ar' ? 'دكتور' : 'Doctor'}
            </button>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-[26px] sm:text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
              {mode.title}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1.5 font-medium">{mode.subtitle}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-800 dark:text-slate-300 block">{t.email}</label>
              <input
                type="email"
                placeholder={t.emailPH}
                {...register('email', {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                className={`w-full bg-white dark:bg-gray-700 border ${
                  errors.email ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-neutralSurface-200 dark:border-gray-600'
                } rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-200 placeholder-tertiary-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium">
                  {lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email'}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-tertiary-800 dark:text-slate-300 block">{t.password}</label>
                {isDoctor && (
                  <Link
                    to="/doctor/forget-password"
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
                  >
                    {t.forgotPassword}
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                  className={`w-full bg-white dark:bg-gray-700 border ${
                    errors.password ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-neutralSurface-200 dark:border-gray-600'
                  } rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-200 placeholder-tertiary-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm ${
                    isRTL ? 'pr-4 pl-11' : 'pl-4 pr-11'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition ${isRTL ? 'left-3.5' : 'right-3.5'}`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium">
                  {lang === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required'}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-sky-500 hover:brightness-105 active:scale-[.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/10"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? t.loading : t.submit}
            </button>
          </div>

          {/* Register Link (User only) */}
          {!isDoctor && (
            <p className="text-center text-tertiary-500 dark:text-slate-400 text-sm">
              {t.noAccount}{' '}
              <Link
                to="/register"
                className="text-teal-600 font-bold hover:text-teal-700 transition"
              >
                {t.register}
              </Link>
            </p>
          )}
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-6">
          © 2026 MedCare. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login