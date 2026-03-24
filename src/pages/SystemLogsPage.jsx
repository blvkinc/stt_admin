import React, { useState, useEffect } from 'react'
import SuperAdminLayout from '../components/SuperAdminLayout'

const SystemLogsPage = () => {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    timeRange: '24h',
    user: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockLogs = [
          {
            id: 1,
            timestamp: '2024-02-15T10:30:25Z',
            level: 'info',
            category: 'authentication',
            message: 'User login successful',
            user: 'john.smith@example.com',
            ip: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: { userId: 123, sessionId: 'sess_abc123' }
          },
          {
            id: 2,
            timestamp: '2024-02-15T10:28:15Z',
            level: 'warning',
            category: 'payment',
            message: 'Payment processing delayed',
            user: 'system',
            ip: '10.0.0.1',
            userAgent: 'Internal System',
            details: { paymentId: 'pay_456', amount: 250.00, reason: 'Gateway timeout' }
          },
          {
            id: 3,
            timestamp: '2024-02-15T10:25:42Z',
            level: 'error',
            category: 'database',
            message: 'Database connection timeout',
            user: 'system',
            ip: '10.0.0.1',
            userAgent: 'Internal System',
            details: { database: 'main', timeout: 30000, query: 'SELECT * FROM events' }
          },
          {
            id: 4,
            timestamp: '2024-02-15T10:22:18Z',
            level: 'info',
            category: 'booking',
            message: 'New booking created',
            user: 'alice.johnson@example.com',
            ip: '203.0.113.45',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
            details: { bookingId: 'book_789', eventId: 'evt_101', amount: 150.00 }
          },
          {
            id: 5,
            timestamp: '2024-02-15T10:20:33Z',
            level: 'debug',
            category: 'api',
            message: 'API rate limit check',
            user: 'merchant.api@example.com',
            ip: '198.51.100.22',
            userAgent: 'EventApp/1.0',
            details: { endpoint: '/api/events', requests: 45, limit: 100 }
          },
          {
            id: 6,
            timestamp: '2024-02-15T10:18:07Z',
            level: 'critical',
            category: 'security',
            message: 'Multiple failed login attempts detected',
            user: 'unknown',
            ip: '185.220.101.45',
            userAgent: 'curl/7.68.0',
            details: { attempts: 15, timeWindow: '5 minutes', blocked: true }
          },
          {
            id: 7,
            timestamp: '2024-02-15T10:15:52Z',
            level: 'info',
            category: 'venue',
            message: 'Venue information updated',
            user: 'venue.admin@example.com',
            ip: '172.16.0.10',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            details: { venueId: 'venue_202', changes: ['capacity', 'amenities'] }
          },
          {
            id: 8,
            timestamp: '2024-02-15T10:12:28Z',
            level: 'warning',
            category: 'storage',
            message: 'Disk space usage high',
            user: 'system',
            ip: '10.0.0.1',
            userAgent: 'Internal System',
            details: { usage: '85%', threshold: '80%', partition: '/var/log' }
          }
        ]
        setLogs(mockLogs)
        setFilteredLogs(mockLogs)
        setLoading(false)
      }, 1000)
    }

    fetchLogs()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate new log entry
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          level: 'info',
          category: 'system',
          message: 'System health check completed',
          user: 'system',
          ip: '10.0.0.1',
          userAgent: 'Internal System',
          details: { status: 'healthy', uptime: '99.9%' }
        }
        setLogs(prev => [newLog, ...prev])
      }, 10000) // Refresh every 10 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Filter logs based on current filters and search term
  useEffect(() => {
    let filtered = logs

    // Apply filters
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level)
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category)
    }
    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.user !== 'system')
    }

    // Apply time range filter
    if (filters.timeRange !== 'all') {
      const now = new Date()
      const timeRanges = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      const cutoff = new Date(now.getTime() - timeRanges[filters.timeRange])
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoff)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, filters, searchTerm])

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'debug': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelIcon = (level) => {
    switch (level) {
      case 'critical':
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Message', 'User', 'IP Address'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.user,
        log.ip
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600">Monitor system activity and troubleshoot issues</p>
          </div>
          <div className="flex space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">Auto-refresh</span>
            </label>
            <button
              onClick={exportLogs}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Export Logs
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Clear Logs
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'critical').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'error').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Info</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'info').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Debug</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'debug').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Levels</option>
                <option value="critical">Critical</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
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
                <option value="authentication">Authentication</option>
                <option value="payment">Payment</option>
                <option value="database">Database</option>
                <option value="booking">Booking</option>
                <option value="api">API</option>
                <option value="security">Security</option>
                <option value="venue">Venue</option>
                <option value="storage">Storage</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={filters.user}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Users</option>
                <option value="users">Users Only</option>
                <option value="system">System Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ level: 'all', category: 'all', timeRange: '24h', user: 'all' })
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Logs Display */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              System Logs ({filteredLogs.length} entries)
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border-b border-gray-100 p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(log.level)}`}>
                    {getLevelIcon(log.level)}
                    <span className="ml-1 uppercase">{log.level}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{log.category}</span>
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          View Details
                        </summary>
                        <pre className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default SystemLogsPage
