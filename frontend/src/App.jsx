import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DiscoverPage from './pages/DiscoverPage'
import BlueprintPage from './pages/BlueprintPage'
import SuccessPage from './pages/SuccessPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import InquiryDetailPage from './pages/admin/InquiryDetailPage'
import DemoAdminPage from './pages/admin/DemoAdminPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/blueprint" element={<BlueprintPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/inquiries/:id" element={<ProtectedRoute><InquiryDetailPage /></ProtectedRoute>} />
        <Route path="/demo/admin" element={<DemoAdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
