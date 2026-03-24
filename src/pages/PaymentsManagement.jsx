import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Building,
  Users
} from 'lucide-react'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'

const PaymentsManagement = () => {
  const { merchant, isMerchantAuthenticated } = useMerchant()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState(null)

  // Check if user is super admin
  
  if (!isMerchantAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  
  if (merchant?.role !== 'super_admin') {
    return <Navigate to="/auth" replace />
  }

  // Mock payments data
  const payments = [
    {
      id: 'PAY-001',
      type: 'booking',
      amount: 1299,
      commission: 129.90,
      netAmount: 1169.10,
      customer: 'Sarah Ahmed',
      merchant: 'Jumeirah Group',
      venue: 'Burj Al Arab - Al Muntaha',
      event: 'New Year Gala Dinner',
      date: '2024-12-18T14:30:00Z',
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789456123',
      currency: 'AED'
    },
    {
      id: 'PAY-002',
      type: 'refund',
      amount: -449,
      commission: -44.90,
      netAmount: -404.10,
      customer: 'Michael Johnson',
      merchant: 'Atlantis Resort',
      venue: 'Atlantis The Palm - Ossiano',
      event: 'Weekend Brunch Buffet',
      date: '2024-12-17T09:15:00Z',
      status: 'processing',
      paymentMethod: 'Credit Card',
      transactionId: 'REF-456789012',
      currency: 'AED'
    },
    {
      id: 'PAY-003',
      type: 'payout',
      amount: 15420,
      commission: 1542,
      netAmount: 13878,
      merchant: 'Sky Hospitality LLC',
      venue: 'Sky Lounge Dubai',
      date: '2024-12-16T16:45:00Z',
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      transactionId: 'OUT-123456789',
      currency: 'AED'
    },
    {
      id: 'PAY-004',
      type: 'booking',
      amount: 299,
      commission: 29.90,
      netAmount: 269.10,
      customer: 'Fatima Al-Zahra',
      merchant: 'Marina Entertainment',
      venue: 'Marina Sports Bar',
      event: 'Sports Night Experience',
      date: '2024-12-15T20:30:00Z',
      status: 'failed',
      paymentMethod: 'Debit Card',
      transactionId: 'TXN-987654321',
      currency: 'AED'
    }
  ]

  const paymentTypes = ['All', 'Booking', 'Refund', 'Payout']
  const paymentStatuses = ['All', 'Completed', 'Processing', 'Pending', 'Failed']

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus.toLowerCase()
    const matchesType = filterType === 'all' || payment.type === filterType.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return 'bg-green-100 text-green-700'
      case 'refund':
        return 'bg-red-100 text-red-700'
      case 'payout':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatCard = ({ title, value, icon: Icon, color = "primary", subtitle }) => (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-neutral-800 mt-1">{value}</p>
          {subtitle && <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-2xl flex items-center justify-center shadow-soft`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Payments Management</h1>
            <p className="text-neutral-600">Monitor and manage all platform transactions</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Sync Payments</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Volume"
            value="AED 2.8M"
            subtitle="This month"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Commission Earned"
            value="AED 284K"
            subtitle="Platform revenue"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Pending Payouts"
            value="AED 156K"
            subtitle="Awaiting transfer"
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Failed Transactions"
            value="23"
            subtitle="Requires attention"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by payment ID, customer, or merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
              >
                <option value="all">All Types</option>
                {paymentTypes.slice(1).map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
              >
                <option value="all">All Status</option>
                {paymentStatuses.slice(1).map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800">
              Transactions ({filteredPayments.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Payment ID</th>
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Type & Status</th>
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Parties</th>
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-800">{payment.id}</div>
                          <div className="text-sm text-neutral-600">{payment.transactionId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(payment.type)}`}>
                          {payment.type}
                        </span>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`text-lg font-bold ${payment.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {payment.currency} {Math.abs(payment.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-600">
                          Commission: {payment.currency} {Math.abs(payment.commission).toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Net: {payment.currency} {Math.abs(payment.netAmount).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {payment.customer && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Users className="w-3 h-3 text-neutral-500" />
                            <span className="text-neutral-800">{payment.customer}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-sm">
                          <Building className="w-3 h-3 text-neutral-500" />
                          <span className="text-neutral-800">{payment.merchant}</span>
                        </div>
                        {payment.venue && (
                          <div className="text-xs text-neutral-600">{payment.venue}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-neutral-600">
                        {formatDate(payment.date)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {payment.paymentMethod}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {payment.status === 'failed' && (
                          <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-800">Payment Details</h2>
                    <p className="text-neutral-600">{selectedPayment.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="text-neutral-500 hover:text-neutral-700 p-2"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Payment Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${selectedPayment.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedPayment.currency} {Math.abs(selectedPayment.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">Total Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedPayment.currency} {Math.abs(selectedPayment.commission).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">Commission</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-800">
                      {selectedPayment.currency} {Math.abs(selectedPayment.netAmount).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">Net Amount</div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Transaction Details</h3>
                    <div className="space-y-2">
                      <div><strong>Type:</strong> {selectedPayment.type}</div>
                      <div><strong>Status:</strong> {selectedPayment.status}</div>
                      <div><strong>Method:</strong> {selectedPayment.paymentMethod}</div>
                      <div><strong>Transaction ID:</strong> {selectedPayment.transactionId}</div>
                      <div><strong>Date:</strong> {formatDate(selectedPayment.date)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Parties Involved</h3>
                    <div className="space-y-2">
                      {selectedPayment.customer && <div><strong>Customer:</strong> {selectedPayment.customer}</div>}
                      <div><strong>Merchant:</strong> {selectedPayment.merchant}</div>
                      {selectedPayment.venue && <div><strong>Venue:</strong> {selectedPayment.venue}</div>}
                      {selectedPayment.event && <div><strong>Event:</strong> {selectedPayment.event}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}

export default PaymentsManagement

