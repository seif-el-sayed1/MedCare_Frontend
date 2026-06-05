import api from '../axiosHelper.js'

export const createRating = ({ doctorId, ...data }) => api.post(`/rates/${doctorId}`, data)
export const updateRating = ({ id, ...data }) => api.patch(`/rates/${id}`, data)
export const deleteRating = (id) => api.delete(`/rates/${id}`)