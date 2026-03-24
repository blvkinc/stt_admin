import React, { useState } from 'react'
import { Typography, Input, Button, Table, Tag, Space, Modal, Form, Select, App } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import SuperAdminLayout from '../components/SuperAdminLayout'

const { Title, Text } = Typography
const { Option } = Select

const FAQsManagement = () => {
  const { message, modal } = App.useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [form] = Form.useForm()

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      type: 'Section',
      title: 'General Policies',
      status: 'active',
      usage: 12
    },
    {
      id: 2,
      type: 'Question',
      title: 'Is valet parking available?',
      status: 'active',
      usage: 8
    },
    {
      id: 3,
      type: 'Question',
      title: 'What is the cancellation policy?',
      status: 'draft',
      usage: 2
    }
  ])

  const handleOpenModal = (faq = null) => {
    setSelectedFaq(faq)
    setIsModalOpen(true)
    if (faq) {
      form.setFieldsValue({
        title: faq.title,
        type: faq.type,
        status: faq.status
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        type: 'Question',
        status: 'active'
      })
    }
  }

  const handleDelete = (id) => {
    modal.confirm({
      title: 'Delete FAQ?',
      content: 'This will remove it from the global FAQ library.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setFaqs(prev => prev.filter(item => item.id !== id))
        message.success('FAQ deleted')
      }
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (selectedFaq) {
        setFaqs(prev => prev.map(item => item.id === selectedFaq.id ? { ...item, ...values } : item))
        message.success('FAQ updated')
      } else {
        setFaqs(prev => [{ id: Date.now(), usage: 0, ...values }, ...prev])
        message.success('FAQ created')
      }
      setIsModalOpen(false)
    } catch (error) {
      // validation handled
    }
  }

  const columns = [
    {
      title: 'FAQ',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value) => <Tag color={value === 'Section' ? 'purple' : 'blue'}>{value}</Tag>
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

  const filtered = faqs.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <SuperAdminLayout>
      <div>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>FAQs</Title>
            <Text type="secondary">Manage reusable FAQ sections and questions</Text>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Search FAQs..."
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
            Add FAQ
          </Button>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>

        <Modal
          title={selectedFaq ? 'Edit FAQ' : 'Add FAQ'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText={selectedFaq ? 'Update' : 'Create'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Select FAQ type' }]}>
              <Select>
                <Option value="Section">Section</Option>
                <Option value="Question">Question</Option>
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Title / Question" rules={[{ required: true, message: 'Enter FAQ title' }]}>
              <Input placeholder="Is valet parking available?" />
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

export default FAQsManagement
