import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Space, Typography } from 'antd'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, type LoginParams } from '../api/auth'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

const { Title, Text } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // 如果已登录，重定向到首页或来源页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const onFinish = async (values: LoginParams) => {
    setLoading(true)
    try {
      const response = await login(values)
      // if (response.code === 200) {
      if (response.code) {
        const { token, nickname, avatar, role } = response.data
        // 使用 Redux 保存用户信息
        dispatch(
          setCredentials({
            token,
            userInfo: { nickname, avatar, role },
          })
        )
        message.success('登录成功！')
        // 跳转到来源页面或首页
        const from = (location.state as { from?: string })?.from || '/'
        navigate(from, { replace: true })
      } else {
        message.error(response.message || '登录失败')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>登录</Title>
          <Text type="secondary">欢迎回来，请登录您的账户</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ height: 40 }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Space>
              <Text type="secondary">还没有账户？</Text>
              <Link to="/register">
                <Text strong style={{ color: '#1890ff' }}>
                  立即注册
                </Text>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}

