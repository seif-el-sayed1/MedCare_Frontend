import { useState } from 'react'
import { Clock, Calendar } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useWaitingList } from '../../hooks/useWaitingList.js'
import { SPECIALIZATIONS } from '../../constants/index.js'
import { formatDateTime, formatCurrency } from '../../utils/formatters.js'

const WaitingList = () => {
  const { lang, isRTL } = useLanguage()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useWaitingList({
    page,
    limit: 10,
    sort: '-createdAt',
  })

  const items = data?.data || []
  const pagination = data?.pagination

  const paymentColors = {
    FULLY_PAID:     'bg-green-100 text-green-700',
    PARTIALLY_PAID: 'bg-orange-100 text-orange-700',
    NOT_PAID:       'bg-red-100 text-red-600',
  }

  const paymentLabels = {
    FULLY_PAID:     { en: 'Full Payment', ar: 'دفع كامل' },
    PARTIALLY_PAID: { en: 'Partial Payment', ar: 'دفع جزئي' },
    NOT_PAID:       { en: 'No Payment', ar: 'بدون دفع' },
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'قائمة الانتظار' : 'Waiting List'}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'قائمة الانتظار' : 'Waiting List'}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
              {pagination?.totalResults ?? 0} {lang === 'ar' ? 'طلب' : 'requests'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutralSurface-50 dark:bg-slate-700/50 border-b border-neutralSurface-200 dark:border-slate-700">
                <tr>
                  {[
                    lang === 'ar' ? 'المريض' : 'Patient',
                    lang === 'ar' ? 'الطبيب' : 'Doctor',
                    lang === 'ar' ? 'التخصص' : 'Specialization',
                    lang === 'ar' ? 'التاريخ المطلوب' : 'Requested Date',
                    lang === 'ar' ? 'سعر الكشف' : 'Price',
                    lang === 'ar' ? 'نوع الدفع' : 'Payment Type',
                    lang === 'ar' ? 'تاريخ الطلب' : 'Added On',
                  ].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-tertiary-500 dark:text-slate-400 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutralSurface-50 dark:divide-slate-700/50">
                {isLoading
                  ? [...Array(6)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-neutralSurface-50 dark:bg-slate-700/50 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : items.map((item) => (
                      <tr key={item.id} className="hover:bg-teal-50/30 transition">
                        {/* Patient */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-tertiary-900 dark:text-slate-100">
                            {item.user?.firstName} {item.user?.lastName}
                          </p>
                          <p className="text-tertiary-500 dark:text-slate-400 text-xs">{item.user?.email}</p>
                        </td>
                        {/* Doctor */}
                        <td className="px-4 py-3">
                          <p className="text-tertiary-900 dark:text-slate-100">
                            Dr. {item.doctor?.firstName} {item.doctor?.lastName}
                          </p>
                        </td>
                        {/* Specialization */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">
                          {SPECIALIZATIONS[item.doctor?.specialization]?.[lang] || item.doctor?.specialization}
                        </td>
                        {/* Requested Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400">
                            <Calendar size={13} />
                            <span className="text-xs">{formatDateTime(item.requestedDate, lang)}</span>
                          </div>
                        </td>
                        {/* Price */}
                        <td className="px-4 py-3 text-tertiary-900 dark:text-slate-100 font-medium">
                          {formatCurrency(item.doctor?.consultationPrice, lang)}
                        </td>
                        {/* Payment Type */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${paymentColors[item.paymentType] || 'bg-neutralSurface-50 dark:bg-slate-700/50 text-tertiary-500 dark:text-slate-400'}`}>
                            {paymentLabels[item.paymentType]?.[lang] || item.paymentType}
                          </span>
                        </td>
                        {/* Added On */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400">
                            <Clock size={13} />
                            <span className="text-xs">{formatDateTime(item.createdAt, lang)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                }
                {!isLoading && items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-tertiary-500 dark:text-slate-400">
                      {lang === 'ar' ? 'قائمة الانتظار فارغة' : 'Waiting list is empty'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutralSurface-200 dark:border-slate-700">
              <p className="text-sm text-tertiary-500 dark:text-slate-400">
                {lang === 'ar'
                  ? `صفحة ${page} من ${pagination.totalPages}`
                  : `Page ${page} of ${pagination.totalPages}`
                }
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
                  {lang === 'ar' ? 'السابق' : 'Prev'}
                </button>
                <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
                  {lang === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}

export default WaitingList