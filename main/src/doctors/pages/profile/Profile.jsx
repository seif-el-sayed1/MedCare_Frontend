import { useState } from 'react'
import api from '../../api/axiosHelper.js'
import { useForm } from 'react-hook-form'
import { Save, Lock, User, Eye, EyeOff, Stethoscope, Camera } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import useDoctorAuthStore from '../../store/authStore.js'
import { useDoctorProfile, useUpdateDoctorProfile } from '../../hooks/useDoctor.js'
import { changePassword } from '../../api/endpoints/auth.api.js'
import { SPECIALIZATIONS_LIST } from '../../constants/index.js'

const Profile = () => {
  const { lang } = useLanguage()
  const { doctor, setAuth } = useDoctorAuthStore()
  
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const qc = useQueryClient()

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const res = await api.patch('/loggedin-docs/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setAuth(localStorage.getItem('doctor_token'), { ...doctor, ...res.data.data })
      qc.invalidateQueries(['doctor-profile'])
      toast.success(lang === 'ar' ? 'تم تحديث الصورة' : 'Profile picture updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setUploadingImage(false)
    }
  }

  const { data, isLoading } = useDoctorProfile()
  const profile = data?.data

  const { mutate: updateProfile, isPending: updating } = useUpdateDoctorProfile()

  const { mutate: changePass, isPending: changingPass } = useMutation({
    mutationFn: (data) => changePassword(data, lang),
    onSuccess: (res) => {
      toast.success(res.data.message || (lang === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed'))
      resetPass()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  const { register: registerProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm()
  const { register: registerPass, handleSubmit: handlePass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm()

  const newPassword = watch('newPassword')

  const onUpdateProfile = (data) => {
    updateProfile(data, {
      onSuccess: (res) => {
        setAuth(localStorage.getItem('doctor_token'), { ...doctor, ...res.data.data })
      }
    })
  }

  const onChangePass = (data) => changePass({ currentPassword: data.currentPassword, newPassword: data.newPassword, confirmPassword: data.confirmPassword })

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 animate-pulse">
              <div className="h-5 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-40 mb-6" />
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
      <div className="max-w-2xl mx-auto space-y-6 pb-6">

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700 shadow">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Stethoscope size={32} className="text-teal-600" />
                )}
              </div>
              <label
                htmlFor="profile-pic"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 hover:bg-teal-700 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-md"
              >
                <Camera size={14} className="text-white" />
              </label>
              <input
                id="profile-pic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div>
              <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-2xl">
                Dr. {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-tertiary-500 dark:text-slate-400 mt-1">{profile?.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-2xl font-medium">
                  {SPECIALIZATIONS_LIST[profile?.specialization]?.[lang] || profile?.specialization}
                </span>
                <span className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                  ⭐ {profile?.ratingsAverage?.toFixed(1) || '0.0'} ({profile?.ratingQuantity || 0})
                </span>
              </div>
            </div>
          </div>

          {uploadingImage && (
            <div className="mt-4 flex items-center gap-2 text-teal-600 text-sm">
              <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              {lang === 'ar' ? 'جاري رفع الصورة...' : 'Uploading image...'}
            </div>
          )}
        </div>

        {/* Edit Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}
            </h3>
          </div>

          <form onSubmit={handleProfile(onUpdateProfile)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                </label>
                <input 
                  defaultValue={profile?.firstName} 
                  {...registerProfile('firstName', { required: true })} 
                  className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 dark:text-slate-200 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                </label>
                <input 
                  defaultValue={profile?.lastName} 
                  {...registerProfile('lastName', { required: true })} 
                  className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 dark:text-slate-200 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {lang === 'ar' ? 'التليفون' : 'Phone'}
                </label>
                <input 
                  defaultValue={profile?.phone.slice(2)} 
                  placeholder="01XXXXXXXXX" 
                  {...registerProfile('phone')} 
                  dir="ltr"
                  className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 dark:text-slate-200 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {lang === 'ar' ? 'سنوات الخبرة' : 'Experience Years'}
                </label>
                <input 
                  type="number" 
                  min="0" 
                  defaultValue={profile?.experienceYears} 
                  {...registerProfile('experienceYears')} 
                  className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 dark:text-slate-200 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {lang === 'ar' ? 'نبذة' : 'Bio'}
                </label>
                <textarea 
                  rows={4} 
                  defaultValue={profile?.bio} 
                  {...registerProfile('bio')} 
                  className="w-full border border-neutralSurface-200 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={updating}
                className="flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-2xl transition"
              >
                <Save size={18} />
                {updating ? '...' : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
          </div>

          <form onSubmit={handlePass(onChangePass)} className="space-y-6">
            {[
              { key: 'currentPassword', label: { en: 'Current Password', ar: 'كلمة المرور الحالية' }, show: showCurrentPass, setShow: setShowCurrentPass },
              { key: 'newPassword', label: { en: 'New Password', ar: 'كلمة المرور الجديدة' }, show: showNewPass, setShow: setShowNewPass },
              { key: 'confirmPassword', label: { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' }, show: showConfirmPass, setShow: setShowConfirmPass },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-tertiary-500 dark:text-slate-400 text-sm mb-2 font-medium">
                  {field.label[lang]}
                </label>
                <div className="relative">
                  <input
                    type={field.show ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...registerPass(field.key, { required: true })}
                    className="w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:border-teal-600 focus:outline-none text-tertiary-900 dark:text-slate-200 bg-white dark:bg-gray-800 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => field.setShow((p) => !p)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-tertiary-400 dark:text-slate-500 hover:text-tertiary-600 dark:hover:text-teal-400"
                  >
                    {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {passErrors[field.key].message || (lang === 'ar' ? 'مطلوب' : 'Required')}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={changingPass}
                className="flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-2xl transition"
              >
                <Lock size={18} />
                {changingPass ? '...' : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
              </button>
            </div>
          </form>
        </div>

      </div>
    </PageWrapper>
  )
}

export default Profile