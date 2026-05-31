import api from '../axiosHelper.js'

export const getAllAppointments = (params) => api.get('/appointments', { params })
export const getOneAppointment = (id) => api.get(`/appointments/${id}`)
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status })
export const updateAppointmentPayment = (id, paidAmount) => api.patch(`/appointments/${id}`, { paidAmount })
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`)
export const scanAppointment = (id) => api.get(`/appointments/${id}/scan`)
export const generateReport     = (id) => api.get(`/appointments/${id}/report`, { responseType: 'blob' })
