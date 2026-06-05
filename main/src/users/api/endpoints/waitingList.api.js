import api from '../axiosHelper.js'

export const getMyWaitingList    = (params) => api.get('/users/me/waiting-list', { params })
export const addToWaitingList    = (data)   => api.post('/wating-list', data)
export const removeFromWaitingList = (id)   => api.delete(`/wating-list/${id}`)