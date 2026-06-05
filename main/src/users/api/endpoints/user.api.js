import api from '../axiosHelper.js'

export const getMyProfile    = ()     => api.get('/users/me')
export const updateMyProfile = (data) => api.patch('/users/me', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const changePassword  = (data) => api.patch('/users/auth/change-password', data)