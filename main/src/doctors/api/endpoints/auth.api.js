import api from '../axiosHelper.js'

export const loginDoctor    = (data, lang)         => api.post('/doctors/auth/login', data, { headers: { lang } })
export const verifyAccount  = (data, token, lang)  => api.post('/doctors/auth/verify-account', data, { headers: { Authorization: `${token}`, lang } })
export const forgetPassword = (data, lang)         => api.post('/doctors/auth/forget-password', data, { headers: { lang } })
export const resetPassword  = (token, data, lang)  => api.patch(`/doctors/auth/reset-password/${token}`, data, { headers: { lang } })
export const changePassword = (data, lang)         => api.patch('/doctors/auth/reset-password', data, { headers: { lang } })