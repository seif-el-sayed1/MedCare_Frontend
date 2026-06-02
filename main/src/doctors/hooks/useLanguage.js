import useLangStore from '../store/langStore.js'

const TRANSLATIONS = {
  en: {
    login: {
      title: 'Welcome Back, Doctor',
      subtitle: 'Sign in to your account',
      email: 'Email Address',
      password: 'Password',
      submit: 'Sign In',
      loading: 'Signing in...',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      invalidEmail: 'Invalid email address',
      forgotPassword: 'Forgot your password?',
    },
  },
  ar: {
    login: {
      title: 'مرحباً بعودتك، دكتور',
      subtitle: 'سجل دخولك على حسابك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      loading: 'جاري تسجيل الدخول...',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      emailRequired: 'البريد الإلكتروني مطلوب',
      passwordRequired: 'كلمة المرور مطلوبة',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      forgotPassword: 'نسيت كلمة المرور؟',
    },
  },
}

const useLanguage = () => {
  const { lang, toggleLang } = useLangStore()
  const t = TRANSLATIONS[lang]
  const isRTL = lang === 'ar'
  return { lang, toggleLang, t, isRTL }
}

export default useLanguage