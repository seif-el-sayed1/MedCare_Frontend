import { useQuery } from '@tanstack/react-query'
import {
  getOverviewStats,
  getAppointmentsChart,
  getRevenueChart,
  getTopDoctors,
  getSpecializationsChart,
  getPaymentsStatusChart,
  getNewUsersChart,
  getRecentAppointments,
  getRecentPayments,
   getAllUsers
} from '../api/endpoints/dashboard.api.js'

export const useOverviewStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getOverviewStats().then((r) => r.data),
  })

export const useAppointmentsChart = (period = 'monthly') =>
  useQuery({
    queryKey: ['appointments-chart', period],
    queryFn: () => getAppointmentsChart({ period }).then((r) => r.data),
  })

export const useRevenueChart = (period = 'monthly') =>
  useQuery({
    queryKey: ['revenue-chart', period],
    queryFn: () => getRevenueChart({ period }).then((r) => r.data),
  })

export const useTopDoctors = () =>
  useQuery({
    queryKey: ['top-doctors'],
    queryFn: () => getTopDoctors().then((r) => r.data),
  })

export const useSpecializationsChart = () =>
  useQuery({
    queryKey: ['specializations-chart'],
    queryFn: () => getSpecializationsChart().then((r) => r.data),
  })

export const usePaymentsStatusChart = () =>
  useQuery({
    queryKey: ['payments-status-chart'],
    queryFn: () => getPaymentsStatusChart().then((r) => r.data),
  })

export const useNewUsersChart = (period = 'monthly') =>
  useQuery({
    queryKey: ['new-users-chart', period],
    queryFn: () => getNewUsersChart({ period }).then((r) => r.data),
  })

export const useRecentAppointments = () =>
  useQuery({
    queryKey: ['recent-appointments'],
    queryFn: () => getRecentAppointments().then((r) => r.data),
  })

export const useRecentPayments = () =>
  useQuery({
    queryKey: ['recent-payments'],
    queryFn: () => getRecentPayments().then((r) => r.data),
  })


export const useAllUsers = (params) =>
  useQuery({
    queryKey: ['dashboard-users', params], 
    queryFn: () => getAllUsers(params).then((r) => r.data),
  })