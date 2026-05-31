import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  generateReport,
  getAllAppointments, getOneAppointment,
  updateAppointmentStatus, updateAppointmentPayment, deleteAppointment,
} from '../api/endpoints/appointments.api.js'

export const useAppointments = (params) =>
  useQuery({
    queryKey: ['appointments', params],
    queryFn: () => getAllAppointments(params).then((r) => r.data),
  })

export const useAppointment = (id) =>
  useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getOneAppointment(id).then((r) => r.data),
    enabled: !!id,
  })

export const useUpdateAppointmentStatus = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status) => updateAppointmentStatus(id, status),
    onSuccess: (res) => {
      qc.invalidateQueries(['appointments'])
      qc.invalidateQueries(['appointment', id])
      toast.success(res.data.message || 'Status updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useUpdateAppointmentPayment = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (paidAmount) => updateAppointmentPayment(id, paidAmount),
    onSuccess: (res) => {
      qc.invalidateQueries(['appointments'])
      qc.invalidateQueries(['appointment', id])
      toast.success(res.data.message || 'Payment updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useDeleteAppointment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: (res) => {
      qc.invalidateQueries(['appointments'])
      toast.success(res.data.message || 'Appointment deleted')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useGenerateReport = () =>
  useMutation({
    mutationFn: async (id) => {
      const res = await generateReport(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `appointment-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to generate report'
      toast.error(errorMessage)
    },
  })