import api from '../axiosHelper.js'

export const getAllWaitingList = (params) => api.get('/wating-list', { params })