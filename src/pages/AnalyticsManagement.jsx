import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Building,
  Star,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'

const AnalyticsManagement = () => {
  const { merchant, isMerchantAuthenticated } = useMerchant()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Check if user is super admin
  
  if (!isMerchantAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  
  if (merchant?.role !== 'super_admin') {
    return <Navigate to="/auth" replace />
  }

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 2847392,
      totalBookings: 5678,
      totalCustomers: 12847,
      totalVenues: 156,
      averageOrderValue: 287,
      conversionRate: 14.2,
      customerRetention: 68.5,
      merchantSatisfaction: 4.7
    },
    growth: {
      revenue: 18.9,
      bookings: 12.5,
      customers: 23.7,
      venues: 8.3
    },
    topVenues: [
      { name: 'Burj Al Arab - Al Muntaha', revenue: 145670, bookings: 89, rating: 4.9 },
      { name: 'Atlantis The Palm - Ossiano', revenue: 132450, bookings: 76, rating: 4.8 },
      { name: 'Four Seasons - Al Hadheerah', revenue: 98320, bookings: 124, rating: 4.7 },
      { name: 'Sky Lounge Dubai', revenue: 87650, bookings: 156, rating: 4.6 },
      { name: 'Marina Sports Bar', revenue: 65430, bookings: 234, rating: 4.4 }
    ],
    topMerchants: [
      { name: 'Jumeirah Group', venues: 8, revenue: 456789, bookings: 234 },
      { name: 'Atlantis Resort', venues: 5, revenue: 345678, bookings: 189 },
      { name: 'Four Seasons Hotels', venues: 3, revenue: 234567, bookings: 145 },
      { name: 'Sky Hospitality LLC', venues: 2, revenue: 123456, bookings: 98 }
    ],
    revenueByCategory: [
      { category: 'Fine Dining', revenue: 1245670, percentage: 43.7 },
      { category: 'Casual Dining', revenue: 856430, percentage: 30.1 },
      { category: 'Rooftop Bars', revenue: 456780, percentage: 16.0 },
      { category: 'Beach Clubs', revenue: 288512, percentage: 10.2 }
    ],
    monthlyTrends: [
      { month: 'Jan', revenue: 234567, bookings: 456, customers: 1234 },
      { month: 'Feb', revenue: 267890, bookings: 523, customers: 1456 },
      { month: 'Mar', revenue: 298765, bookings: 598, customers: 1678 },
      { month: 'Apr', revenue: 345678, bookings: 678, customers: 1890 },
      { month: 'May', revenue: 389012, bookings: 734, customers: 2012 },
      { month: 'Jun', revenue: 423456, bookings: 812, customers: 2234 }
    ]
  }

  const MetricCard = ({ title, value, change, icon: Icon, color = "primary", subtitle }) => (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-soft-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-neutral-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-neutral-800 mt-2">{value}</p>
          {subtitle && <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>}
          {change && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-neutral-500 text-sm ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-2xl flex items-center justify-center shadow-soft`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">Analytics Dashboard</h1>
            <p className="text-neutral-600 text-lg">Platform performance insights and metrics</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            <button className="btn-primary bg-red-600 hover:bg-red-700 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`AED ${(analytics.overview.totalRevenue / 1000000).toFixed(1)}M`}
            change={analytics.growth.revenue}
            icon={DollarSign}
            color="green"
          />
          <MetricCard
            title="Total Bookings"
            value={analytics.overview.totalBookings.toLocaleString()}
            change={analytics.growth.bookings}
            icon={Calendar}
            color="blue"
          />
          <MetricCard
            title="Active Customers"
            value={`${(analytics.overview.totalCustomers / 1000).toFixed(1)}K`}
            change={analytics.growth.customers}
            icon={Users}
            color="purple"
          />
          <MetricCard
            title="Partner Venues"
            value={analytics.overview.totalVenues}
            change={analytics.growth.venues}
            icon={Building}
            color="orange"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Avg Order Value"
            value={`AED ${analytics.overview.averageOrderValue}`}
            change={5.2}
            icon={TrendingUp}
            color="indigo"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analytics.overview.conversionRate}%`}
            change={2.1}
            icon={BarChart3}
            color="pink"
          />
          <MetricCard
            title="Customer Retention"
            value={`${analytics.overview.customerRetention}%`}
            change={-1.3}
            icon={Users}
            color="teal"
          />
          <MetricCard
            title="Merchant Rating"
            value={analytics.overview.merchantSatisfaction}
            change={0.2}
            icon={Star}
            color="yellow"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue by Category */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-800">Revenue by Category</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.revenueByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-blue-400 to-blue-600' :
                        index === 1 ? 'from-green-400 to-green-600' :
                        index === 2 ? 'from-purple-400 to-purple-600' :
                        'from-orange-400 to-orange-600'
                      }`}></div>
                      <span className="font-medium text-neutral-800">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-neutral-800">AED {(item.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-neutral-600">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performing Venues */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-800">Top Performing Venues</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.topVenues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">{venue.name}</div>
                        <div className="text-sm text-neutral-600">{venue.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">AED {(venue.revenue / 1000).toFixed(0)}K</div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-neutral-600">{venue.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-800">Monthly Trends</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === 'revenue' ? 'bg-red-100 text-red-700' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('bookings')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === 'bookings' ? 'bg-red-100 text-red-700' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setSelectedMetric('customers')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === 'customers' ? 'bg-red-100 text-red-700' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Customers
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 font-medium text-neutral-600">Month</th>
                    <th className="text-right py-3 font-medium text-neutral-600">Revenue</th>
                    <th className="text-right py-3 font-medium text-neutral-600">Bookings</th>
                    <th className="text-right py-3 font-medium text-neutral-600">New Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyTrends.map((month, index) => (
                    <tr key={index} className="border-b border-neutral-100">
                      <td className="py-3 font-medium text-neutral-800">{month.month}</td>
                      <td className="py-3 text-right font-medium text-green-600">
                        AED {(month.revenue / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-right text-neutral-800">{month.bookings}</td>
                      <td className="py-3 text-right text-neutral-800">{month.customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800">Top Merchant Partners</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-6 font-medium text-neutral-600">Merchant</th>
                  <th className="text-right py-4 px-6 font-medium text-neutral-600">Venues</th>
                  <th className="text-right py-4 px-6 font-medium text-neutral-600">Revenue</th>
                  <th className="text-right py-4 px-6 font-medium text-neutral-600">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topMerchants.map((merchant, index) => (
                  <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-neutral-800">{merchant.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-800">{merchant.venues}</td>
                    <td className="py-4 px-6 text-right font-medium text-green-600">
                      AED {(merchant.revenue / 1000).toFixed(0)}K
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-800">{merchant.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default AnalyticsManagement

