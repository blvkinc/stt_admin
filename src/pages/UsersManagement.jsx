import React, { useState } from 'react'
import { Layout, Typography, Input, Button, Table, Tag, Space, Avatar, Tooltip, App } from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import AddUserModal from '../components/AddUserModal'
import FilterDropdown from '../components/FilterDropdown'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Content } = Layout
const { Title, Text } = Typography

const UsersManagement = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { message, modal } = App.useApp()

  // Mock Users Data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@jumeirah.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2 min ago',
      assignedVenues: [1, 2],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@atlantis.com',
      role: 'Editor',
      status: 'active',
      lastActive: '1 hr ago',
      assignedVenues: [3],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@skyhospitality.ae',
      role: 'Super Admin',
      status: 'active',
      lastActive: 'Just now',
      assignedVenues: [],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@whitedubai.com',
      role: 'Bookings & Customer Manager',
      status: 'inactive',
      lastActive: '2 days ago',
      assignedVenues: [4, 5],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 5,
      name: 'David Miller',
      email: 'david@palazzo.ae',
      role: 'Venue Admin',
      status: 'pending',
      lastActive: 'Never',
      assignedVenues: [],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
    }
  ])

  // Filter States
  const [statusFilter, setStatusFilter] = useState([])
  const [roleFilter, setRoleFilter] = useState([])

  const handleAddUser = (userData, isEdit) => {
    if (isEdit) {
      setUsers(prev => prev.map(user =>
        user.id === userData.id ? { ...user, ...userData } : user
      ))
    } else {
      const newUser = {
        id: users.length + 1,
        ...userData,
        status: 'active',
        lastActive: 'Just now',
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`
      }
      setUsers(prev => [...prev, newUser])
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsAddUserModalOpen(true)
  }

  const handleDeleteUser = (userId) => {
    modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setUsers(prev => prev.filter(user => user.id !== userId))
        message.success('User deleted successfully')
      }
    })
  }

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Super Admin', value: 'Super Admin' },
        { text: 'Admin', value: 'Admin' },
        { text: 'Editor', value: 'Editor' },
        { text: 'Bookings & Customer Manager', value: 'Bookings & Customer Manager' },
        { text: 'Venue Admin', value: 'Venue Admin' }
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colorMap = {
          'Super Admin': 'purple',
          'Admin': 'blue',
          'Editor': 'gold',
          'Bookings & Customer Manager': 'green',
          'Venue Admin': 'cyan'
        }
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default'
        if (status === 'active') color = 'success'
        if (status === 'inactive') color = 'error'
        if (status === 'pending') color = 'warning'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Venues',
      dataIndex: 'assignedVenues',
      key: 'assignedVenues',
      render: (venues) => (
        <Text>{Array.isArray(venues) ? venues.length : 0} Assigned</Text>
      )
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
            onClick={() => handleEditUser(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          />
        </Space>
      )
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Ant Design Table handles column filters automatically via `filters` prop in columns, 
    // but we can also pre-filter if needed. 
    // Here we let the Table handle the exact matching if specific options are selected via text search.
    // The dropdown components update statusFilter/roleFilter which we can use to filter data passed to Table 
    // IF we want to use the top bar filters. 
    // Since we have the top bar filters (FilterDropdown), let's use them as the primary source.
    // We can remove `filters` from columns if we only want external controls, or sync them.
    // Ideally, either use Table headers OR external controls. The layout has external controls.
    // I will use the external controls to filter the `dataSource`.

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(user.status)
    const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role)

    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <SuperAdminLayout>
      <div style={{ padding: '0px' }}>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Users Management</Title>
            <Text type="secondary">Manage system administrators and venue managers</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 600 }}>
            <Input
              placeholder="Search users..."
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
                { id: 'pending', label: 'Pending' }
              ]}
              selectedValues={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Role"
              options={[
                { id: 'Super Admin', label: 'Super Admin' },
                { id: 'Admin', label: 'Admin' },
                { id: 'Editor', label: 'Editor' },
                { id: 'Bookings & Customer Manager', label: 'Bookings & Customer Manager' },
                { id: 'Venue Admin', label: 'Venue Admin' }
              ]}
              selectedValues={roleFilter}
              onChange={setRoleFilter}
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
                setSelectedUser(null)
                setIsAddUserModalOpen(true)
              }}
            >
              Add User
            </Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUser}
          initialData={selectedUser}
        />
      </div>
    </SuperAdminLayout>
  )
}

export default UsersManagement
