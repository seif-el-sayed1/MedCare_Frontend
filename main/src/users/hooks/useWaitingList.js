import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getMyWaitingList, addToWaitingList, removeFromWaitingList,
} from '../api/endpoints/waitingList.api.js'

export const useMyWaitingList = (params) =>
  useQuery({
    queryKey: ['my-waiting-list', params],
    queryFn: () => getMyWaitingList(params).then((r) => r.data),
  })

export const useAddToWaitingList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addToWaitingList,
    onSuccess: (res) => {
      qc.invalidateQueries(['my-waiting-list'])
      toast.success(res.data.message || 'Added to waiting list')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useRemoveFromWaitingList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeFromWaitingList,
    onSuccess: (res) => {
      qc.invalidateQueries(['my-waiting-list'])
      toast.success(res.data.message || 'Removed from waiting list')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}