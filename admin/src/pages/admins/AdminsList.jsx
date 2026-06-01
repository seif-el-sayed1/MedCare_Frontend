import { useState } from 'react'
import { Search, Plus, Trash2, Edit2, X, Save, UserCog, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import useAuthStore from '../../store/authStore.js'
import { useAdmins, useAddAdmin, useUpdateAdmin, useDeleteAdmin } from '../../hooks/useAdmins.js'
import { formatDate } from '../../utils/formatters.js'

const DeleteConfirmDialog = ({ adm, lang, isRTL, onConfirm, onCancel }) => {
  if (!adm) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base">
              {lang === 'ar' ? 'حذف الأدمن' : 'Delete Admin'}
            </h3>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-1">
              {lang === 'ar'
                ? 'هل أنت متأكد من حذف هذا الأدمن؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this admin? This action cannot be undone.'}
            </p>
          </div>
        </div>
        <div className="bg-neutralSurface-50 dark:bg-slate-700/50 border border-neutralSurface-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
          <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm mx-auto mb-1">
            {adm.firstName?.[0]?.toUpperCase()}
          </div>
          <p className="text-sm font-medium text-tertiary-900 dark:text-slate-100">{adm.firstName} {adm.lastName}</p>
          <p className="text-xs text-tertiary-500 dark:text-slate-400 mt-0.5">{adm.email}</p>
        </div>
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-bold border border-neutralSurface-200 dark:border-slate-700 text-tertiary-900 dark:text-slate-100 rounded-xl hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 transition"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
          >
            {lang === 'ar' ? 'حذف' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const AdminsList = () => {
  const { lang, isRTL } = useLanguage()
  const { admin: currentAdmin } = useAuthStore()
  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useAdmins({
    search: search || undefined,
    page,
    limit: 10,
  })

  const { mutate: addAdmin, isPending: adding } = useAddAdmin()
  const { mutate: updateAdmin, isPending: updating } = useUpdateAdmin(editingAdmin?.id)
  const { mutate: deleteAdmin } = useDeleteAdmin()

  const admins = data?.data || []
  const pagination = data?.pagination

  const {
    register: registerAdd,
    handleSubmit: handleAdd,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm()

  const {
    register: registerEdit,
    handleSubmit: handleEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm()

  const onAdd = (data) => {
    addAdmin(data, {
      onSuccess: () => {
        setShowAddModal(false)
        resetAdd()
      }
    })
  }

  const onEdit = (data) => {
    updateAdmin(data, {
      onSuccess: () => {
        setEditingAdmin(null)
        resetEdit()
      }
    })
  }

  const handleConfirmDelete = () => {
    deleteAdmin(deleteTarget.id)
    setDeleteTarget(null)
  }

  const inputClass = (hasError) =>
    `w-full border ${hasError ? 'border-red-400' : 'border-neutralSurface-200 dark:border-slate-600'} rounded-xl px-4 py-3 text-sm text-tertiary-900 dark:text-slate-100 placeholder-tertiary-500 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white dark:bg-slate-700/50 transition`

  if (!isSuperAdmin) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الأدمنز' : 'Admins'}>
        <div className="flex flex-col items-center justify-center py-24 text-tertiary-500 dark:text-slate-400">
          <UserCog size={48} className="mb-4 opacity-30" />
          <p className="text-base font-medium">
            {lang === 'ar' ? 'غير مصرح لك بالوصول لهذه الصفحة' : 'You are not authorized to access this page'}
          </p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'الأدمنز' : 'Admins'}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'إدارة الأدمنز' : 'Admins Management'}
            </h2>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mt-0.5">
              {pagination?.totalResults ?? 0} {lang === 'ar' ? 'أدمن' : 'admins'}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm dark:shadow-black/20"
          >
            <Plus size={18} />
            {lang === 'ar' ? 'إضافة أدمن' : 'Add Admin'}
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-tertiary-500 dark:text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
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
                    lang === 'ar' ? 'الأدمن' : 'Admin',
                    lang === 'ar' ? 'الإيميل' : 'Email',
                    lang === 'ar' ? 'الدور' : 'Role',
                    lang === 'ar' ? 'الحالة' : 'Status',
                    lang === 'ar' ? 'تاريخ الإضافة' : 'Added',
                    lang === 'ar' ? 'الإجراءات' : 'Actions',
                  ].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-tertiary-500 dark:text-slate-400 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutralSurface-50 dark:divide-slate-700/50">
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-neutralSurface-50 dark:bg-slate-700/50 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-teal-50/30 transition">
                        {/* Admin */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                              {adm.firstName?.[0]?.toUpperCase()}
                            </div>
                            <p className="font-medium text-tertiary-900 dark:text-slate-100">{adm.firstName} {adm.lastName}</p>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">{adm.email}</td>
                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${adm.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-teal-50 text-teal-700'}`}>
                            {adm.role === 'SUPER_ADMIN'
                              ? (lang === 'ar' ? 'سوبر أدمن' : 'Super Admin')
                              : (lang === 'ar' ? 'أدمن' : 'Admin')
                            }
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${adm.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {adm.isVerified
                              ? (lang === 'ar' ? 'موثق' : 'Verified')
                              : (lang === 'ar' ? 'غير موثق' : 'Unverified')
                            }
                          </span>
                        </td>
                        {/* Added */}
                        <td className="px-4 py-3 text-tertiary-500 dark:text-slate-400">{formatDate(adm.createdAt, lang)}</td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          {adm.id !== currentAdmin?.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setEditingAdmin(adm); resetEdit({ firstName: adm.firstName, lastName: adm.lastName }) }}
                                className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(adm)}
                                className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                }
                {!isLoading && admins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-tertiary-500 dark:text-slate-400">
                      {lang === 'ar' ? 'لا توجد بيانات' : 'No admins found'}
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
                {lang === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
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

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">{lang === 'ar' ? 'إضافة أدمن' : 'Add Admin'}</h3>
              <button type="button" onClick={() => { setShowAddModal(false); resetAdd() }}
                className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 rounded-xl transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd(onAdd)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">
                    {lang === 'ar' ? 'الاسم الأول' : 'First Name'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder={lang === 'ar' ? 'الاسم الأول' : 'First name'}
                    {...registerAdd('firstName', { required: true })}
                    className={inputClass(addErrors.firstName)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">
                    {lang === 'ar' ? 'الاسم الأخير' : 'Last Name'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder={lang === 'ar' ? 'الاسم الأخير' : 'Last name'}
                    {...registerAdd('lastName', { required: true })}
                    className={inputClass(addErrors.lastName)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+201XXXXXXXXX"
                    {...registerAdd('phone')}
                    className={inputClass(false)}
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">
                  {lang === 'ar' ? 'الإيميل' : 'Email'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder={lang === 'ar' ? 'أدخل الإيميل' : 'Enter email'}
                  {...registerAdd('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                  className={inputClass(addErrors.email)}
                />
                {addErrors.email && <p className="text-red-400 text-xs mt-1">{lang === 'ar' ? 'إيميل غير صحيح' : 'Invalid email'}</p>}
              </div>
              <p className="text-xs text-tertiary-500 dark:text-slate-400">
                {lang === 'ar'
                  ? '* سيتم إرسال إيميل تحقق للأدمن الجديد لتفعيل حسابه'
                  : '* A verification email will be sent to activate the account'}
              </p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(false); resetAdd() }}
                  className="flex-1 py-2 border border-neutralSurface-200 dark:border-slate-700 text-tertiary-900 dark:text-slate-100 text-sm font-bold rounded-xl hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 transition">
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={adding}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition disabled:opacity-60">
                  {adding ? '...' : (lang === 'ar' ? 'إضافة' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutralSurface-200 dark:border-slate-700 shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold">{lang === 'ar' ? 'تعديل الأدمن' : 'Edit Admin'}</h3>
              <button type="button" onClick={() => setEditingAdmin(null)}
                className="p-1.5 text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100 hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 rounded-xl transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEdit(onEdit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                  <input
                    defaultValue={editingAdmin.firstName}
                    {...registerEdit('firstName', { required: true })}
                    className={inputClass(editErrors.firstName)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                  <input
                    defaultValue={editingAdmin.lastName}
                    {...registerEdit('lastName', { required: true })}
                    className={inputClass(editErrors.lastName)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tertiary-500 dark:text-slate-400 mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingAdmin.phone}
                    placeholder="+201XXXXXXXXX"
                    {...registerEdit('phone')}
                    className={inputClass(false)}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingAdmin(null)}
                  className="flex-1 py-2 border border-neutralSurface-200 dark:border-slate-700 text-tertiary-900 dark:text-slate-100 text-sm font-bold rounded-xl hover:bg-neutralSurface-50 dark:hover:bg-slate-700/30 transition">
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition disabled:opacity-60">
                  <Save size={15} />
                  {updating ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        adm={deleteTarget}
        lang={lang}
        isRTL={isRTL}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </PageWrapper>
  )
}

export default AdminsList