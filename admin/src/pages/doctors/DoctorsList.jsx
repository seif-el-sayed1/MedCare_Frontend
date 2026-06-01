import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Star, Trash2, RotateCcw, Eye } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useDoctors, useToggleDelete } from '../../hooks/useDoctors.js'
import { SPECIALIZATIONS } from '../../constants/index.js'
import { formatCurrency } from '../../utils/formatters.js'

const DoctorsList = () => {
  const { lang, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useDoctors({ search, specialization: specialization || undefined, page, limit: 10 })
  const { mutate: toggleDelete } = useToggleDelete()

  const doctors = data?.data || []
  const pagination = data?.pagination

  const inputClass = "w-full border border-neutralSurface-200 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition shadow-sm dark:bg-slate-700/50";

  return (
    <PageWrapper title={lang === 'ar' ? 'الأطباء' : 'Doctors'}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-tertiary-900 dark:text-slate-100 font-bold text-xl">{lang === 'ar' ? 'إدارة الأطباء' : 'Doctors Management'}</h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">{pagination?.totalResults ?? 0} {lang === 'ar' ? 'طبيب' : 'doctors'}</p>
          </div>
          <button
            onClick={() => navigate('/doctors/add')}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:brightness-105 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-md shadow-teal-600/10"
          >
            <Plus size={18} /> {lang === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={`${inputClass} ${isRTL ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <select
            value={specialization}
            onChange={(e) => { setSpecialization(e.target.value); setPage(1) }}
            className={`${inputClass} max-w-[200px]`}
          >
            <option value="">{lang === 'ar' ? 'كل التخصصات' : 'All'}</option>
            {Object.entries(SPECIALIZATIONS).map(([key, val]) => (
              <option key={key} value={key}>{val[lang]}</option>
            ))}
          </select>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutralSurface-50 dark:bg-slate-700/50 border-b border-neutralSurface-200 dark:border-slate-700">
              <tr>
                {['الطبيب', 'التخصص', 'السعر', 'التقييم', 'الخبرة', 'الحالة', 'الإجراءات'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-tertiary-600 dark:text-slate-400 uppercase tracking-wider text-start">
                    {lang === 'ar' ? h : h.replace('الطبيب', 'Doctor').replace('التخصص', 'Specialization').replace('السعر', 'Price').replace('التقييم', 'Rating').replace('الخبرة', 'Experience').replace('الحالة', 'Status').replace('الإجراءات', 'Actions')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutralSurface-100 dark:divide-slate-700/50">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-neutralSurface-50/50 dark:hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 font-bold text-tertiary-900 dark:text-slate-100">Dr. {doc.firstName} {doc.lastName}</td>
                  <td className="px-6 py-4 text-tertiary-600 dark:text-slate-400">{SPECIALIZATIONS[doc.specialization]?.[lang]}</td>
                  <td className="px-6 py-4 font-semibold text-teal-600">{formatCurrency(doc.consultationPrice, lang)}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={14} fill="currentColor" /> {doc.ratingsAverage?.toFixed(1) || '0.0'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-tertiary-600 dark:text-slate-400">{doc.experienceYears} {lang === 'ar' ? 'سنة' : 'yrs'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${doc.isDeleted ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {doc.isDeleted ? (lang === 'ar' ? 'محذوف' : 'Deleted') : (lang === 'ar' ? 'نشط' : 'Active')}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate(`/doctors/${doc.id}`)} className="text-tertiary-400 hover:text-teal-600">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => toggleDelete(doc.id)} 
                      className={`transition ${doc.isDeleted ? 'text-amber-600 hover:text-amber-700' : 'text-tertiary-400 hover:text-red-600'}`}
                    >
                      {doc.isDeleted ? <RotateCcw size={18} /> : <Trash2 size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  )
}

export default DoctorsList