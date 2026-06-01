import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight,Trash2, Clock, User, Plus } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { 
  useDoctor, useUpdateDoctor, useAddWorkingHours, 
  useDeleteWorkingHours 
} from '../../hooks/useDoctors.js'
import { SPECIALIZATIONS } from '../../constants/index.js'

const DAYS = [
  { value: 0, en: 'Sunday', ar: 'الأحد' }, { value: 1, en: 'Monday', ar: 'الاثنين' },
  { value: 2, en: 'Tuesday', ar: 'الثلاثاء' }, { value: 3, en: 'Wednesday', ar: 'الأربعاء' },
  { value: 4, en: 'Thursday', ar: 'الخميس' }, { value: 5, en: 'Friday', ar: 'الجمعة' },
  { value: 6, en: 'Saturday', ar: 'السبت' },
]

const DoctorDetails = () => {
  const { id } = useParams()
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const { data, isLoading } = useDoctor(id)
  const doctor = data?.data

  const { mutate: updateDoctor } = useUpdateDoctor(id)
  const { mutate: deleteWH } = useDeleteWorkingHours(id)
  const { mutate: addWH } = useAddWorkingHours(id)
  
  const [editMode, setEditMode] = useState(false)
  const [showAddWH, setShowAddWH] = useState(false)
  const [newWH, setNewWH] = useState({ dayOfWeek: 0, startTime: '09:00', endTime: '17:00', slotDuration: 30 })
  
  const { register, handleSubmit } = useForm()

  const inputClass = "w-full bg-white dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:shadow-black/20";
  const labelClass = "text-xs font-bold text-tertiary-800 dark:text-slate-200 block mb-1.5";

  if (isLoading) return <PageWrapper title="Loading..." />

  const onUpdateSubmit = (data) => {
    updateDoctor({
      ...data,
      consultationPrice: Number(data.consultationPrice),
      experienceYears: Number(data.experienceYears),
    }, { onSuccess: () => setEditMode(false) })
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'بيانات الطبيب' : 'Doctor Details'}>
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <button onClick={() => navigate('/doctors')} className="text-tertiary-500 dark:text-slate-400 hover:text-teal-600 flex items-center gap-1.5 text-sm font-semibold transition">
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/50 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-tertiary-900 dark:text-slate-100 font-bold text-lg">Dr. {doctor.firstName} {doctor.lastName}</h2>
              <p className="text-tertiary-500 dark:text-slate-400 text-sm">{doctor.email}</p>
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="text-teal-600 font-bold text-sm bg-teal-50 dark:bg-teal-950/40 px-4 py-2 rounded-xl">
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Basic Information Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>First Name</label><input disabled={!editMode} defaultValue={doctor.firstName} {...register('firstName')} className={inputClass} /></div>
              <div><label className={labelClass}>Last Name</label><input disabled={!editMode} defaultValue={doctor.lastName} {...register('lastName')} className={inputClass} /></div>
              <div><label className={labelClass}>Email</label><input disabled={!editMode} defaultValue={doctor.email} {...register('email')} className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input disabled={!editMode} defaultValue={doctor.phone} {...register('phone')} className={inputClass} /></div>
              <div><label className={labelClass}>Specialization</label><select disabled={!editMode} defaultValue={doctor.specialization} {...register('specialization')} className={inputClass}>{Object.entries(SPECIALIZATIONS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}</select></div>
              <div><label className={labelClass}>Price</label><input disabled={!editMode} type="number" defaultValue={doctor.consultationPrice} {...register('consultationPrice')} className={inputClass} /></div>
              <div><label className={labelClass}>Experience (Years)</label><input disabled={!editMode} type="number" defaultValue={doctor.experienceYears} {...register('experienceYears')} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Bio</label><textarea disabled={!editMode} defaultValue={doctor.bio} {...register('bio')} className={inputClass} rows="3" /></div>
            {editMode && <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold">Save Changes</button>}
          </form>
        </div>

        {/* Working Hours */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold flex items-center gap-2"><Clock size={18} className="text-teal-600"/> Working Hours</h3>
            <button onClick={() => setShowAddWH(!showAddWH)} className="text-teal-600 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Add Time
            </button>
          </div>

          {showAddWH && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl">
              <select onChange={(e) => setNewWH({...newWH, dayOfWeek: Number(e.target.value)})} className={inputClass}><option value={0}>Sunday</option><option value={1}>Monday</option></select>
              <input type="time" onChange={(e) => setNewWH({...newWH, startTime: e.target.value})} className={inputClass} />
              <input type="time" onChange={(e) => setNewWH({...newWH, endTime: e.target.value})} className={inputClass} />
              <button onClick={() => addWH({ workingHours: [newWH] }, { onSuccess: () => setShowAddWH(false) })} className="bg-teal-600 text-white rounded-xl text-sm font-bold">Save</button>
            </div>
          )}

          <div className="space-y-2">
            {doctor.workingHours.map((wh) => (
              <div key={wh.id} className="flex justify-between items-center p-3 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl">
                <span className="font-bold text-tertiary-900 dark:text-slate-100">{DAYS[wh.dayOfWeek]?.[lang]}</span>
                <span className="text-tertiary-600 dark:text-slate-400 text-sm">{wh.startTime} - {wh.endTime} ({wh.slotDuration} min)</span>
                <button onClick={() => deleteWH(wh.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default DoctorDetails