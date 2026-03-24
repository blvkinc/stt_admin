import React, { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  App,
  Tabs,
  Checkbox
} from 'antd'
import { CalendarOutlined, EnvironmentOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const [activeTab, setActiveTab] = useState('basic')
  const [scheduleType, setScheduleType] = useState('one_time')
  const [recurrencePattern, setRecurrencePattern] = useState('weekly')

  const [packages, setPackages] = useState([])
  const [blackoutDates, setBlackoutDates] = useState([])
  const [occurrenceOverrides, setOccurrenceOverrides] = useState([])

  const categories = [
    'Brunch', 'Nightlife', 'Dining', 'Beach Club', 'Business', 'Family', 'Date Night'
  ]

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const defaultPackage = () => ({
    id: Date.now(),
    name: 'Soft Drinks Package',
    basePrice: 120,
    paymentMode: 'full',
    depositAmount: 0,
    inventory: 120,
    maxBookingsPerDate: 60,
    cutoffHours: 6
  })

  useEffect(() => {
    if (isOpen) {
      if (event) {
        form.setFieldsValue({
          title: event.title,
          category: event.category,
          status: event.status || 'draft',
          date: event.date ? dayjs(event.date) : null,
          location: event.location,
          capacity: event.capacity,
          description: event.description,
          scheduleType: event.scheduleType || 'one_time',
          recurrencePattern: event.recurrence?.pattern || 'weekly',
          recurrenceEnd: event.recurrence?.endDate ? dayjs(event.recurrence.endDate) : null,
          recurrenceDays: event.recurrence?.days || [],
          recurrenceDayOfMonth: event.recurrence?.dayOfMonth || 1,
          recurrenceMonth: event.recurrence?.month || 'jan',
          seoTitle: event.seo?.metaTitle,
          seoDescription: event.seo?.metaDescription,
          seoSlug: event.seo?.slug,
          seoImage: event.seo?.ogImage,
          accessibility: event.accessibility?.join(', '),
          faqTags: event.faqTags || []
        })
        setScheduleType(event.scheduleType || 'one_time')
        setRecurrencePattern(event.recurrence?.pattern || 'weekly')
        setPackages(event.packages || [defaultPackage()])
        setBlackoutDates(event.blackoutDates || [])
        setOccurrenceOverrides(event.occurrenceOverrides || [])
      } else {
        form.resetFields()
        form.setFieldsValue({
          status: 'draft',
          scheduleType: 'one_time',
          recurrencePattern: 'weekly'
        })
        setScheduleType('one_time')
        setRecurrencePattern('weekly')
        setPackages([defaultPackage()])
        setBlackoutDates([])
        setOccurrenceOverrides([])
      }
    }
  }, [isOpen, event, form])

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      const formattedValues = {
        ...values,
        date: values.date ? values.date.toISOString() : null,
        scheduleType,
        recurrence: scheduleType === 'recurring' ? {
          pattern: recurrencePattern,
          endDate: values.recurrenceEnd ? values.recurrenceEnd.format('YYYY-MM-DD') : '',
          days: values.recurrenceDays || [],
          dayOfMonth: values.recurrenceDayOfMonth || 1,
          month: values.recurrenceMonth || 'jan'
        } : null,
        packages,
        blackoutDates,
        occurrenceOverrides,
        seo: {
          metaTitle: values.seoTitle,
          metaDescription: values.seoDescription,
          slug: values.seoSlug,
          ogImage: values.seoImage
        },
        accessibility: values.accessibility ? values.accessibility.split(',').map(item => item.trim()).filter(Boolean) : [],
        faqTags: values.faqTags || []
      }
      await onSave(formattedValues)
      message.success('Event saved successfully!')
      onClose()
    } catch (err) {
      message.error('Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updatePackage = (id, field, value) => {
    setPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg))
  }

  const addPackage = () => {
    setPackages(prev => [...prev, defaultPackage()])
  }

  const removePackage = (id) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id))
  }

  const addBlackoutDate = () => {
    setBlackoutDates(prev => [...prev, dayjs().format('YYYY-MM-DD')])
  }

  const updateBlackoutDate = (index, value) => {
    setBlackoutDates(prev => prev.map((date, i) => i === index ? value : date))
  }

  const removeBlackoutDate = (index) => {
    setBlackoutDates(prev => prev.filter((_, i) => i !== index))
  }

  const addOccurrenceOverride = () => {
    setOccurrenceOverrides(prev => ([
      ...prev,
      { id: Date.now(), date: dayjs().format('YYYY-MM-DD'), status: 'available', inventory: 0 }
    ]))
  }

  const updateOccurrenceOverride = (id, field, value) => {
    setOccurrenceOverrides(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const removeOccurrenceOverride = (id) => {
    setOccurrenceOverrides(prev => prev.filter(row => row.id !== id))
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>{event ? 'Edit Event' : 'Create Event'}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Configure event schedule, packages, and rules</Text>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={980}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={(changed) => {
          if (Object.prototype.hasOwnProperty.call(changed, 'scheduleType')) {
            setScheduleType(changed.scheduleType)
          }
          if (Object.prototype.hasOwnProperty.call(changed, 'recurrencePattern')) {
            setRecurrencePattern(changed.recurrencePattern)
          }
        }}
        style={{ marginTop: 24 }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          {
            key: 'basic',
            label: 'Basic',
            children: (
              <>
                <Form.Item name="title" label="Event Title" rules={[{ required: true, message: 'Please enter event title' }]}>
                  <Input size="large" placeholder="Event Name" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Select category' }]}>
                      <Select placeholder="Select category" size="large">
                        {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Select status' }]}>
                      <Select placeholder="Select status" size="large">
                        {statuses.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="date" label="Date & Time" rules={[{ required: true, message: 'Select date and time' }]}>
                      <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Enter location' }]}>
                      <Input prefix={<EnvironmentOutlined />} placeholder="Venue Location" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="capacity" label="Capacity (Guests)">
                      <InputNumber style={{ width: '100%' }} size="large" min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="scheduleType" label="Schedule Type" rules={[{ required: true, message: 'Select schedule type' }]}>
                      <Select size="large">
                        <Option value="one_time">One-time</Option>
                        <Option value="recurring">Recurring</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="recurrencePattern" label="Recurrence Pattern">
                      <Select size="large" disabled={scheduleType !== 'recurring'}>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {scheduleType === 'recurring' && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="recurrenceEnd" label="Recurrence End">
                        <DatePicker style={{ width: '100%' }} size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="recurrenceDays" label="Repeat Days">
                        <Checkbox.Group options={[
                          { label: 'Mon', value: 'mon' },
                          { label: 'Tue', value: 'tue' },
                          { label: 'Wed', value: 'wed' },
                          { label: 'Thu', value: 'thu' },
                          { label: 'Fri', value: 'fri' },
                          { label: 'Sat', value: 'sat' },
                          { label: 'Sun', value: 'sun' }
                        ]} />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Form.Item name="description" label="Description">
                  <TextArea rows={4} placeholder="Event description..." />
                </Form.Item>
              </>
            )
          },
          {
            key: 'schedule',
            label: 'Schedule & Availability',
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={5}>Blackout Dates</Title>
                  {blackoutDates.map((date, index) => (
                    <Space key={index} style={{ marginBottom: 8 }}>
                      <DatePicker
                        value={date ? dayjs(date) : null}
                        onChange={(value) => updateBlackoutDate(index, value ? value.format('YYYY-MM-DD') : '')}
                      />
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeBlackoutDate(index)} />
                    </Space>
                  ))}
                  <div>
                    <Button onClick={addBlackoutDate} icon={<PlusOutlined />}>Add Blackout Date</Button>
                  </div>
                </div>

                <div>
                  <Title level={5}>Occurrence Overrides</Title>
                  {occurrenceOverrides.map((row) => (
                    <Row key={row.id} gutter={12} align="middle" style={{ marginBottom: 8 }}>
                      <Col span={6}>
                        <DatePicker
                          value={row.date ? dayjs(row.date) : null}
                          onChange={(value) => updateOccurrenceOverride(row.id, 'date', value ? value.format('YYYY-MM-DD') : '')}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Select
                          value={row.status}
                          onChange={(value) => updateOccurrenceOverride(row.id, 'status', value)}
                          style={{ width: '100%' }}
                        >
                          <Option value="available">Available</Option>
                          <Option value="sold_out">Sold Out</Option>
                          <Option value="closed">Closed</Option>
                        </Select>
                      </Col>
                      <Col span={6}>
                        <InputNumber
                          value={row.inventory}
                          onChange={(value) => updateOccurrenceOverride(row.id, 'inventory', value)}
                          style={{ width: '100%' }}
                          min={0}
                          placeholder="Inventory"
                        />
                      </Col>
                      <Col span={4}>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeOccurrenceOverride(row.id)} />
                      </Col>
                    </Row>
                  ))}
                  <Button onClick={addOccurrenceOverride} icon={<PlusOutlined />}>Add Override</Button>
                </div>
              </Space>
            )
          },
          {
            key: 'packages',
            label: 'Packages & Rules',
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {packages.map(pkg => (
                  <Card key={pkg.id} size="small" title={pkg.name} extra={packages.length > 1 ? (
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removePackage(pkg.id)} />
                  ) : null}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="Package Name" required>
                          <Input value={pkg.name} onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Base Price (AED)" required>
                          <InputNumber value={pkg.basePrice} onChange={(value) => updatePackage(pkg.id, 'basePrice', value)} style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Payment Mode" required>
                          <Select value={pkg.paymentMode} onChange={(value) => updatePackage(pkg.id, 'paymentMode', value)}>
                            <Option value="full">Full</Option>
                            <Option value="deposit">Deposit</Option>
                            <Option value="no_upfront">No Upfront</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    {pkg.paymentMode === 'deposit' && (
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Deposit Amount (AED)">
                            <InputNumber value={pkg.depositAmount} onChange={(value) => updatePackage(pkg.id, 'depositAmount', value)} style={{ width: '100%' }} min={0} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="Inventory per Occurrence">
                          <InputNumber value={pkg.inventory} onChange={(value) => updatePackage(pkg.id, 'inventory', value)} style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Max Bookings per Date">
                          <InputNumber value={pkg.maxBookingsPerDate} onChange={(value) => updatePackage(pkg.id, 'maxBookingsPerDate', value)} style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Cutoff (hours)">
                          <InputNumber value={pkg.cutoffHours} onChange={(value) => updatePackage(pkg.id, 'cutoffHours', value)} style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={addPackage} icon={<PlusOutlined />}>Add Package</Button>
              </Space>
            )
          },
          {
            key: 'seo',
            label: 'SEO & FAQs',
            children: (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="seoTitle" label="Meta Title">
                      <Input placeholder="SEO title" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="seoSlug" label="Slug">
                      <Input placeholder="event-slug" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="seoDescription" label="Meta Description">
                  <TextArea rows={3} placeholder="SEO description" />
                </Form.Item>
                <Form.Item name="seoImage" label="OG Image URL">
                  <Input placeholder="https://example.com/og.jpg" />
                </Form.Item>

                <Form.Item name="accessibility" label="Accessibility (comma separated)">
                  <Input placeholder="Wheelchair access, Accessible restrooms" />
                </Form.Item>

                <Form.Item name="faqTags" label="FAQ Tags">
                  <Select mode="tags" placeholder="Add FAQ tags" />
                </Form.Item>
              </>
            )
          }
        ]} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="btn-primary" size="large">
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default EditEventModal
