import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getMyAppointments, getAppointmentById,
  cancelAppointment, makePayment,
  generateQR, generateReport, bookAppointment,
} from '../api/endpoints/appointments.api.js'

export const useMyAppointments = (userId, params) =>
  useQuery({
    queryKey: ['my-appointments', userId, params], 
    queryFn: () => getMyAppointments(userId, params).then((r) => r.data),
    enabled: !!userId,
  })

export const useAppointmentById = (id) =>
  useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id).then((r) => r.data),
    enabled: !!id,
  })

export const useGenerateQR = (id) =>
  useQuery({
    queryKey: ['qr', id],
    queryFn: () => generateQR(id).then((r) => r.data),
    enabled: !!id,
  })

export const useBookAppointment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (variables) => bookAppointment(variables),
    onSuccess: (res) => {
      qc.invalidateQueries(['my-appointments'])
      qc.invalidateQueries(['available-slots'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useCancelAppointment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (res) => {
      qc.invalidateQueries(['my-appointments'])
      toast.success(res.data.message || 'Appointment cancelled')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useMakePayment = () => { 
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => makePayment(id), 
    onSuccess: (res, id) => { 
      qc.invalidateQueries(['my-appointments'])
      qc.invalidateQueries(['appointment', id])
      
      if (res.data?.data?.paymentKey) {
         window.location.href = res.data.data.paymentKey;
      } else {
         toast.success(res.data.message || 'Payment key generated')
      }
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
    onError: (err) => toast.error('Failed to generate report'),
  })