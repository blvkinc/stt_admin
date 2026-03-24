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
                <Route path="/auth" element={<AdminAuthPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/venues" element={<VenuesManagement />} />
                <Route path="/venues/:venueId" element={<VenueDetailPage />} />
                <Route path="/merchants" element={<MerchantsManagement />} />
                <Route path="/merchants/invite" element={<InviteMerchant />} />
                <Route path="/merchants/new" element={<MerchantCreatePage />} />
                <Route path="/merchants/:id/edit" element={<EditMerchantPage />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/events" element={<EventsManagement />} />
                <Route path="/packages" element={<PackagesManagement />} />
                <Route path="/categories" element={<CategoriesManagement />} />
                <Route path="/faqs" element={<FAQsManagement />} />
                <Route path="/approvals" element={<ApprovalsManagement />} />
                <Route path="/approvals/queue" element={<ApprovalQueuePage />} />
                <Route path="/payments" element={<PaymentsManagement />} />
                <Route path="/analytics" element={<AnalyticsManagement />} />
                <Route path="/system" element={<SystemSettings />} />
                <Route path="/settings" element={<SystemSettings />} />
                <Route path="/logs" element={<SystemLogsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/profile" element={<AdminProfilePage />} />
              </Routes>
            </Router>
          </MerchantProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
