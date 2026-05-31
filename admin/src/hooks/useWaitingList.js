import { useQuery } from '@tanstack/react-query'
import { getAllWaitingList } from '../api/endpoints/waitingList.api.js'

export const useWaitingList = (params) =>
  useQuery({
    queryKey: ['waiting-list', params],
    queryFn: () => getAllWaitingList(params).then((r) => r.data),
  })