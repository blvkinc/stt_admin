import React, { useState } from 'react'
import { Typography, Input, Button, Table, Tag, Space, Modal, Form, Select, App } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Title, Text } = Typography
const { Option } = Select

const CategoriesManagement = () => {
  const { message, modal } = App.useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [form] = Form.useForm()

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Brunch',
      slug: 'brunch',
      type: 'Primary',
      parent: null,
      status: 'active',
      events: 42
    },
    {
      id: 2,
      name: 'Nightlife',
      slug: 'nightlife',
      type: 'Primary',
      parent: null,
      status: 'active',
      events: 28
    },
    {
      id: 3,
      name: 'Beach Brunch',
      slug: 'beach-brunch',
      type: 'Subcategory',
      parent: 'Brunch',
      status: 'active',
      events: 14
    },
    {
      id: 4,
      name: 'Business Lunch',
      slug: 'business-lunch',
      type: 'Subcategory',
      parent: 'Dining',
      status: 'inactive',
      events: 6
    }
  ])

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
    if (category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        type: category.type,
        parent: category.parent || undefined,
        status: category.status
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        type: 'Primary',
        status: 'active'
      })
    }
  }

  const handleDelete = (id) => {
    modal.confirm({
      title: 'Delete category?',
      content: 'This will remove the category and detach it from events.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setCategories(prev => prev.filter(cat => cat.id !== id))
        message.success('Category deleted')
      }
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (selectedCategory) {
        setCategories(prev => prev.map(cat =>
          cat.id === selectedCategory.id ? { ...cat, ...values } : cat
        ))
        message.success('Category updated')
      } else {
        const newCategory = {
          id: Date.now(),
          ...values,
          events: 0
        }
        setCategories(prev => [newCategory, ...prev])
        message.success('Category created')
      }
      setIsModalOpen(false)
    } catch (error) {
      // validation errors handled by Form
    }
  }

  const columns = [
    {
      title: 'Category',
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
      render: (value) => <Tag color={value === 'Primary' ? 'blue' : 'purple'}>{value}</Tag>
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      render: (value) => value ? <Text>{value}</Text> : <Text type="secondary">None</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <Tag color={value === 'active' ? 'success' : 'default'}>{value.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Events',
      dataIndex: 'events',
      key: 'events',
      render: (value) => <Text>{value}</Text>
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

  const filtered = categories.filter(cat => {
    const query = searchQuery.toLowerCase()
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      (cat.parent || '').toLowerCase().includes(query)
    )
  })

  return (
    <SuperAdminLayout>
      <div>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Categories</Title>
            <Text type="secondary">Manage global categories and subcategories</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Search categories..."
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
            Add Category
          </Button>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>

        <Modal
          title={selectedCategory ? 'Edit Category' : 'Add Category'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText={selectedCategory ? 'Update' : 'Create'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Enter category name' }]}>
              <Input placeholder="e.g., Brunch" />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Enter slug' }]}>
              <Input placeholder="e.g., brunch" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Select type' }]}>
              <Select>
                <Option value="Primary">Primary</Option>
                <Option value="Subcategory">Subcategory</Option>
              </Select>
            </Form.Item>
            <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type} noStyle>
              {({ getFieldValue }) => getFieldValue('type') === 'Subcategory' && (
                <Form.Item name="parent" label="Parent Category" rules={[{ required: true, message: 'Select parent category' }]}>
                  <Select placeholder="Select parent">
                    {categories.filter(cat => cat.type === 'Primary').map(cat => (
                      <Option key={cat.id} value={cat.name}>{cat.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Select status' }]}>
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </SuperAdminLayout>
  )
}

export default CategoriesManagement
