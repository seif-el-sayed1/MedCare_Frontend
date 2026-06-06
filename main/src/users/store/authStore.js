import { create } from 'zustand'

const useUserAuthStore = create((set) => ({
  token: localStorage.getItem('user_token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  setAuth: (token, user) => {
    const actualToken = token || user?.token
    const userData = { ...user }
    delete userData.token
    delete userData.tokenExpDate
    localStorage.setItem('user_token', actualToken)
    localStorage.setItem('user', JSON.stringify(userData))
    set({ token: actualToken, user: userData })
  },

  logout: (queryClient) => {          
    localStorage.removeItem('user_token')
    localStorage.removeItem('user')
    if (queryClient) queryClient.clear()
    set({ token: null, user: null })
  },
}))

export default useUserAuthStore