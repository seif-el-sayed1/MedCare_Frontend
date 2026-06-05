// hooks/useDoctors.js
import { useQuery } from '@tanstack/react-query'
import { getAllDoctors, getOneDoctor, getAvailableSlots } from '../api/endpoints/doctors.api.js'
import useUserAuthStore from '../store/authStore.js'

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

export const useAvailableSlots = (doctorId, { date }) => {
  const userId = useUserAuthStore((s) => s.user?.id)

  return useQuery({
    queryKey: ['available-slots', doctorId, date, userId],
    queryFn: () => getAvailableSlots(doctorId, { date }).then((r) => r.data?.data ?? []),
    enabled: !!doctorId && !!date,
    staleTime: 0,       
    gcTime: 0,           
  })
}