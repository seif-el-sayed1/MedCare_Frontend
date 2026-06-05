import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createRating, updateRating, deleteRating } from '../api/endpoints/rating.api.js'

export const useCreateRating = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createRating,
    onSuccess: (res, { doctorId }) => {
      qc.invalidateQueries(['doctor', doctorId])
      toast.success(res.data?.message || 'Rating submitted!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useUpdateRating = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateRating,
    onSuccess: (res, { doctorId }) => {
      qc.invalidateQueries(['doctor', doctorId])
      toast.success(res.data?.message || 'Rating updated!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useDeleteRating = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (res, _id, ctx) => {
      qc.invalidateQueries(['doctor'])
      toast.success(res.data?.message || 'Rating deleted!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}