import React, { useState } from 'react'
import { Layout, Typography, Input, Button, Table, Tag, Space, Avatar, Rate, App } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import AddVenueModal from '../components/AddVenueModal'
import FilterDropdown from '../components/FilterDropdown'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Content } = Layout
const { Title, Text } = Typography

const VenuesManagement = () => {
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { message, modal } = App.useApp()

  // Mock Venues Data
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: 'Burj Al Arab',
      location: 'Jumeirah St, Dubai',
      category: 'Luxury Hotel',
      rating: 4.8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 2,
      name: 'Nammos Dubai',
      location: 'Four Seasons Resort',
      category: 'Beach Club',
      rating: 4.9,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 3,
      name: 'Zuma Dubai',
      location: 'DIFC, Gate Village 06',
      category: 'Fine Dining',
      rating: 4.7,
      status: 'review',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 4,
      name: 'White Dubai',
      location: 'Meydan Racecourse',
      category: 'Night Club',
      rating: 4.5,
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 5,
      name: 'Sky 2.0',
      location: 'Dubai Design District',
      category: 'Night Club',
      rating: 4.6,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1578474843222-27f116518cd8?auto=format&fit=crop&q=80&w=100'
    }
  ])

  // Filter States
  const [statusFilter, setStatusFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState([])

  const handleAddVenue = (venueData, isEdit) => {
    if (isEdit) {
      setVenues(prev => prev.map(venue =>
        venue.id === venueData.id ? { ...venue, ...venueData } : venue
      ))
    } else {
      const newVenue = {
        id: venues.length + 1,
        ...venueData,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=100', // placeholder
      }
      setVenues(prev => [...prev, newVenue])
    }
  }

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue)
    setIsAddVenueModalOpen(true)
  }

  const handleDeleteVenue = (venueId) => {
    modal.confirm({
      title: 'Are you sure you want to delete this venue?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setVenues(prev => prev.filter(venue => venue.id !== venueId))
        message.success('Venue deleted successfully')
      }
    })
  }

  const columns = [
    {
      title: 'Venue',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar shape="square" size={40} src={record.image} />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Space size={4}>
              <EnvironmentOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{record.location}</Text>
            </Space>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Luxury Hotel', value: 'Luxury Hotel' },
        { text: 'Beach Club', value: 'Beach Club' },
        { text: 'Fine Dining', value: 'Fine Dining' },
        { text: 'Night Club', value: 'Night Club' }
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <Space size={4}>
          <Rate disabled defaultValue={1} count={1} style={{ fontSize: 14, color: '#fadb14' }} />
          <Text strong>{rating}</Text>
        </Space>
      )
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditVenue(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVenue(record.id)}
          />
        </Space>
      )
    }
  ]

  const filteredVenues = venues.filter(venue => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(venue.status)
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(venue.category)

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <SuperAdminLayout>
      <div style={{ padding: '0px' }}>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Venues Management</Title>
            <Text type="secondary">Manage venues and their details</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 600 }}>
            <Input
              placeholder="Search venues..."
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
              label="Category"
              options={[
                { id: 'Luxury Hotel', label: 'Luxury Hotel' },
                { id: 'Beach Club', label: 'Beach Club' },
                { id: 'Fine Dining', label: 'Fine Dining' },
                { id: 'Night Club', label: 'Night Club' }
              ]}
              selectedValues={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>

          <Space>
            <Button icon={<DownloadOutlined />} size="large">Export</Button>
            <Button
              type="primary"
              className="btn-primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => {
                setSelectedVenue(null)
                setIsAddVenueModalOpen(true)
              }}
            >
              Add Venue
            </Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={filteredVenues}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <AddVenueModal
          isOpen={isAddVenueModalOpen}
          onClose={() => setIsAddVenueModalOpen(false)}
          onSubmit={handleAddVenue}
          initialData={selectedVenue}
        />
      </div>
    </SuperAdminLayout>
  )
}

export default VenuesManagement
