import api from '../axiosHelper.js'

export const getOverviewStats = () => api.get('/dashboard/stats')
export const getAppointmentsChart = (params) => api.get('/dashboard/appointments-chart', { params })
export const getRevenueChart = (params) => api.get('/dashboard/revenue-chart', { params })
export const getTopDoctors = () => api.get('/dashboard/top-doctors')
export const getSpecializationsChart = () => api.get('/dashboard/specializations-chart')
export const getPaymentsStatusChart = () => api.get('/dashboard/payments-status-chart')
export const getNewUsersChart = (params) => api.get('/dashboard/new-users-chart', { params })
export const getRecentAppointments = () => api.get('/dashboard/recent-appointments')
export const getRecentPayments = () => api.get('/dashboard/recent-payments')
export const getAllUsers = (params) => api.get('/dashboard/users', { params })