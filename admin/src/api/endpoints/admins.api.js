import api from '../axiosHelper.js'

export const getAllAdmins = (params) => api.get('/admins', { params })
export const getOneAdmin  = (id)     => api.get(`/admins/${id}`)
export const addAdmin     = (data)   => api.post('/admins', data)
export const updateAdmin  = (id, data) => api.patch(`/admins/${id}`, data)
export const deleteAdmin  = (id)     => api.delete(`/admins/${id}`)

export const getAdminProfile = () => api.get('/admins/profile')
export const changePassword  = (data) => api.patch('/admins/auth/reset-password', data)