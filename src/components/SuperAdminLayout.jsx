import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Typography,
  Space,
  Input,
  theme
} from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  ShopOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  SearchOutlined,
  AlertOutlined,
  CreditCardOutlined,
  UserOutlined,
  TagsOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import { useMerchant } from '@shared/context/MerchantContext'
import NotificationCenter from './NotificationCenter'

const { Header, Sider, Content } = Layout
const { Text, Title } = Typography

const SuperAdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { merchant, logoutMerchant } = useMerchant()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  if (!merchant || merchant.role !== 'super_admin') {
    return <Navigate to="/admin/auth" replace />
  }

  const handleLogout = () => {  logoutMerchant();  navigate('/admin/auth');  }

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: '/admin/venues',
      icon: <ShopOutlined />,
      label: <Link to="/admin/venues">Venues</Link>,
    },
    {
      key: '/admin/merchants',
      icon: <TeamOutlined />,
      label: <Link to="/admin/merchants">Merchants</Link>,
    },
    {
      key: '/admin/events',
      icon: <CalendarOutlined />,
      label: <Link to="/admin/events">Events</Link>,
    },
    {
      key: '/admin/packages',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/packages">Packages</Link>,
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
    {
      key: '/admin/faqs',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/admin/faqs">FAQs</Link>,
    },
    {
      key: '/admin/approvals',
      icon: <AlertOutlined />,
      label: <Link to="/admin/approvals">Approvals</Link>,
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/analytics">Analytics</Link>,
    },
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/reports">Reports</Link>,
    },
    {
      key: '/admin/payments',
      icon: <CreditCardOutlined />,
      label: <Link to="/admin/payments">Payments</Link>,
    },
    {
      key: '/admin/system',
      icon: <DatabaseOutlined />,
      label: <Link to="/admin/system">System Health</Link>,
    },
    {
      key: '/admin/logs',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/logs">Logs</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
  ]



  const selectedMenuKey = useMemo(() => {
    const match = menuItems.find((item) => location.pathname.startsWith(item.key))
    return match ? [match.key] : [location.pathname]
  }, [location.pathname, menuItems])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{
          background: '#1a1025', // Dark Brand Purple Theme
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
        breakpoint="lg"
        collapsedWidth="80"
      >
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo */}
          <div style={{
            padding: '24px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'rgba(255,255,255,0.05)'
          }}>
            <Link to="/admin/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
              <Avatar
                size={32}
                icon={<SafetyCertificateOutlined />}
                style={{
                  background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-blue))',
                  flexShrink: 0
                }}
              />
              {!collapsed && (
                <Text strong style={{ fontSize: 18, color: '#fff', letterSpacing: '0.5px' }}>
                  STT Admin
                </Text>
              )}
            </Link>
          </div>

          {/* Admin Info */}
          {!collapsed && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: 8
              }}>
                <Text style={{ color: '#fff', display: 'block', fontWeight: 600 }}>Super Admin</Text>
                <Space align="center" size={4}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>System Online</Text>
                </Space>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedMenuKey}
              items={menuItems}
              style={{
                background: 'transparent',
                border: 'none',
                fontWeight: 500
              }}
            />
          </div>
        </div>
      </Sider>

      <Layout>
        <Header style={{
          background: colorBgContainer,
          padding: '0 24px',
          height: 72,
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 999
        }}>
          <Space>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
              }}
            />

            {/* Search Bar */}
            <div className="hidden md:block">
              <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Search users, venues, logs..."
                style={{
                  width: 300,
                  borderRadius: 8,
                  background: '#f5f5f5',
                  border: 'none',
                  padding: '8px 12px'
                }}
              />
            </div>
          </Space>

          <Space size={16}>
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold">System Healthy</span>
            </div>

            {/* Notifications */}
            <Badge count={3} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18, color: '#595959' }} />}
                shape="circle"
                size="large"
                onClick={() => setNotificationOpen(true)}
              />
            </Badge>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.3s'
                }}
                className="hover:bg-gray-100"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <Space>
                  <div style={{ textAlign: 'right' }} className="hidden md:block">
                    <Text strong style={{ display: 'block', fontSize: 14, color: '#262626' }}>
                      Admin User
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                      Root Access
                    </Text>
                  </div>
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    style={{ background: '#2a0a0a', color: '#fff' }}
                  />
                </Space>
              </div>

              {/* Manual Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '160px',
                    marginTop: '4px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '4px',
                    zIndex: 2000,
                    border: '1px solid #f0f0f0',
                    transformOrigin: 'top right',
                    animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div
                    onClick={() => {
                      navigate('/admin/profile')
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      padding: '6px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#262626',
                      borderRadius: '4px',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <UserOutlined style={{ fontSize: '14px' }} /> <span style={{ fontWeight: 500 }}>Admin Profile</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '2px 0' }} />
                  <div
                    onClick={() => {
                      handleLogout()
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      padding: '6px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ff4d4f',
                      borderRadius: '4px',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff1f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogoutOutlined style={{ fontSize: '14px' }} /> <span style={{ fontWeight: 500 }}>Sign Out</span>
                  </div>
                  {/* Backdrop */}
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: -1,
                      cursor: 'default'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileDropdownOpen(false)
                    }}
                  />
                </div>
              )}
            </div>
          </Space>
        </Header>

        <Content style={{
          margin: '24px',
          padding: 0,
          minHeight: 280,
          background: 'transparent'
        }}>
          {children}
        </Content>

        {/* Notification Drawer Component can be added here */}
        <NotificationCenter
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />
      </Layout>
    </Layout>
  )
}

export default SuperAdminLayout

