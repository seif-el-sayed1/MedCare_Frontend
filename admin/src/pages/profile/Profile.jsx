import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import useAuthStore from '../../store/authStore.js'
import { getAdminProfile, updateAdmin, changePassword } from '../../api/endpoints/admins.api.js'

const Profile = () => {
  const { lang } = useLanguage()
  const { admin, setAuth } = useAuthStore()
  const qc = useQueryClient()

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => getAdminProfile().then((r) => r.data),
  })

  const profile = data?.data

  const { mutate: updateProfile, isPending: updating } = useMutation({
    mutationFn: (data) => updateAdmin(admin?.id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['admin-profile'])
      setAuth(localStorage.getItem('token'), res.data.data)
      toast.success(res.data.message || (lang === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully'))
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  const { mutate: changePass, isPending: changingPass } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.data.message || (lang === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully'))
      resetPass()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  const {
    register: registerProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm()

  const {
    register: registerPass,
    handleSubmit: handlePass,
    reset: resetPass,
    watch,
    formState: { errors: passErrors },
  } = useForm()

  const newPassword = watch('newPassword')

  const onUpdateProfile = (data) => updateProfile(data)
  const onChangePass = (data) => changePass({ currentPassword: data.currentPassword, newPassword: data.newPassword, confirmPassword: data.confirmPassword })

  const inputClass = (hasError) =>
    `w-full border ${hasError ? 'border-red-400' : 'border-neutralSurface-200 dark:border-slate-600'} rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-500 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white dark:bg-slate-700/50 transition`

  const labelClass = 'block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1.5'

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
        <div className="max-w-2xl mx-auto space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 p-6 animate-pulse">
              <div className="h-5 bg-neutralSurface-50 dark:bg-slate-700/50 rounded w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => <div key={j} className="h-10 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-black text-2xl border border-teal-100 flex-shrink-0">
              {profile?.firstName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-tertiary-900 dark:text-slate-100 font-black text-lg">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm">{profile?.email}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg mt-1.5 inline-flex items-center gap-1.5 ${
                profile?.role === 'SUPER_ADMIN'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-50 text-teal-700'
              }`}>
                <ShieldCheck size={12} />
                {profile?.role === 'SUPER_ADMIN'
                  ? (lang === 'ar' ? 'سوبر أدمن' : 'Super Admin')
                  : (lang === 'ar' ? 'أدمن' : 'Admin')
                }
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
              <User size={15} className="text-teal-600" />
            </div>
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
              {lang === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}
            </h3>
          </div>
          <form onSubmit={handleProfile(onUpdateProfile)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                <input
                  defaultValue={profile?.firstName}
                  {...registerProfile('firstName', { required: true })}
                  className={inputClass(profileErrors.firstName)}
                />
              </div>
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                <input
                  defaultValue={profile?.lastName}
                  {...registerProfile('lastName', { required: true })}
                  className={inputClass(profileErrors.lastName)}
                />
              </div>
              <div>
                <label className={labelClass}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                <input
                  defaultValue={profile?.phone}
                  placeholder="+201XXXXXXXXX"
                  {...registerProfile('phone')}
                  className={inputClass(false)}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition disabled:opacity-60"
              >
                <Save size={15} />
                {updating ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
              <Lock size={15} className="text-teal-600" />
            </div>
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">
              {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
          </div>
          <form onSubmit={handlePass(onChangePass)} className="space-y-4">

            {/* Current Password */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerPass('currentPassword', { required: true })}
                  className={`${inputClass(passErrors.currentPassword)} pr-10`}
                />
                <button type="button" onClick={() => setShowCurrentPass((p) => !p)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 transition">
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{lang === 'ar' ? 'مطلوب' : 'Required'}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerPass('newPassword', { required: true, minLength: 8 })}
                  className={`${inputClass(passErrors.newPassword)} pr-10`}
                />
                <button type="button" onClick={() => setShowNewPass((p) => !p)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 transition">
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.newPassword?.type === 'minLength' && <p className="text-red-400 text-xs mt-1">{lang === 'ar' ? 'على الأقل 8 أحرف' : 'At least 8 characters'}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerPass('confirmPassword', {
                    required: true,
                    validate: (val) => val === newPassword || (lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'),
                  })}
                  className={`${inputClass(passErrors.confirmPassword)} pr-10`}
                />
                <button type="button" onClick={() => setShowConfirmPass((p) => !p)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 transition">
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={changingPass}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition disabled:opacity-60"
              >
                <Lock size={15} />
                {changingPass ? '...' : (lang === 'ar' ? 'تغيير' : 'Change')}
              </button>
            </div>
          </form>
        </div>

      </div>
    </PageWrapper>
  )
}

export default Profile