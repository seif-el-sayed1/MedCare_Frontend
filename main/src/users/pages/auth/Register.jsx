import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Globe, User, UserPlus, Sun, Moon, HeartPulse, ShieldCheck, Loader2 } from 'lucide-react'
import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import useLangStore from '../../../store/langStore.js'
import useThemeStore from '../../../store/themeStore.js'
import { registerUser } from '../../api/endpoints/auth.api.js'

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

    if (Notification.permission !== 'granted') {
        return null
    }

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

const BANNER_FEATURES = [
  { icon: UserPlus,    label: { en: 'Free Account Forever',   ar: 'حساب مجاني للأبد'       } },
  { icon: HeartPulse,  label: { en: 'Access Verified Doctors', ar: 'أطباء موثوقون ومعتمدون' } },
  { icon: ShieldCheck, label: { en: 'Your Data is Private',    ar: 'بياناتك محمية تماماً'   } },
]

const Register = () => {
  const navigate = useNavigate()
  const { lang, toggleLang } = useLangStore()
  const { theme, toggleTheme } = useThemeStore()
  const isRTL = lang === 'ar'
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')


  useEffect(() => {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported')
        return
    }

    if (Notification.permission === 'default') {
        toast.dismiss()

        toast(
            lang === 'ar'
                ? 'يرجى السماح بالإشعارات لتصلك تنبيهات المواعيد والتحديثات 🔔'
                : 'Please enable notifications to receive appointments and updates! 🔔',
            {
                id: 'notification-reminder',
                icon: '📢',
                duration: 5000,
            }
        )
    } else if (Notification.permission === 'denied') {
        toast.dismiss()

        toast.error(
            lang === 'ar'
                ? 'الإشعارات معطلة. يمكنك تفعيلها من إعدادات المتصفح لاحقاً.'
                : 'Notifications are blocked. You can enable them later from browser settings.',
            {
                id: 'notification-denied',
                duration: 4000,
            }
        )
    }
  }, [lang])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfileImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const notificationToken = await getFCMToken()

      const formData = new FormData()
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      formData.append('phone', data.phone)
      formData.append('age', Number(data.age))
      formData.append('gender', data.gender)
      if (profileImage) formData.append('profilePicture', profileImage)
      if (notificationToken) {
          formData.append('notificationToken', notificationToken)
      }
      const res = await registerUser(formData)
      toast.success(res.data.message)
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || (lang === 'ar' ? 'حدث خطأ' : 'Something went wrong')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full bg-white dark:bg-gray-800 border ${hasError ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-neutralSurface-200 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm`

  const labelClass = 'block text-xs font-bold text-tertiary-800 dark:text-slate-300 mb-1.5'

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-12"
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
            {lang === 'ar' ? 'بوابة المرضى' : 'Patient Portal'}
          </span>
          <h1 className="text-white font-bold text-[32px] xl:text-[36px] leading-[1.2] tracking-tight">
            {lang === 'ar' ? 'ابدأ رحلتك\nالصحية اليوم.' : 'Start Your Health\nJourney Today.'}
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {lang === 'ar'
              ? 'أنشئ حسابك مجاناً واحجز مواعيدك مع أفضل الأطباء في دقائق.'
              : 'Create your free account and book appointments with top doctors in minutes.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { en: 'Free Sign Up',      ar: 'تسجيل مجاني'    },
              { en: 'Instant Access',    ar: 'وصول فوري'       },
              { en: 'Verified Doctors',  ar: 'أطباء موثوقون'   },
            ].map((chip) => (
              <span key={chip.en} className="bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                {chip[lang] ?? chip.en}
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

      {/*  Right Form Panel  */}
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
        <div className="w-full max-w-[460px] mx-auto my-auto space-y-6 py-6">

          {/* Heading */}
          <div>
            <h2 className="text-[26px] sm:text-[28px] font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
              {lang === 'ar' ? 'مرحباً!' : 'Welcome!'}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
              {lang === 'ar' ? 'أدخل بياناتك لإنشاء حسابك' : 'Enter your details to create your account'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-5">

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl bg-neutralSurface-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-neutralSurface-200 dark:border-gray-600 hover:border-teal-600 transition cursor-pointer"
                  onClick={() => document.getElementById('register-pic').click()}
                >
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    : <User size={28} className="text-tertiary-400 dark:text-slate-500" />
                  }
                </div>
                <label
                  htmlFor="register-pic"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center cursor-pointer transition shadow-sm"
                >
                  <span className="text-white text-xs font-bold">+</span>
                </label>
                <input id="register-pic" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              <p className="text-tertiary-500 dark:text-slate-400 text-xs mt-2 font-medium">
                {lang === 'ar' ? 'صورة شخصية (اختياري)' : 'Profile picture (optional)'}
              </p>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                <input
                  placeholder={lang === 'ar' ? 'الاسم الأول' : 'First name'}
                  {...register('firstName', { required: true, minLength: 2 })}
                  className={inputClass(errors.firstName)}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{lang === 'ar' ? 'مطلوب' : 'Required'}</p>}
              </div>
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                <input
                  placeholder={lang === 'ar' ? 'الاسم الأخير' : 'Last name'}
                  {...register('lastName', { required: true, minLength: 2 })}
                  className={inputClass(errors.lastName)}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 font-medium">{lang === 'ar' ? 'مطلوب' : 'Required'}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input
                type="email"
                placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{lang === 'ar' ? 'إيميل غير صحيح' : 'Invalid email'}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
              <input
                placeholder="+201XXXXXXXXX"
                {...register('phone', { required: true })}
                className={inputClass(errors.phone)}
                dir="ltr"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{lang === 'ar' ? 'مطلوب' : 'Required'}</p>}
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'العمر' : 'Age'}</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder={lang === 'ar' ? 'عمرك' : 'Your age'}
                  {...register('age', { required: true, min: 1, max: 120 })}
                  className={inputClass(errors.age)}
                />
              </div>
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'الجنس' : 'Gender'}</label>
                <select
                  {...register('gender', { required: true })}
                  className={`${inputClass(errors.gender)} cursor-pointer`}
                >
                  <option value="">{lang === 'ar' ? 'اختر' : 'Select'}</option>
                  <option value="MALE">{lang === 'ar' ? 'ذكر' : 'Male'}</option>
                  <option value="FEMALE">{lang === 'ar' ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: true, minLength: 8 })}
                  className={`${inputClass(errors.password)} ${isRTL ? 'pr-4 pl-11' : 'pl-4 pr-11'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition ${isRTL ? 'left-3.5' : 'right-3.5'}`}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password?.type === 'minLength' && (
                <p className="text-red-500 text-xs mt-1 font-medium">{lang === 'ar' ? 'على الأقل 8 أحرف' : 'At least 8 characters'}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: true,
                    validate: (val) => val === password || (lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'),
                  })}
                  className={`${inputClass(errors.confirmPassword)} ${isRTL ? 'pr-4 pl-11' : 'pl-4 pr-11'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition ${isRTL ? 'left-3.5' : 'right-3.5'}`}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-sky-500 hover:brightness-105 active:scale-[.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/10 mt-1"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading
                ? (lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...')
                : (lang === 'ar' ? 'إنشاء حساب' : 'Create Account')
              }
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-tertiary-500 dark:text-slate-400 text-sm">
            {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 transition">
              {lang === 'ar' ? 'سجل دخولك' : 'Sign in'}
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] font-medium text-tertiary-400 dark:text-slate-500 mt-2">
          © 2026 MedCare. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Register