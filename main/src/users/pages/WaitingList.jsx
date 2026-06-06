import { useState } from 'react'
import { Clock, Stethoscope, X } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import { useMyWaitingList, useRemoveFromWaitingList } from '../hooks/useWaitingList.js'
import { SPECIALIZATIONS, PAYMENT_TYPE } from '../constants/index.js'
import { formatCurrency, formatDateTime } from '../utils/formatters.js'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'

const WaitingList = () => {
  const { lang } = useLangStore()
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState(null)

  const { data, isLoading } = useMyWaitingList({ page, limit: 10, sort: '-createdAt' })
  const { mutate: remove, isPending: removing } = useRemoveFromWaitingList()

  const items = data?.data || []
  const pagination = data?.pagination

  return (
    <PageWrapper title={lang === 'ar' ? 'قائمة الانتظار' : 'Waiting List'}>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-2xl">
            {lang === 'ar' ? 'قائمة انتظاري' : 'My Waiting List'}
          </h2>
          <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
            {pagination?.total ?? 0} {lang === 'ar' ? 'طلب' : 'requests'}
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-52" />
                      <div className="h-4 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-72" />
                    </div>
                  </div>
                </div>
              ))
            : items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6 hover:shadow transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.doctor?.profilePicture
                          ? <img src={item.doctor.profilePicture} alt="" className="w-full h-full object-cover" />
                          : <Stethoscope size={28} className="text-teal-600" />
                        }
                      </div>
                      <div>
                        <p className="text-tertiary-900 dark:text-slate-100 font-semibold">
                          Dr. {item.doctor?.firstName} {item.doctor?.lastName}
                        </p>
                        <p className="text-teal-600 text-sm mt-0.5">
                          {SPECIALIZATIONS[item.doctor?.specialization]?.[lang]}
                        </p>
                        <div className="flex items-center gap-1.5 text-tertiary-500 dark:text-slate-400 text-sm mt-2">
                          <Clock size={16} />
                          {formatDateTime(item.createdAt, lang)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmId(item.id)}
                      className="p-3 text-tertiary-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-neutralSurface-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-tertiary-500 dark:text-slate-400">
                        {lang === 'ar' ? 'سعر الكشف' : 'Consultation Price'}
                      </p>
                      <p className="text-lg font-bold text-tertiary-900 dark:text-slate-100">
                        {formatCurrency(item.doctor?.consultationPrice, lang)}
                      </p>
                    </div>

                    <div className="text-center">
                      <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-2xl text-sm font-medium">
                        {PAYMENT_TYPE[item.paymentType]?.[lang] || item.paymentType}
                      </span>
                    </div>

                    <div className={`px-4 py-1.5 rounded-2xl text-sm font-semibold
                      ${item.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : ''}
                      ${item.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {item.status === 'WAITING' && (lang === 'ar' ? 'قيد الانتظار' : 'Waiting')}
                      {item.status === 'ACCEPTED' && (lang === 'ar' ? 'تم القبول' : 'Accepted')}
                      {item.status === 'REJECTED' && (lang === 'ar' ? 'مرفوض' : 'Rejected')}
                    </div>
                  </div>
                </div>
              ))
          }

          {!isLoading && items.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 py-20 text-center">
              <Clock size={48} className="mx-auto mb-4 text-neutralSurface-200 dark:text-gray-600" />
              <p className="text-tertiary-500 dark:text-slate-400">
                {lang === 'ar' ? 'قائمة الانتظار فارغة' : 'Waiting list is empty'}
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

      <ConfirmModal
        isOpen={!!confirmId}
        onConfirm={() => remove(confirmId, { onSuccess: () => setConfirmId(null) })}
        onCancel={() => setConfirmId(null)}
        lang={lang}
        loading={removing}
        title={lang === 'ar' ? 'إزالة من قائمة الانتظار' : 'Remove from waiting list'}
        message={lang === 'ar' ? 'هل تريد إزالة هذا الطلب؟' : 'Do you want to remove this request?'}
      />
    </PageWrapper>
  )
}

export default WaitingList