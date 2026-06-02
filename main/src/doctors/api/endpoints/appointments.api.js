import api from '../axiosHelper.js'

export const generateReport     = (id) => api.get(`/appointments/${id}/report`, { responseType: 'blob' })
