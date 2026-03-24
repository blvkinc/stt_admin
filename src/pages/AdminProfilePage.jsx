import React, { useState } from 'react'
import { Form, Input, Button, Card, Row, Col, Typography, Avatar, Upload, message, Divider, Tag } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined, SaveOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import SuperAdminLayout from '../components/SuperAdminLayout'
import { useMerchant } from '@shared/context/MerchantContext'

const { Title, Text } = Typography

const AdminProfilePage = () => {
    const { merchant, updateMerchant } = useMerchant() // Reusing merchant context for admin as well
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            updateMerchant(values)
            message.success('Admin profile updated successfully!')
            setLoading(false)
        }, 1000)
    }

    return (
        <SuperAdminLayout>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Title level={2}>Admin Profile</Title>
                <Text type="secondary">System administrator account settings</Text>

                <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                    {/* Profile Card */}
                    <Col xs={24} md={8}>
                        <Card style={{ textAlign: 'center', borderTop: '4px solid #f5222d' }}>
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                                <Avatar
                                    size={120}
                                    src={merchant?.logo}
                                    icon={<SafetyCertificateOutlined />}
                                    style={{ backgroundColor: '#2a0a0a' }}
                                />
                            </div>
                            <Title level={4} style={{ margin: 0 }}>{merchant?.businessName}</Title>
                            <Text type="secondary">{merchant?.email}</Text>

                            <div style={{ marginTop: 16 }}>
                                <Tag color="red">Super Admin</Tag>
                                <Tag color="green">Active</Tag>
                            </div>

                            <Divider />

                            <div style={{ textAlign: 'left' }}>
                                <Text strong>Role:</Text> <Text>System Administrator</Text><br />
                                <Text strong>Joined:</Text> <Text>{merchant?.joinedDate}</Text><br />
                                <Text strong>Last Login:</Text> <Text>Just now</Text>
                            </div>
                        </Card>
                    </Col>

                    {/* Edit Form */}
                    <Col xs={24} md={16}>
                        <Card title="Edit Details" bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={merchant}
                                onFinish={onFinish}
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Display Name" name="businessName" rules={[{ required: true }]}>
                                            <Input prefix={<UserOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                                            <Input prefix={<MailOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Phone Number" name="phone">
                                            <Input prefix={<PhoneOutlined />} size="large" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider orientation="left">Security Credentials</Divider>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="New Password" name="password">
                                            <Input.Password prefix={<LockOutlined />} placeholder="Leave empty to keep current" size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Confirm Password" name="confirmPassword" dependencies={['password']} rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match!'));
                                                },
                                            }),
                                        ]}>
                                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" size="large" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        danger
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        size="large"
                                        style={{
                                            background: 'linear-gradient(90deg, #ff4d4f, #cf1322)',
                                            border: 'none',
                                            boxShadow: '0 4px 10px rgba(255, 77, 79, 0.3)',
                                            fontWeight: 600
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </SuperAdminLayout>
    )
}

export default AdminProfilePage


