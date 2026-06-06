import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Lock, User, Eye, EyeOff, Camera } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import useUserAuthStore from '../store/authStore.js'
import { useMyProfile, useUpdateProfile, useChangePassword } from '../hooks/useProfile.js'
import { formatDate } from '../utils/formatters.js'

const UserProfile = () => {
  const { lang } = useLangStore()
  const { user, setAuth } = useUserAuthStore()
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const { data, isLoading } = useMyProfile()
  const profile = data?.data

  const { mutate: updateProfile, isPending: updating } = useUpdateProfile()
  const { mutate: changePass, isPending: changingPass } = useChangePassword()

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm()
  const { register: regPass, handleSubmit: handlePass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm()
  const newPassword = watch('newPassword')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onUpdateProfile = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, val]) => { if (val) formData.append(key, val) })
    if (imageFile) formData.append('profilePicture', imageFile)
    updateProfile(formData, {
      onSuccess: (res) => {
        setAuth(localStorage.getItem('user_token'), { ...user, ...res.data.data })
        setImageFile(null)
      }
    })
  }

  const onChangePass = (data) => {
    changePass(
      { currentPassword: data.currentPassword, newPassword: data.newPassword, confirmPassword: data.confirmPassword },
      { onSuccess: () => resetPass() }
    )
  }

  const inputClass = (hasError) =>
    `w-full border ${hasError ? 'border-red-400 focus:border-red-400' : 'border-neutralSurface-200 dark:border-gray-700 focus:border-teal-600'} rounded-2xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder:text-tertiary-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 bg-white dark:bg-gray-800 transition`

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-52 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => <div key={j} className="h-12 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />)}
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-teal-100 rounded-2xl overflow-hidden flex items-center justify-center">
                {imagePreview || profile?.profilePicture
                  ? <img src={imagePreview || profile.profilePicture} alt="" className="w-full h-full object-cover" />
                  : <User size={32} className="text-teal-600" />
                }
              </div>
              <label htmlFor="profile-pic"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 hover:bg-teal-500 rounded-full flex items-center justify-center cursor-pointer transition shadow">
                <Camera size={14} className="text-white" />
              </label>
              <input id="profile-pic" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div>
              <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-xl">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'تعديل البيانات الشخصية' : 'Edit Profile'}
            </h3>
          </div>

          <form onSubmit={handleProfile(onUpdateProfile)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">
                  {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                </label>
                <input defaultValue={profile?.firstName} {...regProfile('firstName', { required: true })} className={inputClass(profileErrors.firstName)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">
                  {lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                </label>
                <input defaultValue={profile?.lastName} {...regProfile('lastName', { required: true })} className={inputClass(profileErrors.lastName)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input defaultValue={profile?.phone.slice(2)} placeholder="01XXXXXXXXX" {...regProfile('phone')} className={inputClass(false)} dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">
                  {lang === 'ar' ? 'العمر' : 'Age'}
                </label>
                <input type="number" min="1" max="120" defaultValue={profile?.age} {...regProfile('age')} className={inputClass(false)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">
                  {lang === 'ar' ? 'الجنس' : 'Gender'}
                </label>
                <select defaultValue={profile?.gender} {...regProfile('gender')} className={inputClass(false)}>
                  <option value="MALE">{lang === 'ar' ? 'ذكر' : 'Male'}</option>
                  <option value="FEMALE">{lang === 'ar' ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button type="submit" disabled={updating}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-2xl transition disabled:opacity-60">
                <Save size={18} />
                {updating ? 'جاري الحفظ...' : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
          </div>

          <form onSubmit={handlePass(onChangePass)} className="space-y-5">
            {/* Password fields remain similar but updated styling */}
            {[
              { key: 'currentPassword', label: { en: 'Current Password', ar: 'كلمة المرور الحالية' }, show: showCurrentPass, setShow: setShowCurrentPass },
              { key: 'newPassword', label: { en: 'New Password', ar: 'كلمة المرور الجديدة' }, show: showNewPass, setShow: setShowNewPass },
              { key: 'confirmPassword', label: { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' }, show: showConfirmPass, setShow: setShowConfirmPass },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-2">{field.label[lang]}</label>
                <div className="relative">
                  <input
                    type={field.show ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...regPass(field.key, { required: true })}
                    className={inputClass(passErrors[field.key])}
                  />
                  <button type="button" onClick={() => field.setShow(p => !p)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-tertiary-400 dark:text-slate-500 hover:text-tertiary-600 dark:hover:text-slate-300">
                    {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {passErrors[field.key].message || (lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required')}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button type="submit" disabled={changingPass}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-2xl transition disabled:opacity-60">
                <Lock size={18} />
                {changingPass ? 'جاري التغيير...' : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
              </button>
            </div>
          </form>
        </div>

      </div>
    </PageWrapper>
  )
}

export default UserProfile