import React, { useState } from 'react'
import { Layout, Typography, Input, Button, Table, Tag, Space, Avatar, Tooltip, App } from 'antd'
import {
  ShopOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons'
// Assuming EditMerchantPage is a separate route, we might link to it or use a modal.
// The previous code had a link to /admin/merchants/${merchant.id}/edit
// We will keep that behavior or use a simple handler if we want to mock it.
import { useNavigate } from 'react-router-dom'
import FilterDropdown from '../components/FilterDropdown'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Content } = Layout
const { Title, Text } = Typography

const MerchantsManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { message, modal } = App.useApp()

  // Mock Merchants Data
  const [merchants, setMerchants] = useState([
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      businessName: 'Jumeirah Hospitality',
      category: 'Hotel Group',
      plan: 'Enterprise',
      status: 'active',
      lastActive: '2 min ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      businessName: 'Atlantis Group',
      category: 'Resort',
      plan: 'Enterprise',
      status: 'active',
      lastActive: '1 hr ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 3,
      name: 'Michael Chen',
      businessName: 'Sky Lounge LLC',
      category: 'Night Club',
      plan: 'Premium',
      status: 'review',
      lastActive: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      businessName: 'White Dubai Events',
      category: 'Event Venue',
      plan: 'Basic',
      status: 'inactive',
      lastActive: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 5,
      name: 'David Miller',
      businessName: 'Palazzo Hospitality',
      category: 'Fine Dining',
      plan: 'Premium',
      status: 'active',
      lastActive: '5 hours ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
    }
  ])

  // Filter States
  const [statusFilter, setStatusFilter] = useState([])
  const [planFilter, setPlanFilter] = useState([])

  const handleEditMerchant = (merchantId) => {
    navigate(`/admin/merchants/${merchantId}/edit`)
  }

  const handleDeleteMerchant = (merchantId) => {
    modal.confirm({
      title: 'Are you sure you want to delete this merchant?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setMerchants(prev => prev.filter(merchant => merchant.id !== merchantId))
        message.success('Merchant deleted successfully')
      }
    })
  }

  const columns = [
    {
      title: 'Merchant',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<ShopOutlined />} />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.businessName}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      filters: [
        { text: 'Enterprise', value: 'Enterprise' },
        { text: 'Premium', value: 'Premium' },
        { text: 'Basic', value: 'Basic' }
      ],
      onFilter: (value, record) => record.plan === value,
      render: (plan) => {
        let color = 'blue';
        if (plan === 'Enterprise') color = 'purple';
        if (plan === 'Premium') color = 'gold';
        return <Tag color={color}>{plan}</Tag>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Review', value: 'review' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default'
        if (status === 'active') color = 'success'
        if (status === 'inactive') color = 'error'
        if (status === 'review') color = 'warning'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditMerchant(record.id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMerchant(record.id)}
          />
        </Space>
      )
    }
  ]

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(merchant.status)
    const matchesPlan = planFilter.length === 0 || planFilter.includes(merchant.plan)

    return matchesSearch && matchesStatus && matchesPlan
  })

  return (
    <SuperAdminLayout>
      <div style={{ padding: '0px' }}>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Merchants Management</Title>
            <Text type="secondary">Manage merchant accounts and plans</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 600 }}>
            <Input
              placeholder="Search merchants..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: 12 }}
            />
            <FilterDropdown
              label="Status"
              options={[
                { id: 'active', label: 'Active' },
                { id: 'inactive', label: 'Inactive' },
                { id: 'review', label: 'Review' }
              ]}
              selectedValues={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Plan"
              options={[
                { id: 'Enterprise', label: 'Enterprise' },
                { id: 'Premium', label: 'Premium' },
                { id: 'Basic', label: 'Basic' }
              ]}
              selectedValues={planFilter}
              onChange={setPlanFilter}
            />
          </div>

          <Space>
            <Button icon={<DownloadOutlined />} size="large">Export</Button>
            <Button
              type="primary"
              className="btn-primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/admin/merchants/new')} // Assuming creation page or modal exists, but for now just navigate
            >
              Add Merchant
            </Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={filteredMerchants}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default MerchantsManagement
