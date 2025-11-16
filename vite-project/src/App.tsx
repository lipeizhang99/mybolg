import { Layout, Menu, Space, Dropdown, Avatar, Button, Typography } from 'antd'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import ThemeToggle from './components/ThemeToggle'
import { useAppDispatch, useAppSelector } from './store'
import { logout } from './store/slices/authSlice'
import './App.css'

const { Header, Content, Footer } = Layout
const { Text } = Typography

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div>
            <Text strong>{userInfo?.nickname || '用户'}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {userInfo?.role || 'USER'}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">关于</Link>,
    },
  ]

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="logo">我的博客</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Space size="middle">
          <ThemeToggle />
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={userInfo?.avatar}
                  icon={<UserOutlined />}
                  size="small"
                />
                <Text style={{ color: '#fff' }}>{userInfo?.nickname}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              登录
            </Button>
          )}
        </Space>
      </Header>
      <Content className="app-content">
        <Outlet />
      </Content>
      <Footer className="app-footer">
        我的博客 ©2024 Created with Vite + React
      </Footer>
    </Layout>
  )
}

export default App
