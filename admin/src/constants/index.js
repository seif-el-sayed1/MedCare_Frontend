export const TRANSLATIONS = {
  en: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your admin account',
      email: 'Email Address',
      password: 'Password',
      submit: 'Sign In',
      loading: 'Signing in...',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      invalidEmail: 'Invalid email address',
    },
  },
  ar: {
    login: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجل دخولك على حساب الادمن',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      loading: 'جاري تسجيل الدخول...',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      emailRequired: 'البريد الإلكتروني مطلوب',
      passwordRequired: 'كلمة المرور مطلوبة',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
    },
  },
}

export const SPECIALIZATIONS = {
  INTERNAL_MEDICINE: { en: 'Internal Medicine', ar: 'الباطنة' },
  PEDIATRICS: { en: 'Pediatrics', ar: 'طب الأطفال' },
  CARDIOLOGY: { en: 'Cardiology', ar: 'القلب' },
  DERMATOLOGY: { en: 'Dermatology', ar: 'الجلدية' },
  ORTHOPEDICS: { en: 'Orthopedics', ar: 'العظام' },
  NEUROLOGY: { en: 'Neurology', ar: 'الأعصاب' },
  OPHTHALMOLOGY: { en: 'Ophthalmology', ar: 'العيون' },
  ENT: { en: 'ENT', ar: 'الأنف والأذن والحنجرة' },
  DENTISTRY: { en: 'Dentistry', ar: 'الأسنان' },
}

export const APPOINTMENT_STATUS = {
  PENDING: { en: 'Pending', ar: 'قيد الانتظار', color: 'yellow' },
  CONFIRMED: { en: 'Confirmed', ar: 'مؤكد', color: 'blue' },
  CANCELLED: { en: 'Cancelled', ar: 'ملغي', color: 'red' },
  COMPLETED: { en: 'Completed', ar: 'مكتمل', color: 'green' },
  ABSENT: { en: 'Absent', ar: 'غائب', color: 'gray' },
}

export const PAYMENT_STATUS = {
  PENDING: { en: 'Pending', ar: 'قيد الانتظار', color: 'yellow' },
  SUCCESS: { en: 'Success', ar: 'ناجح', color: 'green' },
  FAILED: { en: 'Failed', ar: 'فاشل', color: 'red' },
  REFUNDED: { en: 'Refunded', ar: 'مسترجع', color: 'purple' },
}