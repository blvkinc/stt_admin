import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Button, Steps, Upload, TimePicker, Checkbox, Row, Col, Typography, Space, Divider, App, InputNumber } from 'antd'
import {
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  PlusOutlined,
  InboxOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

const AddVenueModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const categories = [
    'Fine Dining', 'Casual Dining', 'Rooftop Bar', 'Beach Club', 'Sports Bar',
    'Night Club', 'Cafe', 'Fast Food', 'Food Court'
  ]

  const cuisineTypes = [
    'International', 'Arabic', 'Italian', 'Japanese', 'Chinese', 'Indian',
    'French', 'Mediterranean', 'American', 'Thai', 'Mexican'
  ]

  const amenitiesList = [
    'Valet Parking', 'Free WiFi', 'Live Music', 'Outdoor Seating', 'Private Dining',
    'Kids Area', 'Wheelchair Accessible', 'Air Conditioning', 'Smoking Area', 'Pet Friendly'
  ]

  const specialFeaturesList = [
    'Ocean View', 'City View', 'Rooftop Terrace', 'Private Beach', 'Pool Access',
    'Spa Services', 'Conference Rooms', 'Event Space', 'Live Entertainment', 'Celebrity Chef'
  ]

  const venueAdmins = [
    { id: 1, name: 'Ahmed Al-Rashid' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Chen' }
  ]

  const steps = [
    { title: 'Basic Info', icon: <BankOutlined /> },
    { title: 'Location & Contact', icon: <EnvironmentOutlined /> },
    { title: 'Details', icon: <ClockCircleOutlined /> },
    { title: 'Assignment', icon: <UserOutlined /> }
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      if (initialData) {
        // Transform operating hours if needed, assumed string 'HH:mm' for now
        // Ant Design TimePicker needs dayjs objects if we were using it strictly,
        // but to keep it simple with existing data structure which uses strings:
        // We will stick to the existing data structure for operating hours but maybe render inputs or simple time pickers.
        // For this migration, to avoid complex date parsing issues with the mock data, we will use simple inputs for time or strictly handle string <-> dayjs.
        // Let's use simple inputs for time to match the existing string format '10:00' easily.

        form.setFieldsValue({
          ...initialData,
          venueName: initialData.venueName || initialData.name,
          address: initialData.address || initialData.location,
          // Images handling would be distinct
        })
        if (initialData.images) {
          // Mock file list for display if needed, or just skip for now as actual upload is not fully wired
          setFileList(initialData.images.map((img, index) => ({ uid: index, name: `Image ${index}`, status: 'done', url: img })))
        }
      } else {
        form.resetFields()
        setFileList([])
        // Set default operating hours
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        const defaultHours = {}
        days.forEach(day => {
          defaultHours[day] = { open: '10:00', close: '23:00', closed: false }
        })
        form.setFieldsValue({ operatingHours: defaultHours, city: 'Dubai', country: 'UAE' })
      }
    }
  }, [initialData, isOpen, form])

  const next = async () => {
    try {
      // Validate fields for current step
      let fieldsToValidate = []
      switch (currentStep) {
        case 0:
          fieldsToValidate = ['venueName', 'category', 'description', 'cuisineType', 'priceRange']
          break
        case 1:
          fieldsToValidate = ['address', 'city', 'country', 'contactName', 'contactEmail', 'contactPhone']
          break
        // Add other steps validation if critical
      }
      await form.validateFields(fieldsToValidate)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      // Validation failed
    }
  }

  const prev = () => setCurrentStep(currentStep - 1)

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      const formData = { ...values, images: fileList } // simple mock of images
      await onSubmit(formData, !!initialData)
      message.success(initialData ? 'Venue updated successfully!' : 'Venue created successfully!')
      onClose()
    } catch (err) {
      message.error('Failed to save venue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="venueName"
                  label="Venue Name"
                  rules={[{ required: true, message: 'Please enter venue name' }]}
                >
                  <Input prefix={<BankOutlined />} placeholder="e.g., Burj Al Arab - Al Muntaha" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select placeholder="Select category" size="large">
                    {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Describe the venue..." />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="cuisineType" label="Cuisine Type">
                  <Select placeholder="Select cuisine" size="large">
                    {cuisineTypes.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priceRange" label="Price Range">
                  <Select placeholder="Select price range" size="large">
                    <Option value="AED 50-150">AED 50-150</Option>
                    <Option value="AED 150-300">AED 150-300</Option>
                    <Option value="AED 300-500">AED 300-500</Option>
                    <Option value="AED 500+">AED 500+</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      case 1: // Location & Contact
        return (
          <>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="Street address" size="large" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="city" label="City">
                  <Input placeholder="Dubai" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="country" label="Country">
                  <Input placeholder="UAE" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Contact Information</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="contactName" label="Contact Name">
                  <Input prefix={<UserOutlined />} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactEmail"
                  label="Email"
                  rules={[{ required: true, message: 'Required' }, { type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="contactPhone" label="Phone">
                  <Input prefix={<PhoneOutlined />} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      case 2: // Details
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="capacity" label="Capacity">
                  <InputNumber style={{ width: '100%' }} size="large" placeholder="Max guests" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="amenities" label="Amenities">
              <Select mode="multiple" placeholder="Select amenities" size="large">
                {amenitiesList.map(a => <Option key={a} value={a}>{a}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="specialFeatures" label="Special Features">
              <Select mode="multiple" placeholder="Select special features" size="large">
                {specialFeaturesList.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>
            {/* Operating Hours - Simplified for migration */}
            <Divider orientation="left">Operating Hours (Defaults)</Divider>
            <Text type="secondary">Standard hours 10:00 - 23:00 applied. Detailed schedule editing available after creation.</Text>
          </>
        )
      case 3: // Assignment & Images
        return (
          <>
            <Form.Item name="assignedAdmin" label="Assigned Admin">
              <Select placeholder="Select a venue admin" size="large">
                {venueAdmins.map(admin => (
                  <Option key={admin.id} value={admin.id}>{admin.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Venue Images">
              <Dragger
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Manual upload
                multiple
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strict prohibited from uploading company data or other banned files.
                </p>
              </Dragger>
            </Form.Item>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>{initialData ? 'Edit Venue' : 'Add New Venue'}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</Text>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24, marginTop: 12 }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{}}
      >
        <div style={{ minHeight: 300 }}>
          {renderStepContent()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          {currentStep > 0 ? (
            <Button onClick={prev} size="large">
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          <Space>
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={next} className="btn-primary" size="large">
                Next Step
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" loading={loading} className="btn-primary" size="large">
                {initialData ? 'Update Venue' : 'Create Venue'}
              </Button>
            )}
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default AddVenueModal