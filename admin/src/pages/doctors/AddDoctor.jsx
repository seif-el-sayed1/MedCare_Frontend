import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {  Trash2, ArrowLeft, UserPlus, Clock } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useAddDoctor } from '../../hooks/useDoctors.js'
import { SPECIALIZATIONS } from '../../constants/index.js'

const DAYS = [
  { value: 0, en: 'Sunday', ar: 'الأحد' },
  { value: 1, en: 'Monday', ar: 'الاثنين' },
  { value: 2, en: 'Tuesday', ar: 'الثلاثاء' },
  { value: 3, en: 'Wednesday', ar: 'الأربعاء' },
  { value: 4, en: 'Thursday', ar: 'الخميس' },
  { value: 5, en: 'Friday', ar: 'الجمعة' },
  { value: 6, en: 'Saturday', ar: 'السبت' },
]

const AddDoctor = () => {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const { mutate: addDoctor, isPending } = useAddDoctor()
  const [workingHours, setWorkingHours] = useState([{ dayOfWeek: '', startTime: '', endTime: '', slotDuration: 30 }])

  const { register, handleSubmit, formState: { errors } } = useForm()

  const addDay = () => setWorkingHours(prev => [...prev, { dayOfWeek: '', startTime: '', endTime: '', slotDuration: 30 }])
  const removeDay = (index) => setWorkingHours(prev => prev.filter((_, i) => i !== index))
  const updateDay = (index, field, value) => {
    setWorkingHours(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const onSubmit = (data) => {
    const payload = {
      ...data,
      consultationPrice: Number(data.consultationPrice),
      experienceYears: Number(data.experienceYears),
      workingHours: workingHours.map(wh => ({
        ...wh,
        dayOfWeek: Number(wh.dayOfWeek),
        slotDuration: Number(wh.slotDuration)
      }))
    }
    addDoctor(payload, { onSuccess: () => navigate('/doctors') })
  }

  const inputClass = "w-full bg-white dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:shadow-black/20";
  const labelClass = "text-xs font-bold text-tertiary-800 dark:text-slate-200 block mb-1.5";

  return (
    <PageWrapper title={lang === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6 p-4">
        <button type="button" onClick={() => navigate('/doctors')} className="text-tertiary-500 dark:text-slate-400 hover:text-teal-600 flex items-center gap-1.5 text-sm font-semibold transition">
          <ArrowLeft size={16} /> {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 space-y-4">
          <div className="flex items-center gap-2 mb-4 text-tertiary-900 dark:text-slate-100 font-bold">
            <UserPlus className="text-teal-600" size={20} />
            <h3>{lang === 'ar' ? 'البيانات الأساسية' : 'Basic Information'}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label><input {...register('firstName', { required: true })} className={inputClass} /></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label><input {...register('lastName', { required: true })} className={inputClass} /></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label><input type="email" {...register('email', { required: true })} className={inputClass} /></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label><input {...register('phone', { required: true })} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'التخصص' : 'Specialization'}</label><select {...register('specialization', { required: true })} className={inputClass}>{Object.entries(SPECIALIZATIONS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}</select></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'سعر الكشف' : 'Price'}</label><input type="number" {...register('consultationPrice', { required: true })} className={inputClass} /></div>
            <div><label className={labelClass}>{lang === 'ar' ? 'سنوات الخبرة' : 'Experience'}</label><input type="number" {...register('experienceYears', { required: true })} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Bio</label><textarea {...register('bio')} className={inputClass} rows="3" /></div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-tertiary-900 dark:text-slate-100 font-bold"><Clock className="text-teal-600" size={20} /><h3>{lang === 'ar' ? 'مواعيد العمل' : 'Working Hours'}</h3></div>
            <button type="button" onClick={addDay} className="text-xs font-bold text-teal-600 hover:text-sky-600 transition">+ {lang === 'ar' ? 'إضافة يوم' : 'Add'}</button>
          </div>
          {workingHours.map((wh, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <select value={wh.dayOfWeek} onChange={(e) => updateDay(i, 'dayOfWeek', e.target.value)} className={inputClass}><option value="">{lang === 'ar' ? 'اليوم' : 'Day'}</option>{DAYS.map(d => <option key={d.value} value={d.value}>{d[lang]}</option>)}</select>
              <input type="time" value={wh.startTime} onChange={(e) => updateDay(i, 'startTime', e.target.value)} className={inputClass} />
              <input type="time" value={wh.endTime} onChange={(e) => updateDay(i, 'endTime', e.target.value)} className={inputClass} />
              <input type="number" value={wh.slotDuration} onChange={(e) => updateDay(i, 'slotDuration', e.target.value)} className={inputClass} style={{width: '90px'}} />
              <button type="button" onClick={() => removeDay(i)} className="p-3 text-tertiary-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isPending} className="w-full rounded-xl py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:brightness-105 shadow-md shadow-teal-600/10 transition">
          {isPending ? '...' : (lang === 'ar' ? 'إضافة الطبيب' : 'Add Doctor')}
        </button>
      </form>
    </PageWrapper>
  )
}

export default AddDoctor