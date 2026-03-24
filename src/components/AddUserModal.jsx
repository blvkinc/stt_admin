import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Checkbox, Button, App, Space, Divider, Typography, Row, Col } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

const AddUserModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const roles = [
    { value: 'Super Admin', label: 'Super Admin', description: 'Full platform access' },
    { value: 'Admin', label: 'Admin', description: 'Platform operations access' },
    { value: 'Editor', label: 'Editor', description: 'Content and listings management' },
    { value: 'Bookings & Customer Manager', label: 'Bookings & Customer Manager', description: 'Booking and customer support' },
    { value: 'Venue Admin', label: 'Venue Admin', description: 'Venue management access' }
  ]

  const permissionsList = [
    { label: 'Venue Management', value: 'venue_management' },
    { label: 'Event Management', value: 'event_management' },
    { label: 'Package Management', value: 'package_management' },
    { label: 'Booking Management', value: 'booking_management' },
    { label: 'Customer Support', value: 'customer_support' },
    { label: 'Approvals', value: 'approvals' },
    { label: 'Payouts & Payments', value: 'payments' },
    { label: 'User Management', value: 'user_management' },
    { label: 'System Settings', value: 'system_settings' },
    { label: 'Analytics Access', value: 'analytics_access' }
  ]

  const venues = [
    { id: 1, name: 'Burj Al Arab - Al Muntaha' },
    { id: 2, name: 'Atlantis The Palm - Ossiano' },
    { id: 3, name: 'Four Seasons Resort' },
    { id: 4, name: 'Sky Lounge Dubai' },
    { id: 5, name: 'Marina Sports Bar' }
  ]

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          role: initialData.role || 'Venue Admin',
          location: initialData.location,
          assignedVenues: Array.isArray(initialData.assignedVenues) ? initialData.assignedVenues : [],
          permissions: initialData.permissions || [],
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          role: 'Venue Admin',
          permissions: [],
          assignedVenues: []
        })
      }
    }
  }, [initialData, isOpen, form])

  const handleRoleChange = (role) => {
    let defaultPermissions = []
    if (role === 'Super Admin') {
      defaultPermissions = permissionsList.map(p => p.value)
    } else if (role === 'Admin') {
      defaultPermissions = ['venue_management', 'event_management', 'package_management', 'booking_management', 'approvals', 'payments', 'analytics_access']
    } else if (role === 'Editor') {
      defaultPermissions = ['venue_management', 'event_management', 'package_management']
    } else if (role === 'Bookings & Customer Manager') {
      defaultPermissions = ['booking_management', 'customer_support', 'analytics_access']
    } else if (role === 'Venue Admin') {
      defaultPermissions = ['venue_management', 'event_management', 'booking_management']
    }
    form.setFieldsValue({ permissions: defaultPermissions })
  }

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      await onSubmit(values, !!initialData)
      message.success(initialData ? 'User updated successfully!' : 'User created successfully!')
      onClose()
      form.resetFields()
    } catch (err) {
      message.error('Failed to save user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>{initialData ? 'Edit User' : 'Add New User'}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {initialData ? 'Update user details and permissions' : 'Create a new system administrator or venue manager'}
          </Text>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          role: 'Venue Admin',
          permissions: [],
          assignedVenues: []
        }}
        style={{ marginTop: 24 }}
      >
        {/* Basic Information */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Basic Information</Text>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="john@example.com" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input prefix={<PhoneOutlined />} placeholder="+971 50 123 4567" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Dubai, UAE" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Role & Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Role & Permissions</Text>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="User Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select size="large" onChange={handleRoleChange}>
                  {roles.map(role => (
                    <Option key={role.value} value={role.value}>
                      <Space direction="vertical" size={0}>
                        <Text strong>{role.label}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{role.description}</Text>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="permissions"
                label="Permissions"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    {permissionsList.map(item => (
                      <Col span={12} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Venue Assignment - Conditional */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
        >
          {({ getFieldValue }) =>
            getFieldValue('role') === 'Venue Admin' ? (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Venue Assignment</Text>
                <Form.Item
                  name="assignedVenues"
                  label="Assigned Venues"
                >
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Select venues"
                    optionFilterProp="children"
                  >
                    {venues.map(venue => (
                      <Option key={venue.id} value={venue.id}>{venue.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            ) : null
          }
        </Form.Item>

        <Divider />

        {/* Security */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
            Security {initialData && <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>(Leave blank to keep current)</Text>}
          </Text>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: !initialData, message: 'Please enter password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Min 6 characters" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: !initialData, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Passwords do not match'))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="btn-primary" size="large">
            {initialData ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddUserModal
