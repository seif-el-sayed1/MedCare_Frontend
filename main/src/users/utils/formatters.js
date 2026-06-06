export const formatCurrency = (amount, lang = 'en') => {
  if (!amount && amount !== 0) return lang === 'ar' ? '٠ ج.م' : '0 EGP'
  return lang === 'ar'
    ? `${amount.toLocaleString('ar-EG')} ج.م`
    : `${amount.toLocaleString('en-US')} EGP`
}

export const formatDate = (date, lang = 'en') => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const formatDateTime = (date, lang = 'en') => {
  if (!date) return '-'
  return new Date(date).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}