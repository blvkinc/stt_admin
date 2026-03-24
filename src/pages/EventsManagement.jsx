import React, { useState } from 'react'
import { Typography, Input, Button, Table, Tag, Space, Avatar, Progress, App } from 'antd'
import {
  CalendarOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import EditEventModal from '../components/EditEventModal'
import FilterDropdown from '../components/FilterDropdown'
import SuperAdminLayout from '../components/SuperAdminLayout'
import SaianaImage from '@shared/assets/demo/BEBEACH1.webp'

const { Title, Text } = Typography

const EventsManagement = () => {
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { message, modal } = App.useApp()

  // Mock Events Data
  const [events, setEvents] = useState([
    {
      id: 99,
      title: 'Saiana Brunch',
      date: '2024-12-22T14:00:00',
      location: 'BeBeach Dubai - Dubai Harbour',
      status: 'upcoming',
      ticketsSold: 142,
      totalTickets: 300,
      image: SaianaImage,
      category: 'Day Brunch'
    },
    {
      id: 1,
      title: 'Neon Nights',
      date: '2024-12-24T22:00:00',
      location: 'White Dubai',
      status: 'upcoming',
      ticketsSold: 450,
      totalTickets: 500,
      image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=100',
      category: 'Nightlife'
    },
    {
      id: 2,
      title: 'Sunset Beach Party',
      date: '2024-12-25T16:00:00',
      location: 'Nammos Dubai',
      status: 'upcoming',
      ticketsSold: 120,
      totalTickets: 300,
      image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=100',
      category: 'Beach Club'
    },
    {
      id: 3,
      title: 'Jazz Lounge Night',
      date: '2024-12-23T20:00:00',
      location: 'Zuma Dubai',
      status: 'ongoing',
      ticketsSold: 85,
      totalTickets: 100,
      image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=100',
      category: 'Dining'
    },
    {
      id: 4,
      title: 'Tech Summit Afterparty',
      date: '2024-12-20T21:00:00',
      location: 'Sky 2.0',
      status: 'completed',
      ticketsSold: 800,
      totalTickets: 800,
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=100',
      category: 'Business'
    },
    {
      id: 5,
      title: 'VIP Gala Dinner',
      date: '2024-12-28T19:30:00',
      location: 'Burj Al Arab',
      status: 'upcoming',
      ticketsSold: 50,
      totalTickets: 100,
      image: 'https://images.unsplash.com/photo-1519671482538-518b5c2bf9c2?auto=format&fit=crop&q=80&w=100',
      category: 'Dining'
    }
  ])

  // Filter States
  const [statusFilter, setStatusFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState([])

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setIsEditEventModalOpen(true)
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setIsEditEventModalOpen(true)
  }

  const handleSaveEvent = (updatedEvent) => {
    if (updatedEvent.id) {
      setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev))
    } else {
      const newEvent = {
        ...updatedEvent,
        id: Date.now(),
        status: updatedEvent.status || 'draft',
        ticketsSold: 0,
        totalTickets: updatedEvent.totalTickets || 100
      }
      setEvents(prev => [newEvent, ...prev])
    }
    setIsEditEventModalOpen(false)
  }

  const handleDeleteEvent = (eventId) => {
    modal.confirm({
      title: 'Are you sure you want to delete this event?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setEvents(prev => prev.filter(event => event.id !== eventId))
        message.success('Event deleted successfully')
      }
    })
  }

  const columns = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <Avatar shape="square" size={48} src={record.image} />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.category}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Date & Location',
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Space size={4}>
            <CalendarOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
            <Text>{new Date(date).toLocaleDateString()}</Text>
          </Space>
          <Space size={4}>
            <EnvironmentOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.location}</Text>
          </Space>
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Upcoming', value: 'upcoming' },
        { text: 'Ongoing', value: 'ongoing' },
        { text: 'Completed', value: 'completed' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default'
        if (status === 'upcoming') color = 'blue'
        if (status === 'ongoing') color = 'green'
        if (status === 'completed') color = 'default'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Ticket Sales',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
      render: (sold, record) => {
        const percent = Math.round((sold / record.totalTickets) * 100)
        return (
          <div style={{ minWidth: 100 }}>
            <Progress percent={percent} size="small" status="active" />
            <Text type="secondary" style={{ fontSize: 12 }}>{sold} / {record.totalTickets} sold</Text>
          </div>
        )
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
            onClick={() => handleEditEvent(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEvent(record.id)}
          />
        </Space>
      )
    }
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Antd Table handles column filters, but using external filters as primary:
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(event.status)
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(event.category)

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <SuperAdminLayout>
      <div style={{ padding: '0px' }}>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Events Management</Title>
            <Text type="secondary">Manage all events across venues</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 600 }}>
            <Input
              placeholder="Search events..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: 12 }}
            />
            <FilterDropdown
              label="Status"
              options={[
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'ongoing', label: 'Ongoing' },
                { id: 'completed', label: 'Completed' }
              ]}
              selectedValues={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Category"
              options={[
                { id: 'Nightlife', label: 'Nightlife' },
                { id: 'Dining', label: 'Dining' },
                { id: 'Beach Club', label: 'Beach Club' },
                { id: 'Business', label: 'Business' }
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
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <EditEventModal
          isOpen={isEditEventModalOpen}
          onClose={() => setIsEditEventModalOpen(false)}
          event={selectedEvent}
          onSave={handleSaveEvent}
        />
      </div>
    </SuperAdminLayout>
  )
}

export default EventsManagement

