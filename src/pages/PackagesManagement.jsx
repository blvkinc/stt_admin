import React, { useState } from 'react'
import { Typography, Input, Button, Table, Tag, Space, Modal, Form, Select, InputNumber, App } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Title, Text } = Typography
const { Option } = Select

const PackagesManagement = () => {
  const { message, modal } = App.useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [form] = Form.useForm()

  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Soft Drinks Package',
      slug: 'soft-drinks-package',
      type: 'Individual',
      defaultGuests: 1,
      basePrice: 120,
      status: 'active',
      usage: 2
    },
    {
      id: 2,
      name: 'House Beverages Package',
      slug: 'house-beverages-package',
      type: 'Group',
      defaultGuests: 4,
      basePrice: 280,
      status: 'draft',
      usage: 1
    }
  ])

  const handleOpenModal = (pkg = null) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
    if (pkg) {
      form.setFieldsValue({
        name: pkg.name,
        slug: pkg.slug,
        type: pkg.type,
        defaultGuests: pkg.defaultGuests,
        basePrice: pkg.basePrice,
        status: pkg.status
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        type: 'Individual',
        status: 'draft',
        defaultGuests: 1
      })
    }
  }

  const handleDelete = (id) => {
    modal.confirm({
      title: 'Delete package template?',
      content: 'This removes the template from the global catalog.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setPackages(prev => prev.filter(pkg => pkg.id !== id))
        message.success('Package template deleted')
      }
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (selectedPackage) {
        setPackages(prev => prev.map(pkg => pkg.id === selectedPackage.id ? { ...pkg, ...values } : pkg))
        message.success('Package template updated')
      } else {
        setPackages(prev => [{
          id: Date.now(),
          usage: 0,
          ...values
        }, ...prev])
        message.success('Package template created')
      }
      setIsModalOpen(false)
    } catch (error) {
      // Form handles validation
    }
  }

  const columns = [
    {
      title: 'Package',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Slug: {record.slug}</Text>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Guests',
      dataIndex: 'defaultGuests',
      key: 'defaultGuests',
      render: (value) => <Text>{value}</Text>
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (value) => <Text strong>AED {value}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <Tag color={value === 'active' ? 'success' : 'warning'}>{value.toUpperCase()}</Tag>
    },
    {
      title: 'Used In Events',
      dataIndex: 'usage',
      key: 'usage'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      )
    }
  ]

  const filtered = packages.filter(pkg => {
    const query = searchQuery.toLowerCase()
    return (
      pkg.name.toLowerCase().includes(query) ||
      pkg.slug.toLowerCase().includes(query)
    )
  })

  return (
    <SuperAdminLayout>
      <div>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Packages</Title>
            <Text type="secondary">Manage global package templates</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Search packages..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: 12, maxWidth: 360 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="btn-primary"
            onClick={() => handleOpenModal()}
          >
            Add Package
          </Button>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>

        <Modal
          title={selectedPackage ? 'Edit Package Template' : 'Add Package Template'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText={selectedPackage ? 'Update' : 'Create'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Package Name" rules={[{ required: true, message: 'Enter package name' }]}>
              <Input placeholder="Soft Drinks Package" />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Enter slug' }]}>
              <Input placeholder="soft-drinks-package" />
            </Form.Item>
            <Form.Item name="type" label="Package Type" rules={[{ required: true, message: 'Select type' }]}>
              <Select>
                <Option value="Individual">Individual</Option>
                <Option value="Couple">Couple</Option>
                <Option value="Group">Group</Option>
              </Select>
            </Form.Item>
            <Form.Item name="defaultGuests" label="Default Guests" rules={[{ required: true, message: 'Enter default guests' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="basePrice" label="Base Price (AED)" rules={[{ required: true, message: 'Enter base price' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Select status' }]}>
              <Select>
                <Option value="active">Active</Option>
                <Option value="draft">Draft</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </SuperAdminLayout>
  )
}

export default PackagesManagement
