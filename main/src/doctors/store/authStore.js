import { create } from 'zustand'

const useDoctorAuthStore = create((set) => ({
  token: localStorage.getItem('doctor_token') || null,
  doctor: JSON.parse(localStorage.getItem('doctor')) || null,

  setAuth: (token, doctor) => {
    localStorage.setItem('doctor_token', token)
    localStorage.setItem('doctor', JSON.stringify(doctor))
    set({ token, doctor })
  },

  logout: () => {
    localStorage.removeItem('doctor_token')
    localStorage.removeItem('doctor')
    set({ token: null, doctor: null })
  },
}))

export default useDoctorAuthStore