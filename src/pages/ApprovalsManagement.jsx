import React, { useMemo, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useMerchant } from '@shared/context/MerchantContext'
import SuperAdminLayout from '../components/SuperAdminLayout'
import ApprovalDetailModal from '../components/ApprovalDetailModal'

const { Title, Text } = Typography
const { Option } = Select

const ApprovalsManagement = () => {
  const { merchant, isMerchantAuthenticated } = useMerchant()
  const [searchParams] = useSearchParams()

  
  if (!isMerchantAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  
  if (merchant?.role !== 'super_admin') {
    return <Navigate to="/auth" replace />
  }

  const initialStatus = (searchParams.get('status') || 'all').toLowerCase()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    status: initialStatus,
    priority: 'all'
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [approvalData, setApprovalData] = useState([
    {
      id: 1,
      type: 'venue',
      title: 'Atlantis The Palm - Nobu',
      submittedBy: 'Nobu Hospitality',
      submittedAt: '2024-12-18T10:30:00Z',
      status: 'pending',
      priority: 'high',
      category: 'Fine Dining',
      location: 'Palm Jumeirah, Dubai',
      description: 'World-renowned Japanese restaurant seeking approval for luxury dining experiences',
      documents: ['Business License', 'Food Safety Certificate', 'Insurance Certificate'],
      estimatedRevenue: 250000,
      requestedCommission: 8.5,
      details: {
        capacity: 120,
        cuisineType: 'Japanese Fine Dining',
        priceRange: 'AED 400-800',
        operatingHours: '6:00 PM - 12:00 AM',
        specialFeatures: ['Michelin Star Chef', 'Ocean View', 'Private Dining Rooms']
      }
    },
    {
      id: 2,
      type: 'event',
      title: 'New Year Gala Dinner 2025',
      submittedBy: 'Burj Al Arab',
      submittedAt: '2024-12-17T14:20:00Z',
      status: 'pending',
      priority: 'critical',
      category: 'Special Event',
      location: 'Burj Al Arab, Dubai',
      description: 'Exclusive New Year celebration with world-class entertainment and dining',
      eventDate: '2024-12-31',
      price: 1299,
      capacity: 200,
      packages: [
        { name: 'Premium Package', price: 1299, includes: ['7-course dinner', 'Premium beverages', 'Live entertainment'] },
        { name: 'VIP Package', price: 1899, includes: ['Private table', 'Champagne service', 'Meet & greet'] }
      ]
    },
    {
      id: 3,
      type: 'merchant',
      title: 'Dubai Marina Yacht Club',
      submittedBy: 'Marina Holdings LLC',
      submittedAt: '2024-12-16T09:15:00Z',
      status: 'under_review',
      priority: 'medium',
      category: 'Yacht Club',
      location: 'Dubai Marina',
      description: 'Premium yacht club offering exclusive dining and entertainment experiences',
      businessType: 'Hospitality',
      expectedVenues: 2,
      projectedRevenue: 180000,
      contactPerson: 'Captain Ahmed Al-Mansoori',
      phone: '+971 50 123 4567',
      email: 'ahmed@marinaclub.ae'
    },
    {
      id: 4,
      type: 'menu',
      title: 'Winter Seasonal Menu',
      submittedBy: 'Four Seasons Resort',
      submittedAt: '2024-12-15T16:45:00Z',
      status: 'approved',
      priority: 'low',
      category: 'Seasonal Menu',
      location: 'Jumeirah Beach, Dubai',
      description: 'New winter menu featuring seasonal ingredients and festive specialties',
      menuItems: 15,
      priceRange: 'AED 85-320',
      validFrom: '2024-12-20',
      validTo: '2025-03-20'
    },
    {
      id: 5,
      type: 'promotion',
      title: 'Ladies Night Special Offer',
      submittedBy: 'Sky Lounge Dubai',
      submittedAt: '2024-12-14T11:30:00Z',
      status: 'rejected',
      priority: 'medium',
      category: 'Promotional Campaign',
      location: 'Downtown Dubai',
      description: 'Weekly ladies night promotion with special pricing and complimentary services',
      discount: 50,
      validDays: ['Tuesday'],
      duration: '3 months',
      rejectionReason: 'Pricing structure conflicts with platform guidelines'
    }
  ])

  const filteredApprovals = useMemo(() => {
    return approvalData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesStatus = filters.status === 'all' || item.status === filters.status
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority
      return matchesSearch && matchesType && matchesStatus && matchesPriority
    })
  }, [approvalData, searchTerm, filters])

  const approvalStats = {
    pending: approvalData.filter(a => a.status === 'pending').length,
    underReview: approvalData.filter(a => a.status === 'under_review').length,
    critical: approvalData.filter(a => a.priority === 'critical').length,
    approved: approvalData.filter(a => a.status === 'approved').length
  }

  const statusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="warning">Pending</Tag>
      case 'under_review':
        return <Tag color="processing">Under Review</Tag>
      case 'approved':
        return <Tag color="success">Approved</Tag>
      case 'rejected':
        return <Tag color="error">Rejected</Tag>
      default:
        return <Tag>Unknown</Tag>
    }
  }

  const priorityTag = (priority) => {
    switch (priority) {
      case 'critical':
        return <Tag color="red">Critical</Tag>
      case 'high':
        return <Tag color="orange">High</Tag>
      case 'medium':
        return <Tag color="gold">Medium</Tag>
      case 'low':
        return <Tag color="default">Low</Tag>
      default:
        return <Tag>Normal</Tag>
    }
  }

  const handleApprove = async (id) => {
    setApprovalData(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item))
  }

  const handleReject = async (id, reason) => {
    setApprovalData(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected', rejectionReason: reason } : item))
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>by {record.submittedBy}</Text>
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (value) => priorityTag(value)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => statusTag(value)
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedItem(record)
              setDetailOpen(true)
            }}
          />
          {(record.status === 'pending' || record.status === 'under_review') && (
            <>
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record.id, 'Rejected by admin')}
              />
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <SuperAdminLayout>
      <div style={{ padding: 0 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>Approvals Management</Title>
            <Text type="secondary">Review and manage all pending approvals</Text>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />}>Export Report</Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Pending" value={approvalStats.pending} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Under Review" value={approvalStats.underReview} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Critical Priority" value={approvalStats.critical} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Approved" value={approvalStats.approved} />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input
                size="large"
                placeholder="Search by title or submitter"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="large"
                value={filters.type}
                onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                style={{ width: 160 }}
              >
                <Option value="all">All Types</Option>
                <Option value="venue">Venue</Option>
                <Option value="event">Event</Option>
                <Option value="merchant">Merchant</Option>
                <Option value="menu">Menu</Option>
                <Option value="promotion">Promotion</Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="large"
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                style={{ width: 180 }}
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="under_review">Under Review</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="large"
                value={filters.priority}
                onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                style={{ width: 160 }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Priority</Option>
                <Option value="critical">Critical</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        <Card>
          <Table
            columns={columns}
            dataSource={filteredApprovals}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        </Card>

        <ApprovalDetailModal
          isOpen={detailOpen}
          onClose={() => {
            setDetailOpen(false)
            setSelectedItem(null)
          }}
          item={selectedItem}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </SuperAdminLayout>
  )
}

export default ApprovalsManagement


