import api from '../axiosHelper.js'

export const getAllDoctors = (params) => api.get('/doctors', { params })
export const getOneDoctor = (id) => api.get(`/doctors/${id}`)
export const addDoctor = (data) => api.post('/doctors', data)
export const updateDoctor = (id, data) => api.patch(`/doctors/${id}`, data)
export const toggleDelete = (id) => api.patch(`/doctors/${id}/delete`)
export const addWorkingHours = (id, data) => api.post(`/doctors/${id}`, data)
export const updateWorkingHours = (id, whId, data) => api.patch(`/doctors/${id}/working-hours/${whId}`, data)
export const deleteWorkingHours = (id, whId) => api.delete(`/doctors/${id}/working-hours/${whId}`)
export const addLeave = (id, data) => api.patch(`/doctors/${id}/leaves`, data)
export const cancelLeave = (id, data) => api.patch(`/doctors/${id}/leaves-cancel`, data)