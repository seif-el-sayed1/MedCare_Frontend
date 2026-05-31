import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getAllAdmins, addAdmin, updateAdmin, deleteAdmin } from '../api/endpoints/admins.api.js'

export const useAdmins = (params) =>
  useQuery({
    queryKey: ['admins', params],
    queryFn: () => getAllAdmins(params).then((r) => r.data),
  })

export const useAddAdmin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addAdmin,
    onSuccess: (res) => {
      qc.invalidateQueries(['admins'])
      toast.success(res.data.message || 'Admin added successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useUpdateAdmin = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateAdmin(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['admins'])
      toast.success(res.data.message || 'Admin updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useDeleteAdmin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (res) => {
      qc.invalidateQueries(['admins'])
      toast.success(res.data.message || 'Admin deleted successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}