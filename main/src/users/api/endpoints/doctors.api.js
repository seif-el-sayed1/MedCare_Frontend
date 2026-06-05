import api from '../axiosHelper.js'

export const getAllDoctors     = (params) => api.get('/doctors', { params })
export const getOneDoctor     = (id)     => api.get(`/doctors/${id}`)
export const getAvailableSlots = (id, params) => api.get(`/doctors/${id}/available-slots`, { params })