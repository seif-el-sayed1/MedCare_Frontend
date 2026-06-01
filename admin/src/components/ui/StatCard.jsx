const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', loading, isSmall }) => {
  const colors = {
    blue:   { bg: 'bg-secondary-50', icon: 'bg-secondary-500', text: 'text-secondary-600' },
    green:  { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
    orange: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-600' },
    red:    { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-600' },
    teal:   { bg: 'bg-primary-50', icon: 'bg-primary-500', text: 'text-primary-600' },
  }
  const c = colors[color] || colors.blue

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm animate-pulse">
        <div className="h-4 bg-neutralSurface-100 dark:bg-slate-700 rounded w-20 mb-3" />
        <div className="h-8 bg-neutralSurface-100 dark:bg-slate-700 rounded w-28" />
      </div>
    )
  }

  // Large Dashboard Cards
  if (!isSmall) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20 transition-all duration-300 hover:shadow-md dark:hover:shadow-black/40">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-tertiary-400 dark:text-slate-500 text-sm font-bold tracking-wide mb-1 uppercase">{title}</p>
            <p className="text-3xl sm:text-4xl font-black text-tertiary-900 dark:text-slate-100 tracking-tight">{value}</p>
          </div>
          <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className={c.text} />
          </div>
        </div>
        {subtitle && (
          <p className="text-xs font-bold text-secondary-600 bg-secondary-50 inline-block px-2.5 py-1 rounded-lg mt-1">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  // Mini Side Cards
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20 flex items-center gap-3.5 transition-all hover:shadow-md dark:hover:shadow-black/40">
      <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={c.text} />
      </div>
      <div>
        <p className="text-tertiary-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-base sm:text-lg font-black text-tertiary-900 dark:text-slate-100 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default StatCard