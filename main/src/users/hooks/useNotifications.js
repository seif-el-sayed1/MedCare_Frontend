import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getMyNotifications,
  markNotificationSeen,
  markAllNotificationsSeen,
} from '../api/endpoints/notifications.api.js'

export const useNotifications = (params) =>
  useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getMyNotifications(params).then((r) => r.data),
    refetchInterval: 60000,
  })

export const useMarkNotificationSeen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationSeen,
    onSuccess: () => {
      qc.invalidateQueries(['notifications'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useMarkAllNotificationsSeen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsSeen,
    onSuccess: (res) => {
      qc.invalidateQueries(['notifications'])
      toast.success(res.data.message || 'All notifications marked as seen')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}
