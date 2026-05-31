import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../api/endpoints/dashboard.api.js'

export const useUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => getAllUsers(params).then((r) => r.data),
  })