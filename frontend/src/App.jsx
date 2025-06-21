import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import AdminDashboard from './Admin/AdminDashboard'
import Aboutus from './Pages/Aboutus'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import OTP_Verification from './Pages/OTP_Verification'
import AdminLogin from './Admin/AdminLogin'
import Members from './Admin/Members'
import Events from './Pages/Events'
import UpcomingEvents from './Admin/Events'
import Contact from './Pages/Contact'
import Gallary from './Pages/Gallary'
import ManagementTeams from './Pages/ManagementTeams'
import Dashboard from './Pages/Dashboard'
import ProtectedUser from './ProtectedRoute/ProtectedUser'
import Logout from './Pages/Logout'
import ManagementTeam from './Admin/ManagementTeam'
import Inquiry from './Admin/Inquiry'
import EventGalleryApp from './Admin/Gallery'
import AdminAdvertisement from './Admin/AdminAdvertisement'
import EventMembers from './Admin/EventMembers'
import Donation from './Admin/Donation'
import ProtectedAdmin from './ProtectedRoute/ProtectedAdmin'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import Meetings from './Admin/Meetings'
import UserMeetings from './Pages/Meetings'
import Announcements from './Admin/Announcements'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<OTP_Verification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedUser><Homepage /></ProtectedUser>} />
        <Route path="/about" element={<ProtectedUser><Aboutus /></ProtectedUser>} />
        <Route path="/events" element={<ProtectedUser><Events /></ProtectedUser>} />
        <Route path="/contact" element={<ProtectedUser><Contact /></ProtectedUser>} />
        <Route path="/gallery" element={<ProtectedUser><Gallary /></ProtectedUser>} />
        <Route path="/management-teams" element={<ProtectedUser><ManagementTeams /></ProtectedUser>} />
        <Route path="/meetings" element={<ProtectedUser><UserMeetings /></ProtectedUser>} />
        <Route path="/dashboard" element={<ProtectedUser><Dashboard /></ProtectedUser>} />

        {/* Admin Route  */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
        <Route path="/admin/members" element={<ProtectedAdmin><Members /></ProtectedAdmin>} />
        <Route path="/admin/events" element={<ProtectedAdmin><UpcomingEvents /></ProtectedAdmin>} />
        <Route path="/admin/management-team" element={<ProtectedAdmin><ManagementTeam /></ProtectedAdmin>} />
        <Route path="/admin/inquiry" element={<ProtectedAdmin><Inquiry /></ProtectedAdmin>} />
        <Route path="/admin/gallery" element={<ProtectedAdmin><EventGalleryApp /></ProtectedAdmin>} />
        <Route path="/admin/advertisement" element={<ProtectedAdmin><AdminAdvertisement /></ProtectedAdmin>} />
        <Route path="/admin/event-members" element={<ProtectedAdmin><EventMembers /></ProtectedAdmin>} />
        <Route path="/admin/donation" element={<ProtectedAdmin><Donation /></ProtectedAdmin>} />
        <Route path="/admin/meetings" element={<ProtectedAdmin><Meetings /></ProtectedAdmin>} />
        <Route path="/admin/announcements" element={<ProtectedAdmin><Announcements /></ProtectedAdmin>} />


      </Routes>
    </>
  )
}

export default App
