import { useState } from 'react'
import { Search, User } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { useUsers } from '../../hooks/useUsers.js'
import { formatDate } from '../../utils/formatters.js'

const UsersList = () => {
  const { lang, isRTL } = useLanguage()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useUsers({
    search: search || undefined,
    page,
    limit: 10,
    sort: '-createdAt',
  })

  const users = data?.data || []
  const pagination = data?.pagination

  return (
    <PageWrapper title={lang === 'ar' ? 'المرضى' : 'Users'}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'قائمة المرضى' : 'Users List'}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
              {pagination?.totalResults ?? 0} {lang === 'ar' ? 'مريض' : 'users'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-500 ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث بالاسم أو الإيميل...' : 'Search by name or email...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={`w-full border border-neutralSurface-200 dark:border-slate-600 rounded-xl py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-500 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 bg-white dark:bg-slate-700/50 transition ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutralSurface-50 dark:bg-slate-700/50 border-b border-neutralSurface-200 dark:border-slate-700">
                <tr>
                  {[
                    lang === 'ar' ? 'المريض' : 'Patient',
                    lang === 'ar' ? 'الإيميل' : 'Email',
                    lang === 'ar' ? 'التليفون' : 'Phone',
                    lang === 'ar' ? 'العمر' : 'Age',
                    lang === 'ar' ? 'تاريخ التسجيل' : 'Joined',
                    lang === 'ar' ? 'الحالة' : 'Status',
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
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-neutralSurface-50 dark:bg-slate-700/50 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : users.map((user) => (
                      <tr key={user.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition">
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-teal-50 dark:bg-teal-950/50 rounded-full flex items-center justify-center flex-shrink-0">
                                {user.profilePicture
                                  ? <img src={user.profilePicture} alt={user.firstName} className="w-9 h-9 rounded-full object-cover" />
                                  : <User size={16} className="text-teal-600 dark:text-teal-400" />
                                }
                              </div>
                              <div>
                                <p className="font-medium text-tertiary-900 dark:text-slate-100">{user.firstName} {user.lastName}</p>
                              </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">{user.email}</td>
                        {/* Phone */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400" dir="ltr">{user.phone || '—'}</td>
                        {/* Age */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">
                          {user.age ? `${user.age} ${lang === 'ar' ? 'سنة' : 'yrs'}` : '—'}
                        </td>
                        {/* Joined */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">
                          {formatDate(user.createdAt, lang)}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${user.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {user.isVerified
                              ? (lang === 'ar' ? 'موثق' : 'Verified')
                              : (lang === 'ar' ? 'غير موثق' : 'Unverified')
                            }
                          </span>
                        </td>
                      </tr>
                    ))
                }
                {!isLoading && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-tertiary-500">
                      {lang === 'ar' ? 'لا توجد بيانات' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutralSurface-200">
              <p className="text-sm text-tertiary-500">
                {lang === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
                  {lang === 'ar' ? 'السابق' : 'Prev'}
                </button>
                <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-bold border border-neutralSurface-200 rounded-xl disabled:opacity-40 hover:border-teal-600 hover:text-teal-600 transition">
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

export default UsersList