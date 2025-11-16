import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Space, Typography, Row, Col } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { getCaptcha, register, type RegisterParams } from '../api/auth'

const { Title, Text } = Typography

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [captchaId, setCaptchaId] = useState<string>('')
  const [captchaImage, setCaptchaImage] = useState<string>('')
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // 获取验证码
  const fetchCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const response = await getCaptcha()
      if (response.code === 200) {
        setCaptchaId(response.data.captchaId)
        setCaptchaImage(response.data.imageBase64)
      } else {
        message.error(response.message || '获取验证码失败')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取验证码失败')
    } finally {
      setCaptchaLoading(false)
    }
  }

  // 组件挂载时获取验证码
  useEffect(() => {
    fetchCaptcha()
  }, [])

  const onFinish = async (values: RegisterParams) => {
    if (!captchaId) {
      message.warning('请先获取验证码')
      return
    }

    setLoading(true)
    try {
      const registerData: RegisterParams = {
        ...values,
        captchaId,
      }
      const response = await register(registerData)
      if (response.code === 200) {
        message.success('注册成功！请登录')
        // 跳转到登录页
        navigate('/login')
      } else {
        message.error(response.message || '注册失败')
        // 注册失败后刷新验证码
        fetchCaptcha()
        form.setFieldsValue({ captchaCode: '' })
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败，请稍后重试')
      // 注册失败后刷新验证码
      fetchCaptcha()
      form.setFieldsValue({ captchaCode: '' })
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
          maxWidth: 450,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>注册</Title>
          <Text type="secondary">创建新账户，开始您的旅程</Text>
        </div>

        <Form
          form={form}
          name="register"
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
              { max: 20, message: '用户名最多20个字符' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名只能包含字母、数字和下划线',
              },
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
              { max: 20, message: '密码最多20个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 20, message: '昵称最多20个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入昵称"
              autoComplete="nickname"
            />
          </Form.Item>

          <Form.Item
            name="captchaCode"
            label="验证码"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 4, message: '验证码为4位字符' },
            ]}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="请输入验证码"
                  maxLength={4}
                  autoComplete="off"
                />
              </Col>
              <Col span={8}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onClick={fetchCaptcha}
                >
                  {captchaImage ? (
                    <div style={{ position: 'relative', width: '100%', height: 32 }}>
                      <img
                        src={captchaImage}
                        alt="验证码"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                      <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        loading={captchaLoading}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          padding: '0 4px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          fetchCaptcha()
                        }}
                      />
                    </div>
                  ) : (
                    <Button
                      block
                      loading={captchaLoading}
                      onClick={fetchCaptcha}
                      style={{ height: 32 }}
                    >
                      获取验证码
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ height: 40 }}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Space>
              <Text type="secondary">已有账户？</Text>
              <Link to="/login">
                <Text strong style={{ color: '#1890ff' }}>
                  立即登录
                </Text>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}

