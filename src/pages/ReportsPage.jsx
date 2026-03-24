import React, { useState, useEffect } from 'react'
import SuperAdminLayout from '../components/SuperAdminLayout'

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [filters, setFilters] = useState({
    venue: 'all',
    merchant: 'all',
    category: 'all'
  })

  // Available report types
  const reportTypes = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Detailed revenue breakdown by venue, merchant, and time period',
      icon: '💰',
      category: 'Financial'
    },
    {
      id: 'bookings',
      name: 'Bookings Report',
      description: 'Booking statistics, conversion rates, and trends',
      icon: '📅',
      category: 'Operations'
    },
    {
      id: 'users',
      name: 'User Activity Report',
      description: 'User registration, activity, and engagement metrics',
      icon: '👥',
      category: 'Users'
    },
    {
      id: 'venues',
      name: 'Venue Performance Report',
      description: 'Venue utilization, ratings, and performance metrics',
      icon: '🏢',
      category: 'Venues'
    },
    {
      id: 'merchants',
      name: 'Merchant Performance Report',
      description: 'Merchant activity, revenue, and customer satisfaction',
      icon: '🏪',
      category: 'Merchants'
    },
    {
      id: 'events',
      name: 'Events Report',
      description: 'Event success rates, attendance, and category analysis',
      icon: '🎉',
      category: 'Events'
    },
    {
      id: 'payments',
      name: 'Payment Analysis Report',
      description: 'Payment methods, success rates, and transaction analysis',
      icon: '💳',
      category: 'Financial'
    },
    {
      id: 'customer',
      name: 'Customer Insights Report',
      description: 'Customer behavior, preferences, and lifetime value',
      icon: '📊',
      category: 'Analytics'
    }
  ]

  useEffect(() => {
    setLoading(false)
    setReports(reportTypes)
  }, [])

  const generateReport = async (reportType) => {
    setLoading(true)
    setSelectedReport(reportType)

    // Simulate API call to generate report
    setTimeout(() => {
      const mockData = generateMockReportData(reportType.id)
      setReportData(mockData)
      setLoading(false)
    }, 2000)
  }

  const generateMockReportData = (reportId) => {
    switch (reportId) {
      case 'revenue':
        return {
          summary: {
            totalRevenue: 125000,
            growth: 15.2,
            transactions: 1250,
            averageTransaction: 100
          },
          breakdown: [
            { category: 'Event Bookings', amount: 75000, percentage: 60 },
            { category: 'Venue Rentals', amount: 30000, percentage: 24 },
            { category: 'Merchant Services', amount: 20000, percentage: 16 }
          ],
          timeline: [
            { date: '2024-01-01', revenue: 8500 },
            { date: '2024-01-08', revenue: 9200 },
            { date: '2024-01-15', revenue: 10100 },
            { date: '2024-01-22', revenue: 11300 },
            { date: '2024-01-29', revenue: 12400 }
          ]
        }
      case 'bookings':
        return {
          summary: {
            totalBookings: 1250,
            conversionRate: 12.5,
            averageBookingValue: 100,
            cancellationRate: 8.2
          },
          byStatus: [
            { status: 'Confirmed', count: 950, percentage: 76 },
            { status: 'Pending', count: 200, percentage: 16 },
            { status: 'Cancelled', count: 100, percentage: 8 }
          ],
          byCategory: [
            { category: 'Corporate Events', count: 450, percentage: 36 },
            { category: 'Weddings', count: 300, percentage: 24 },
            { category: 'Conferences', count: 250, percentage: 20 },
            { category: 'Social Events', count: 250, percentage: 20 }
          ]
        }
      case 'users':
        return {
          summary: {
            totalUsers: 5420,
            newUsers: 342,
            activeUsers: 2150,
            retentionRate: 68.5
          },
          userTypes: [
            { type: 'Customers', count: 4200, percentage: 77.5 },
            { type: 'Venue Admins', count: 850, percentage: 15.7 },
            { type: 'Merchants', count: 320, percentage: 5.9 },
            { type: 'Super Admins', count: 50, percentage: 0.9 }
          ],
          activity: [
            { date: '2024-01-01', logins: 450 },
            { date: '2024-01-08', logins: 520 },
            { date: '2024-01-15', logins: 480 },
            { date: '2024-01-22', logins: 610 },
            { date: '2024-01-29', logins: 590 }
          ]
        }
      default:
        return {
          summary: {
            metric1: 1000,
            metric2: 85.5,
            metric3: 250,
            metric4: 12.3
          },
          data: []
        }
    }
  }

  const exportReport = (format) => {
    if (!reportData) return

    const filename = `${selectedReport.id}-report-${new Date().toISOString().split('T')[0]}`
    
    if (format === 'csv') {
      // Generate CSV content
      let csvContent = 'Report Type,Generated Date,Date Range\n'
      csvContent += `${selectedReport.name},${new Date().toLocaleDateString()},${dateRange.startDate} to ${dateRange.endDate}\n\n`
      
      // Add summary data
      csvContent += 'Summary Metrics\n'
      Object.entries(reportData.summary).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`
      })

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      // Simulate PDF generation
      alert('PDF export functionality would be implemented here')
    }
  }

  const scheduleReport = () => {
    alert('Report scheduling functionality would be implemented here')
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and insights</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={scheduleReport}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Schedule Reports
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Report Templates
            </button>
          </div>
        </div>

        {/* Date Range and Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                value={filters.venue}
                onChange={(e) => setFilters(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Venues</option>
                <option value="venue1">Grand Convention Center</option>
                <option value="venue2">Downtown Event Hall</option>
                <option value="venue3">Riverside Conference Center</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
              <select
                value={filters.merchant}
                onChange={(e) => setFilters(prev => ({ ...prev, merchant: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Merchants</option>
                <option value="merchant1">Elite Catering</option>
                <option value="merchant2">Premium Events</option>
                <option value="merchant3">Luxury Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Categories</option>
                <option value="corporate">Corporate</option>
                <option value="wedding">Wedding</option>
                <option value="conference">Conference</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Types */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
              </div>
              <div className="p-6 space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport?.id === report.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => generateReport(report)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{report.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {report.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedReport ? selectedReport.name : 'Select a Report'}
                  </h3>
                  {reportData && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportReport('csv')}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={() => exportReport('pdf')}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Export PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                    <p className="text-gray-500">Generating report...</p>
                  </div>
                ) : !selectedReport ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Report Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Choose a report type from the left panel to get started.</p>
                  </div>
                ) : reportData ? (
                  <div className="space-y-6">
                    {/* Summary Metrics */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(reportData.summary).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
                              {key.includes('Rate') || key.includes('Percentage') ? '%' : ''}
                              {key.includes('Revenue') || key.includes('Value') || key.includes('Transaction') ? '$' : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown Data */}
                    {reportData.breakdown && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Breakdown</h4>
                        <div className="space-y-3">
                          {reportData.breakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="font-medium text-gray-900">{item.category}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-600">${item.amount.toLocaleString()}</span>
                                <span className="text-sm text-gray-500">{item.percentage}%</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-red-600 h-2 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status/Category Data */}
                    {(reportData.byStatus || reportData.byCategory || reportData.userTypes) && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">
                          {reportData.byStatus ? 'By Status' : reportData.byCategory ? 'By Category' : 'By Type'}
                        </h4>
                        <div className="space-y-3">
                          {(reportData.byStatus || reportData.byCategory || reportData.userTypes).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="font-medium text-gray-900">
                                {item.status || item.category || item.type}
                              </span>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-600">{item.count}</span>
                                <span className="text-sm text-gray-500">{item.percentage}%</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline Data */}
                    {(reportData.timeline || reportData.activity) && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Timeline</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            {(reportData.timeline || reportData.activity).map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {new Date(item.date).toLocaleDateString()}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {item.revenue ? `$${item.revenue.toLocaleString()}` : `${item.logins} logins`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default ReportsPage
