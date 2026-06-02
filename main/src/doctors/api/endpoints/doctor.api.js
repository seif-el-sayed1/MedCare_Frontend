import api from '../axiosHelper.js'

export const getDoctorProfile    = ()         => api.get('/loggedin-docs/me')
export const updateDoctorProfile = (data)     => api.patch('/loggedin-docs/update', data)
export const getMyAppointments   = (params)   => api.get('/loggedin-docs/appointments', { params })
export const writeDiagnosis      = (id, data) => api.patch(`/loggedin-docs/${id}`, data)
export const getMyRatings = (params) => api.get('/loggedin-docs/ratings', { params })