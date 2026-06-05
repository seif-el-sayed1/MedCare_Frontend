import api from '../axiosHelper.js'

export const getMyNotifications      = (params) => api.get('/notifications/me', { params })
export const markNotificationSeen    = (id)     => api.patch(`/notifications/mark/${id}/seen`)
export const markAllNotificationsSeen = ()      => api.patch('/notifications/mark/all/seen')
