import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  CreditCard, 
  Users, 
  Building,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'

const SystemSettings = () => {
  const { merchant, isMerchantAuthenticated } = useMerchant()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Check if user is super admin
  
  if (!isMerchantAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  
  if (merchant?.role !== 'super_admin') {
    return <Navigate to="/auth" replace />
  }

  const [settings, setSettings] = useState({
    general: {
      platformName: 'Set The Table',
      platformDescription: 'Dubai\'s Premier Dining Experience Platform',
      supportEmail: 'support@setthetable.ae',
      adminEmail: 'admin@setthetable.ae',
      timezone: 'Asia/Dubai',
      currency: 'AED',
      language: 'en'
    },
    payments: {
      commissionMode: 'percentage',
      commissionRate: 10,
      flatCommission: 25,
      payoutSchedule: 'weekly',
      minimumPayout: 100,
      paymentMethods: ['credit_card', 'debit_card', 'bank_transfer'],
      autoApprovePayouts: false,
      refundPolicy: 24
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      merchantNotifications: true,
      customerNotifications: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      ipWhitelist: '',
      auditLogging: true,
      dataRetention: 365
    },
    features: {
      merchantRegistration: true,
      customerReviews: true,
      loyaltyProgram: false,
      promotionalCodes: true,
      analyticsTracking: true,
      mobileApp: false
    }
  })

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleSave = async (category) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(`${category} settings saved successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'features', label: 'Features', icon: Globe },
    { id: 'database', label: 'Database', icon: Database }
  ]

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">System Settings</h1>
            <p className="text-neutral-600">Configure platform settings and preferences</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Config</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Import Config</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Settings Interface */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
          <div className="border-b border-neutral-100">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-neutral-800">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={settings.general.platformName}
                      onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    >
                      <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Default Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    >
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Platform Description</label>
                  <textarea
                    value={settings.general.platformDescription}
                    onChange={(e) => handleSettingChange('general', 'platformDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none resize-none"
                  />
                </div>
                
                <button
                  onClick={() => handleSave('general')}
                  disabled={loading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save General Settings'}</span>
                </button>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-neutral-800">Payment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Commission Model</label>
                    <select
                      value={settings.payments.commissionMode}
                      onChange={(e) => handleSettingChange('payments', 'commissionMode', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.payments.commissionRate}
                      onChange={(e) => handleSettingChange('payments', 'commissionRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Flat Commission (AED)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.payments.flatCommission}
                      onChange={(e) => handleSettingChange('payments', 'flatCommission', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Payout Schedule</label>
                    <select
                      value={settings.payments.payoutSchedule}
                      onChange={(e) => handleSettingChange('payments', 'payoutSchedule', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Minimum Payout (AED)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.payments.minimumPayout}
                      onChange={(e) => handleSettingChange('payments', 'minimumPayout', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Refund Policy (hours)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.payments.refundPolicy}
                      onChange={(e) => handleSettingChange('payments', 'refundPolicy', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.payments.autoApprovePayouts}
                      onChange={(e) => handleSettingChange('payments', 'autoApprovePayouts', e.target.checked)}
                      className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-neutral-700">Auto-approve payouts under minimum threshold</span>
                  </label>
                </div>
                
                <button
                  onClick={() => handleSave('payments')}
                  disabled={loading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Payment Settings'}</span>
                </button>
              </div>
            )}

            {/* Database Management */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-neutral-800">Database Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Database className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Database Backup</h4>
                        <p className="text-blue-600 text-sm">Create a full system backup</p>
                      </div>
                    </div>
                    <button className="btn-primary bg-blue-600 hover:bg-blue-700 w-full">
                      Create Backup
                    </button>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <RefreshCw className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">System Maintenance</h4>
                        <p className="text-green-600 text-sm">Optimize database performance</p>
                      </div>
                    </div>
                    <button className="btn-primary bg-green-600 hover:bg-green-700 w-full">
                      Run Maintenance
                    </button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Danger Zone</h4>
                      <p className="text-yellow-600 text-sm">Irreversible actions that affect the entire platform</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 w-full">
                      Reset All Analytics Data
                    </button>
                    <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 w-full">
                      Purge Old Logs (90+ days)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default SystemSettings

