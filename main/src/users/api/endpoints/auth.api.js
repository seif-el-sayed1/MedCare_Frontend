import api from '../axiosHelper.js'

export const registerUser = (data) => api.post('/users/auth/register', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const loginUser    = (data, lang) => api.post('/users/auth/login', data, { headers: { lang } })
export const verifyOtp    = (data)       => api.post('/users/auth/verify-otp', data)
export const sendOtp      = (data)       => api.post('/users/auth/send-otp', data)
export const changePassword = (data, lang) => api.patch('/users/auth/change-password', data, { headers: { lang } })