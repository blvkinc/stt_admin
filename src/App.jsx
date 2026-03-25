import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import { AuthProvider } from '@shared/context/AuthContext'
import { MerchantProvider } from '@shared/context/MerchantContext'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminAuthPage from './pages/AdminAuthPage'
import VenuesManagement from './pages/VenuesManagement'
import VenueDetailPage from './pages/VenueDetailPage'
import CategoriesManagement from './pages/CategoriesManagement'
import PackagesManagement from './pages/PackagesManagement'
import FAQsManagement from './pages/FAQsManagement'
import MerchantsManagement from './pages/MerchantsManagement'
import ApprovalsManagement from './pages/ApprovalsManagement'
import ApprovalQueuePage from './pages/ApprovalQueuePage'
import UsersManagement from './pages/UsersManagement'
import EventsManagement from './pages/EventsManagement'
import PaymentsManagement from './pages/PaymentsManagement'
import SystemSettings from './pages/SystemSettings'
import AnalyticsManagement from './pages/AnalyticsManagement'
import InviteMerchant from './pages/InviteMerchant'
import EditMerchantPage from './pages/EditMerchantPage'
import MerchantCreatePage from './pages/MerchantCreatePage'
import SystemLogsPage from './pages/SystemLogsPage'
import ReportsPage from './pages/ReportsPage'
import AdminProfilePage from './pages/AdminProfilePage'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <MerchantProvider>
            <Router>
              <Routes>
                <Route path="/admin/auth" element={<AdminAuthPage />} />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/admin/venues" element={<VenuesManagement />} />
                <Route path="/admin/venues/:venueId" element={<VenueDetailPage />} />
                <Route path="/admin/merchants" element={<MerchantsManagement />} />
                <Route path="/admin/merchants/invite" element={<InviteMerchant />} />
                <Route path="/admin/merchants/new" element={<MerchantCreatePage />} />
                <Route path="/admin/merchants/:id/edit" element={<EditMerchantPage />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/events" element={<EventsManagement />} />
                <Route path="/admin/packages" element={<PackagesManagement />} />
                <Route path="/admin/categories" element={<CategoriesManagement />} />
                <Route path="/admin/faqs" element={<FAQsManagement />} />
                <Route path="/admin/approvals" element={<ApprovalsManagement />} />
                <Route path="/admin/approvals/queue" element={<ApprovalQueuePage />} />
                <Route path="/admin/payments" element={<PaymentsManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsManagement />} />
                <Route path="/admin/system" element={<SystemSettings />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/logs" element={<SystemLogsPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
              </Routes>
            </Router>
          </MerchantProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
