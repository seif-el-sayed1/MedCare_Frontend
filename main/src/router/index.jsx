import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useUserAuthStore from '../users/store/authStore.js'
import useDoctorAuthStore from '../doctors/store/authStore.js'
import Login from '../pages/Login.jsx'
import NotFound from '../pages/NotFound.jsx'

// User pages
import Home from '../users/pages/Home.jsx'
import DoctorProfile from '../users/pages/DoctorProfile.jsx'
import Appointments from '../users/pages/Appointments.jsx'
import AppointmentDetails from '../users/pages/AppointmentDetails.jsx'
import WaitingList from '../users/pages/WaitingList.jsx'
import UserProfile from '../users/pages/Profile.jsx'

// Doctor pages
import DoctorDashboard from '../doctors/pages/dashboard/Dashboard.jsx'
import DoctorVerifyAccount from '../doctors/pages/auth/VerifyAccount.jsx'
import DoctorForgetPassword from '../doctors/pages/auth/ForgetPassword.jsx'
import DoctorResetPassword from '../doctors/pages/auth/ResetPassword.jsx'
import AppointmentsList from '../doctors/pages/appointments/AppointmentsList.jsx'
import DoctorAppointmentDetails from '../doctors/pages/appointments/AppointmentDetails.jsx'
import Profile from '../doctors/pages/profile/Profile.jsx'
import Ratings from '../doctors/pages/ratings/Ratings.jsx'

// User auth pages
import Register from '../users/pages/auth/Register.jsx'
import VerifyOtp from '../users/pages/auth/VerifyOtp.jsx'

// Payment pages
import PaymentSuccess from '../users/pages/PaymentSuccess.jsx'

const UserProtectedRoute = ({ children }) => {
  const { token } = useUserAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

const DoctorProtectedRoute = ({ children }) => {
  const { token } = useDoctorAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { token: userToken } = useUserAuthStore()
  const { token: doctorToken } = useDoctorAuthStore()
  if (userToken) return <Navigate to="/home" replace />
  if (doctorToken) return <Navigate to="/doctor/dashboard" replace />
  return children
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Doctor Auth */}
        <Route path="/doctor/verify-account/:token" element={<DoctorVerifyAccount />} />
        <Route path="/doctor/forget-password" element={<PublicRoute><DoctorForgetPassword /></PublicRoute>} />
        <Route path="/doctor/reset-password/:token" element={<PublicRoute><DoctorResetPassword /></PublicRoute>} />

        {/* User Routes */}
        <Route path="/home" element={<UserProtectedRoute><Home /></UserProtectedRoute>} />
        <Route path="/doctors/:id" element={<UserProtectedRoute><DoctorProfile /></UserProtectedRoute>} />
        <Route path="/appointments" element={<UserProtectedRoute><Appointments /></UserProtectedRoute>} />
        <Route path="/appointments/:id" element={<UserProtectedRoute><AppointmentDetails /></UserProtectedRoute>} />
        <Route path="/waiting-list" element={<UserProtectedRoute><WaitingList /></UserProtectedRoute>} />
        <Route path="/profile" element={<UserProtectedRoute><UserProfile /></UserProtectedRoute>} />
        <Route path="/payment/success" element={<UserProtectedRoute><PaymentSuccess /></UserProtectedRoute>} />
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>} />
        <Route path='/doctor/appointments' element={<DoctorProtectedRoute><AppointmentsList /></DoctorProtectedRoute>} />
        <Route path='/doctor/appointments/:id' element={<DoctorProtectedRoute><DoctorAppointmentDetails /></DoctorProtectedRoute>} />
        <Route path="/doctor/profile" element={<DoctorProtectedRoute><Profile /></DoctorProtectedRoute>} />
        <Route path="/doctor/ratings" element={<DoctorProtectedRoute><Ratings /></DoctorProtectedRoute>} />
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter