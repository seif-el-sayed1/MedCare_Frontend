import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Globe, Sun, Moon, Eye, EyeOff, ArrowLeft, ArrowRight,
  Shield, MonitorCheck, Loader2, Lock, CheckCircle2,
} from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useTheme from '../../hooks/useTheme.js'
import { resetPassword } from '../../api/endpoints/auth.api.js'

const POLICY_RULES = [
  { en: 'Minimum 8 characters', ar: '8 أحرف على الأقل' },
  { en: 'At least one uppercase letter', ar: 'حرف كبير واحد على الأقل' },
  { en: 'At least one number or symbol', ar: 'رقم أو رمز واحد على الأقل' },
  { en: 'Cannot reuse last 5 passwords', ar: 'لا يمكن إعادة استخدام آخر 5 كلمات' },
]

function getPasswordStrength(pwd = '') {
  let score = 0
  if (pwd.length >= 8)         score++
  if (/[A-Z]/.test(pwd))      score++
  if (/[0-9]/.test(pwd))      score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const labelsAr = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']
  const colors = ['bg-slate-200', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-teal-500']
  return { score, label: { en: labels[score], ar: labelsAr[score] }, color: colors[score] }
}

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const { lang, toggleLang, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const passwordValue = watch('password', '')
  const strength = getPasswordStrength(passwordValue)

  const c = (key) => {
    const dict = {
      title:       { en: 'Reset Password', ar: 'إعادة تعيين كلمة المرور' },
      subtitle:    { en: 'Choose a strong password to protect your corporate account.', ar: 'اختر كلمة مرور قوية لحماية حسابك المؤسسي.' },
      password:    { en: 'New Password', ar: 'كلمة المرور الجديدة' },
      confirm:     { en: 'Confirm New Password', ar: 'تأكيد كلمة المرور الجديدة' },
      strength:    { en: 'Password Strength', ar: 'قوة كلمة المرور' },
      resetBtn:    { en: 'Update Password', ar: 'تحديث كلمة المرور' },
      resetting:   { en: 'Updating...', ar: 'جاري التحديث...' },
      back:        { en: 'Back to Login', ar: 'العودة لتسجيل الدخول' },
      policyTitle: { en: 'Password Security Policy', ar: 'سياسة أمان كلمة المرور' },
      auditNote:   { en: 'Notice: All password changes are strictly audited for security. Unauthorized modifications will trigger administrative alerts.', ar: 'تنبيه: تخضع جميع تغييرات كلمات المرور لتدقيق صارم. التعديلات غير المصرح بها ستؤدي إلى إطلاق تنبيهات إدارية.' },
    }
    return dict[key]?.[lang] || key
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await resetPassword(
        token, 
        { password: data.password, confirmPassword: data.confirmPassword },
        lang
      )
      
      const successMessage = lang === 'ar' 
        ? 'تم إعادة تعيين كلمة المرور بنجاح!' 
        : 'Password reset successfully!'
      
      toast.success(successMessage)

      navigate('/login')

    } catch (err) {
      toast.error(err.response?.data?.message || (lang === 'ar' ? 'الرمز منتهي الصلاحية أو غير صالح' : 'Token expired or invalid'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-neutralSurface-50 dark:bg-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-teal-600 to-sky-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="flex items-center gap-2.5 relative z-10 animate-[fadeIn_0.6s_ease-out]">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <span className="font-black text-xl text-white tracking-tight">MedCare</span>
        </div>

        <div className="space-y-6 relative z-10 my-auto max-w-sm">
          <h3 className="text-white font-black text-xl tracking-tight animate-[fadeUp_0.5s_both_0.1s]">{c('policyTitle')}</h3>
          <ul className="space-y-3 animate-[fadeUp_0.5s_both_0.2s]">
            {POLICY_RULES.map((rule, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-teal-50 font-bold text-xs bg-white/5 border border-white/5 p-3 rounded-xl backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-sky-300 rounded-full flex-shrink-0" />
                <span>{rule[lang]}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-teal-100/60 font-bold text-xs relative z-10">
          Secure Infrastructure Layer
        </p>
      </div>

      {/* Right Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 md:p-20 bg-white dark:bg-slate-800 relative">
        <div className="flex justify-end gap-2 animate-[fadeIn_0.5s_both]">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-tertiary-700 dark:text-slate-300 hover:text-teal-600 bg-neutralSurface-50 dark:bg-slate-700/50 hover:bg-neutralSurface-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border border-neutralSurface-200 dark:border-slate-700 transition"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}
          </button>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-tertiary-700 dark:text-slate-300 hover:text-teal-600 bg-neutralSurface-50 dark:bg-slate-700/50 hover:bg-neutralSurface-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border border-neutralSurface-200 dark:border-slate-700 transition"
          >
            <Globe size={16} />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-8">
          <div className="animate-[fadeUp_0.5s_both_0.1s]">
            <h2 className="text-3xl font-black text-tertiary-900 dark:text-slate-100 tracking-tight">{c('title')}</h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-base font-bold mt-2">{c('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-[fadeUp_0.5s_both_0.2s]">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-tertiary-800 dark:text-slate-200 block">{c('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: lang === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required',
                    minLength: { value: 8, message: lang === 'ar' ? 'يجب أن تكون 8 أحرف على الأقل' : 'Must be at least 8 characters' }
                  })}
                  className="w-full bg-neutralSurface-50 dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm font-bold text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:bg-white dark:focus:bg-slate-700/50 transition shadow-sm dark:shadow-black/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 hover:text-teal-600 transition`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-tertiary-500 dark:text-slate-400">{c('strength')}:</span>
                    <span className={strength.score <= 2 ? 'text-red-500' : 'text-teal-600'}>
                      {strength.label[lang]}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutralSurface-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-red-600 text-xs font-bold mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-tertiary-800 dark:text-slate-200 block">{c('confirm')}</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: lang === 'ar' ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required',
                  validate: (val) => val === passwordValue || (lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
                })}
                className="w-full bg-neutralSurface-50 dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm font-bold text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:bg-white dark:focus:bg-slate-700/50 transition shadow-sm dark:shadow-black/20"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs font-bold mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-black text-white
                bg-gradient-to-r from-teal-600 to-sky-600 hover:brightness-110 active:scale-[.99] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-teal-600/20 pt-4 pb-4"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? c('resetting') : c('resetBtn')}
            </button>
          </form>

          {/* Notice */}
          <div className="bg-amber-50 dark:bg-slate-700/50 border border-amber-100 dark:border-slate-600 rounded-xl p-3.5 flex gap-2.5 items-start animate-[fadeUp_0.5s_both_0.3s]">
            <Lock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-bold text-amber-800 leading-relaxed">{c('auditNote')}</p>
          </div>

          {/* Back link */}
          <div className="text-center animate-[fadeUp_0.5s_both_0.4s]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-sky-600 font-black transition"
            >
              {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              {c('back')}
            </Link>
          </div>
        </div>
        <div className="w-2" />
      </div>
    </div>
  )
}

export default ResetPassword