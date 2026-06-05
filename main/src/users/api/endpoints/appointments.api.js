import api from '../axiosHelper.js'

export const getMyAppointments = (params) => api.get('/users/me/history', { params });
export const getAppointmentById = (id) => api.get(`/appointments/${id}`)
export const cancelAppointment  = (id) => api.patch(`/appointments/${id}/cancel`)
export const makePayment = (id) => api.post(`/appointments/${id}/payment`)
export const generateQR         = (id) => api.get(`/appointments/${id}/qr`)
export const generateReport     = (id) => api.get(`/appointments/${id}/report`, { responseType: 'blob' })
export const bookAppointment    = ({ doctorId, ...data }) => api.post(`/appointments/${doctorId}`, data)
