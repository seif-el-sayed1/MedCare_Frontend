import { Trash2 } from 'lucide-react'

const ConfirmModal = ({ isOpen, onConfirm, onCancel, lang, loading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-2xl mx-auto mb-6">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-xl text-center mb-2">
          {lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
        </h3>
        <p className="text-tertiary-500 dark:text-slate-400 text-center mb-8">
          {lang === 'ar' ? 'لن تتمكن من التراجع عن هذا الإجراء' : 'This action cannot be undone'}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 border border-neutralSurface-200 dark:border-gray-600 text-tertiary-600 dark:text-slate-300 text-sm font-medium rounded-2xl hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-2xl transition disabled:opacity-60"
          >
            {loading ? '...' : (lang === 'ar' ? 'حذف' : 'Delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal