import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Stethoscope, ChevronRight, ChevronLeft } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import useUserAuthStore from '../store/authStore.js'
import { useDoctors } from '../hooks/useDoctors.js'
import { SPECIALIZATIONS } from '../constants/index.js'
import { formatCurrency } from '../utils/formatters.js'

const Home = () => {
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'
  const { user } = useUserAuthStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useDoctors({
    search: search || undefined,
    specialization: specialization || undefined,
    isDeleted: false,
    page,
    limit: 12,
  })

  const doctors = data?.data || []
  const pagination = data?.pagination

  return (
    <PageWrapper title={lang === 'ar' ? 'الرئيسية' : 'Home'}>
      <div className="space-y-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-sky-600 rounded-2xl p-6 text-white">
          <p className="text-teal-100 text-sm">
            {lang === 'ar' ? 'مرحباً،' : 'Welcome back,'}
          </p>
          <h2 className="text-2xl font-bold mt-1">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-teal-100 text-sm mt-2">
            {lang === 'ar' ? 'ابحث عن طبيبك المناسب واحجز موعدك' : 'Find your doctor and book an appointment'}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-400 dark:text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث باسم الطبيب...' : 'Search by doctor name...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={`w-full border border-neutralSurface-200 dark:border-gray-700 rounded-2xl py-3.5 text-sm text-tertiary-900 dark:text-slate-100 placeholder:text-tertiary-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-600 bg-white dark:bg-gray-800 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>
          <select
            value={specialization}
            onChange={(e) => { setSpecialization(e.target.value); setPage(1) }}
            className="border border-neutralSurface-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-sm text-tertiary-900 dark:text-slate-100 focus:outline-none focus:border-teal-600 bg-white dark:bg-gray-800 w-full sm:w-auto"
          >
            <option value="">{lang === 'ar' ? 'كل التخصصات' : 'All Specializations'}</option>
            {Object.entries(SPECIALIZATIONS).map(([key, val]) => (
              <option key={key} value={key}>{val[lang]}</option>
            ))}
          </select>
        </div>

        {/* Specializations Quick Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => { setSpecialization(''); setPage(1) }}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
              !specialization 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-tertiary-600 dark:text-slate-400 border border-neutralSurface-200 dark:border-gray-700 hover:bg-neutralSurface-50 dark:hover:bg-gray-700'
            }`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          {Object.entries(SPECIALIZATIONS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setSpecialization(key); setPage(1) }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                specialization === key 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-tertiary-600 dark:text-slate-400 border border-neutralSurface-200 dark:border-gray-700 hover:bg-neutralSurface-50 dark:hover:bg-gray-700'
              }`}
            >
              {val[lang]}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-tertiary-500 dark:text-slate-400 text-sm font-medium">
          {pagination?.totalResults ?? 0} {lang === 'ar' ? 'طبيب' : 'doctors found'}
        </p>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-40" />
                      <div className="h-3 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-28" />
                    </div>
                  </div>
                  <div className="h-9 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                </div>
              ))
            : doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 cursor-pointer hover:shadow transition-all group"
                >
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {doc.profilePicture
                        ? <img src={doc.profilePicture} alt={doc.firstName} className="w-full h-full object-cover" />
                        : <Stethoscope size={28} className="text-teal-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-tertiary-900 dark:text-slate-100 font-semibold truncate">
                        Dr. {doc.firstName} {doc.lastName}
                      </p>
                      <p className="text-teal-600 text-sm mt-0.5">
                        {SPECIALIZATIONS[doc.specialization]?.[lang] || doc.specialization}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-tertiary-700 dark:text-slate-300 text-sm font-medium">
                          {doc.ratingsAverage?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-tertiary-500 dark:text-slate-400 text-sm">({doc.ratingQuantity || 0})</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutralSurface-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-tertiary-500 dark:text-slate-400">{lang === 'ar' ? 'سعر الكشف' : 'Consultation'}</p>
                      <p className="text-lg font-bold text-tertiary-900 dark:text-slate-100">
                        {formatCurrency(doc.consultationPrice, lang)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold group-hover:translate-x-0.5 transition">
                      {lang === 'ar' ? 'احجز الآن' : 'Book now'}
                      {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
              ))
          }

          {!isLoading && doctors.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Stethoscope size={48} className="mx-auto mb-4 text-neutralSurface-200 dark:text-gray-600" />
              <p className="text-tertiary-500 dark:text-slate-400 text-base">
                {lang === 'ar' ? 'لا توجد نتائج' : 'No doctors found'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-tertiary-500 dark:text-slate-400">
              {lang === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
            </p>
            <div className="flex gap-3">
              <button 
                disabled={page === 1} 
                onClick={() => setPage((p) => p - 1)}
                className="px-6 py-3 text-sm border border-neutralSurface-200 dark:border-gray-700 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800 font-medium"
              >
                {lang === 'ar' ? 'السابق' : 'Prev'}
              </button>
              <button 
                disabled={page === pagination.totalPages} 
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-3 text-sm border border-neutralSurface-200 dark:border-gray-700 rounded-2xl disabled:opacity-40 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800 font-medium"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}

export default Home