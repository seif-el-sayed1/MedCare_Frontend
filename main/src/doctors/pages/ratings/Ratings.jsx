import { Star } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useMyRatings } from '../../hooks/useDoctor.js'
import { formatDate } from '../../utils/formatters.js'
import { useState } from 'react'

const Ratings = () => {
  const { lang } = useLanguage()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyRatings({ page, limit: 10, sort: '-createdAt' })

  const ratings = data?.data || []
  const average = data?.averageRate || 0
  const quantity = data?.ratingQuantity || 0
  const pagination = data?.pagination

  const renderStars = (count) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= count ? 'text-amber-400 fill-amber-400' : 'text-neutralSurface-200 fill-neutralSurface-200'}
        />
      ))}
    </div>
  )

  return (
    <PageWrapper title={lang === 'ar' ? 'التقييمات' : 'Ratings'}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Overall Rating Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg mb-4">
                {lang === 'ar' ? 'تقييمك العام' : 'Overall Rating'}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-tertiary-900 dark:text-slate-100 tracking-tight">
                  {average?.toFixed(1) || '0.0'}
                </span>
                <div>
                  {renderStars(Math.round(average))}
                  <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
                    {quantity} {lang === 'ar' ? 'تقييم' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center">
              <Star size={42} className="text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Rating Bars */}
          <div className="mt-8 space-y-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter((r) => Math.round(r.rating) === star).length
              const percent = ratings.length > 0 ? (count / ratings.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 w-10">
                    <span className="text-sm font-medium text-tertiary-500 dark:text-slate-400">{star}</span>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 bg-neutralSurface-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-amber-400 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                  <span className="text-sm text-tertiary-500 dark:text-slate-400 w-8 font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Patient Reviews */}
        <div className="space-y-4">
          <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg px-1">
            {lang === 'ar' ? 'آراء المرضى' : 'Patient Reviews'}
          </h3>

          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-48" />
                    <div className="h-3 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-32" />
                  </div>
                </div>
                <div className="h-16 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
              </div>
            ))
          ) : ratings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 py-20 text-center">
              <Star size={48} className="mx-auto mb-4 text-neutralSurface-200 dark:text-gray-600" />
              <p className="text-tertiary-500 dark:text-slate-400 text-base">
                {lang === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
              </p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-lg flex-shrink-0">
                      {rating.user?.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-tertiary-900 dark:text-slate-100 font-semibold">
                        {rating.user?.firstName} {rating.user?.lastName}
                      </p>
                      <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
                        {formatDate(rating.createdAt, lang)}
                      </p>
                    </div>
                  </div>
                  {renderStars(rating.rating)}
                </div>

                {rating.review && (
                  <div className="mt-5 bg-neutralSurface-50 dark:bg-gray-700/50 border border-neutralSurface-100 dark:border-gray-600 rounded-2xl p-5 text-tertiary-700 dark:text-slate-300">
                    {rating.review}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-tertiary-500 dark:text-slate-400">
              {lang === 'ar' 
                ? `صفحة ${page} من ${pagination.totalPages}` 
                : `Page ${page} of ${pagination.totalPages}`
              }
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

export default Ratings