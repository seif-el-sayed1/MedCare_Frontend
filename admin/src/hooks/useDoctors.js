import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getAllDoctors, getOneDoctor, addDoctor,
  updateDoctor, toggleDelete,
  addWorkingHours, updateWorkingHours, deleteWorkingHours,
  addLeave, cancelLeave,
} from '../api/endpoints/doctors.api.js'

export const useDoctors = (params) =>
  useQuery({
    queryKey: ['doctors', params],
    queryFn: () => getAllDoctors(params).then((r) => r.data),
  })

export const useDoctor = (id) =>
  useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getOneDoctor(id).then((r) => r.data),
    enabled: !!id,
  })

export const useAddDoctor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addDoctor,
    onSuccess: (res) => {
      qc.invalidateQueries(['doctors'])
      toast.success(res.data.message || 'Doctor added successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useUpdateDoctor = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateDoctor(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctors'])
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Doctor updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useToggleDelete = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleDelete,
    onSuccess: (res) => {
      qc.invalidateQueries(['doctors'])
      toast.success(res.data.message)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useAddWorkingHours = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => addWorkingHours(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Working hours added')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useUpdateWorkingHours = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ whId, data }) => updateWorkingHours(id, whId, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Working hours updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useDeleteWorkingHours = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (whId) => deleteWorkingHours(id, whId),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Working hours deleted')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useAddLeave = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => addLeave(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Leave added')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useCancelLeave = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => cancelLeave(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor', id])
      toast.success(res.data.message || 'Leave cancelled')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}