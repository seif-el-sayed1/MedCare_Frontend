import { useState } from 'react'
import { Users, Stethoscope, CalendarDays, DollarSign, CalendarCheck, XCircle, Clock, TrendingUp } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageWrapper from '../../components/layout/PageWrapper.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import {
  useOverviewStats,
  useAppointmentsChart,
  useRevenueChart,
  useTopDoctors,
  useNewUsersChart,
  useRecentAppointments,
  useRecentPayments,
} from '../../hooks/useDashboard.js'
import { formatCurrency, formatDateTime } from '../../utils/formatters.js'
import { SPECIALIZATIONS, APPOINTMENT_STATUS } from '../../constants/index.js'

const Dashboard = () => {
  const { lang, isRTL } = useLanguage()
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [usersPeriod, setUsersPeriod] = useState('monthly')

  const { data: statsData, isLoading: statsLoading } = useOverviewStats()
  const { data: appointmentsChart, isLoading: aptsChartLoading } = useAppointmentsChart(chartPeriod)
  const { data: revenueChart, isLoading: revChartLoading } = useRevenueChart()
  const { data: topDoctors, isLoading: topDoctorsLoading } = useTopDoctors()
  const { data: newUsersChart, isLoading: usersChartLoading } = useNewUsersChart(usersPeriod)
  const { data: recentAppointments, isLoading: recentAptsLoading } = useRecentAppointments()
  const { data: recentPayments, isLoading: recentPaymentsLoading } = useRecentPayments()

  const stats = statsData?.data
  const appointmentsList = recentAppointments?.data || []
  const paymentsList = recentPayments?.data || []

  const periods = [
    { value: 'daily',   label: { en: 'Daily',   ar: 'يومي' } },
    { value: 'weekly',  label: { en: 'Weekly',  ar: 'أسبوعي' } },
    { value: 'monthly', label: { en: 'Monthly', ar: 'شهري' } },
  ]

  const statusColors = {
    PENDING:   'bg-amber-50 text-amber-600 border border-amber-100',
    CONFIRMED: 'bg-blue-50 text-blue-600 border border-blue-100',
    CANCELLED: 'bg-red-50 text-red-600 border border-red-100',
    COMPLETED: 'bg-teal-50 text-teal-600 border border-teal-100',
    ABSENT:    'bg-slate-50 text-slate-500 border border-slate-100',
    SUCCESS:   'bg-teal-50 text-teal-600 border border-teal-100',
    FAILED:    'bg-red-50 text-red-600 border border-red-100',
    REFUNDED:  'bg-purple-50 text-purple-600 border border-purple-100',
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'الرئيسية' : 'Dashboard'}>
      <div className="space-y-6">

        {/*Overview Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={lang === 'ar' ? 'إجمالي المرضى' : 'Total Patients'} value={stats?.users?.total?.toLocaleString() ?? '—'} icon={Users} color="blue" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'إجمالي الأطباء' : 'Total Doctors'} value={stats?.doctors?.total?.toLocaleString() ?? '—'} icon={Stethoscope} color="teal" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'إجمالي المواعيد' : 'Total Appointments'} value={stats?.appointments?.total?.toLocaleString() ?? '—'} subtitle={`${lang === 'ar' ? 'اليوم:' : 'Today:'} ${stats?.appointments?.today ?? 0}`} icon={CalendarDays} color="purple" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'} value={formatCurrency(stats?.revenue?.total, lang)} subtitle={`${lang === 'ar' ? 'هذا الشهر:' : 'This month:'} ${formatCurrency(stats?.revenue?.monthly, lang)}`} icon={DollarSign} color="green" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'مكتملة' : 'Completed'} value={stats?.appointments?.completed?.toLocaleString() ?? '—'} icon={CalendarCheck} color="green" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'ملغية' : 'Cancelled'} value={stats?.appointments?.cancelled?.toLocaleString() ?? '—'} subtitle={`${lang === 'ar' ? 'نسبة الإلغاء:' : 'Rate:'} ${stats?.appointments?.cancellationRate ?? '0%'}`} icon={XCircle} color="red" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'قائمة الانتظار' : 'Waiting List'} value={stats?.waitingList?.pending?.toLocaleString() ?? '—'} icon={Clock} color="orange" loading={statsLoading} />
          <StatCard title={lang === 'ar' ? 'إيرادات الشهر' : 'Monthly Revenue'} value={formatCurrency(stats?.revenue?.monthly, lang)} icon={TrendingUp} color="blue" loading={statsLoading} />
        </div>

        {/*Appointments Analytics */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base">{lang === 'ar' ? 'تحليلات المواعيد' : 'Appointments Analytics'}</h3>
            <div className="flex bg-neutralSurface-50 dark:bg-slate-700/50 p-1 rounded-xl border border-neutralSurface-100 dark:border-slate-700">
              {periods.map((p) => (
                <button key={p.value} onClick={() => setChartPeriod(p.value)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${chartPeriod === p.value ? 'bg-white dark:bg-slate-600 text-primary-500 shadow-sm' : 'text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100'}`}>
                  {p.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {aptsChartLoading ? (
            <div className="h-56 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={appointmentsChart?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', fontSize: '13px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fill="#dbeafe" name={lang === 'ar' ? 'الإجمالي' : 'Total'} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fill="#d1fae5" name={lang === 'ar' ? 'مكتملة' : 'Completed'} />
                <Area type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="4 4" name={lang === 'ar' ? 'ملغية' : 'Cancelled'} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/*Revenue & New Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base mb-4">{lang === 'ar' ? 'الإيرادات المالية (آخر 12 شهر)' : 'Revenue Analysis (Last 12 Months)'}</h3>
            {revChartLoading ? (
              <div className="h-56 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={revenueChart?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', fontSize: '13px' }} formatter={(v) => formatCurrency(v, lang)} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                  <Bar dataKey="total" fill="#0d9488" radius={[5, 5, 0, 0]} name={lang === 'ar' ? 'إجمالي المدفوعات' : 'Total Revenue'} />
                  <Bar dataKey="fullyPaid" fill="#10b981" radius={[5, 5, 0, 0]} name={lang === 'ar' ? 'مدفوع بالكامل' : 'Fully Paid'} />
                  <Bar dataKey="partiallyPaid" fill="#3b82f6" radius={[5, 5, 0, 0]} name={lang === 'ar' ? 'مدفوع جزئياً' : 'Partially Paid'} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-sm">{lang === 'ar' ? 'المرضى الجدد' : 'New Patients'}</h3>
              <div className="flex bg-neutralSurface-50 dark:bg-slate-700/50 p-0.5 rounded-lg border border-neutralSurface-100 dark:border-slate-700">
                {periods.map((p) => (
                  <button key={p.value} onClick={() => setUsersPeriod(p.value)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${usersPeriod === p.value ? 'bg-white dark:bg-slate-600 text-primary-500 shadow-xs' : 'text-tertiary-500 dark:text-slate-400 hover:text-tertiary-900 dark:hover:text-slate-100'}`}>
                    {p.label[lang]}
                  </button>
                ))}
              </div>
            </div>
            {usersChartLoading ? (
              <div className="h-44 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={newUsersChart?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="total" stroke="#8b5cf6" fill="#ede9fe" strokeWidth={2} name={lang === 'ar' ? 'المسجلين' : 'Total'} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/*Top Performing Doctors */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
          <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base mb-4">{lang === 'ar' ? 'أفضل الأطباء أداءً' : 'Top Performing Doctors'}</h3>
          {topDoctorsLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutralSurface-50 dark:border-slate-700/50 text-tertiary-400 dark:text-slate-500 font-bold uppercase text-left">
                    <th className={`pb-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'الطبيب' : 'Doctor'}</th>
                    <th className={`pb-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'التخصص' : 'Specialization'}</th>
                    <th className={`pb-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'المواعيد' : 'Appointments'}</th>
                    <th className={`pb-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
                    <th className={`pb-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'سعر الكشف' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutralSurface-50 dark:divide-slate-700/50 font-bold text-tertiary-700 dark:text-slate-300">
                  {(topDoctors?.data || []).map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutralSurface-50/50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-sm">{doc.name?.[0]}</div><span className="font-extrabold text-tertiary-900 dark:text-slate-100">{doc.name}</span></div></td>
                      <td className="py-3.5 text-tertiary-600 dark:text-slate-400">{SPECIALIZATIONS[doc.specialization]?.[lang] || doc.specialization}</td>
                      <td className="py-3.5 text-tertiary-900 dark:text-slate-100 font-black">{doc.appointmentsCount}</td>
                      <td className="py-3.5"><span className="text-amber-500 font-black">★ {doc.ratingsAverage?.toFixed(1) || '0.0'}</span></td>
                      <td className="py-3.5 text-tertiary-900 dark:text-slate-100 font-black">{formatCurrency(doc.consultationPrice, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/*Recent Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base mb-4">{lang === 'ar' ? 'أحدث المواعيد' : 'Recent Appointments'}</h3>
            {recentAptsLoading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />)}</div> : (
              <div className="space-y-3.5">{appointmentsList.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3.5 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl">
                  <div><p className="text-sm font-extrabold text-tertiary-900 dark:text-slate-100">{apt.user?.firstName} {apt.user?.lastName}</p><p className="text-xs text-tertiary-400 dark:text-slate-500">{formatDateTime(apt.appointmentDate, lang)}</p></div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusColors[apt.appointmentStatus] || 'bg-neutralSurface-100'}`}>{APPOINTMENT_STATUS[apt.appointmentStatus]?.[lang] || apt.appointmentStatus}</span>
                </div>
              ))}</div>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-neutralSurface-100 dark:border-slate-700/50 shadow-sm dark:shadow-black/20">
            <h3 className="text-tertiary-900 dark:text-slate-100 font-bold text-base mb-4">{lang === 'ar' ? 'السجل المالي الحديث' : 'Recent Payments Log'}</h3>
            {recentPaymentsLoading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl animate-pulse" />)}</div> : (
              <div className="space-y-3.5">{paymentsList.slice(0, 5).map((pay) => (
                <div key={pay.id} className="flex items-center justify-between p-3.5 bg-neutralSurface-50 dark:bg-slate-700/50 rounded-xl">
                  <div><p className="text-sm font-extrabold text-tertiary-900 dark:text-slate-100">{pay.user?.firstName} {pay.user?.lastName}</p></div>
                  <p className="text-sm font-black dark:text-slate-100">{formatCurrency(pay.billedAmount, lang)}</p>
                </div>
              ))}</div>
            )}
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}

export default Dashboard