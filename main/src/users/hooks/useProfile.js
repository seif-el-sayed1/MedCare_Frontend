import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getMyProfile, updateMyProfile, changePassword } from '../api/endpoints/user.api.js'

export const useMyProfile = () =>
  useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getMyProfile().then((r) => r.data),
  })

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (res) => {
      qc.invalidateQueries(['user-profile'])
      toast.success(res.data.message || 'Profile updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => toast.success(res.data.message || 'Password changed successfully'),
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })