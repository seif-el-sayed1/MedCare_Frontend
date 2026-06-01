import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import Login from '../pages/auth/Login.jsx'
import Dashboard from '../pages/dashboard/Dashboard.jsx'
import DoctorsList from '../pages/doctors/DoctorsList.jsx'
import AddDoctor from '../pages/doctors/AddDoctor.jsx'
import DoctorDetails from '../pages/doctors/DoctorDetails.jsx'
import UsersList from '../pages/users/UsersList.jsx'
import AppointmentsList from '../pages/appointments/AppointmentsList.jsx'
import AppointmentDetails from '../pages/appointments/AppointmentDetails.jsx'
import NotFound from '../pages/NotFound.jsx'
import AdminsList from '../pages/admins/AdminsList.jsx'
import WaitingList from '../pages/waitingList/WaitingList.jsx'
import Profile from '../pages/profile/Profile.jsx'
import ForgetPassword from '../pages/auth/ForgetPassword.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import QRScanner from '../pages/scanner/QRScanner.jsx'


const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore()
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path="/doctors/add" element={<ProtectedRoute><AddDoctor /></ProtectedRoute>} />
        <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetails /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
        <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetails /></ProtectedRoute>} />
        <Route path="/admins" element={<ProtectedRoute><AdminsList /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/waiting-list" element={<ProtectedRoute><WaitingList /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/scanner" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter