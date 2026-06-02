import {  useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  generateReport
} from '../api/endpoints/appointments.api.js'

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
    onError: () => toast.error('Failed to generate report'),
  })