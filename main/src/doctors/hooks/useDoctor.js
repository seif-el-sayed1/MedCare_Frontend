import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getDoctorProfile, updateDoctorProfile,
  getMyAppointments, writeDiagnosis,
  getMyRatings,
} from '../api/endpoints/doctor.api.js'

export const useDoctorProfile = () =>
  useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => getDoctorProfile().then((r) => r.data),
  })

export const useUpdateDoctorProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateDoctorProfile,
    onSuccess: (res) => {
      qc.invalidateQueries(['doctor-profile'])
      toast.success(res.data.message || 'Profile updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useMyAppointments = (params) =>
  useQuery({
    queryKey: ['my-appointments', params],
    queryFn: () => getMyAppointments(params).then((r) => r.data),
  })

export const useWriteDiagnosis = (id) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => writeDiagnosis(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries(['my-appointments'])
      toast.success(res.data.message || 'Diagnosis saved successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export const useMyRatings = (params) =>
  useQuery({
    queryKey: ['my-ratings', params],
    queryFn: () => getMyRatings(params).then((r) => r.data),
  })