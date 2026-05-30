import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  admin: JSON.parse(localStorage.getItem('admin')) || null,

  setAuth: (token, admin) => {
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(admin))
    set({ token, admin })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    set({ token: null, admin: null })
  },
}))

export default useAuthStore