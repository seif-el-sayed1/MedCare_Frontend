import api from '../axiosHelper.js'

export const loginAdmin = (data, lang = 'en') =>
  api.post('/admins/auth/login', data, {
    headers: { lang }
  })

export const forgetPassword = (data, lang) =>
  api.post('/admins/auth/forget-password', data, { headers: { lang } })

export const resetPassword = (token, data, lang) =>
  api.patch(`/admins/auth/reset-password/${token}`, data, { headers: { lang } })