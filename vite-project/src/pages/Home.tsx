import { Layout, Button, Space, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import { increment, decrement, incrementByAmount } from '../store/slices/counterSlice'

const { Content } = Layout
const { Title, Paragraph } = Typography

export default function Home() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <Content style={{ padding: '50px' }}>
      <Title>首页</Title>
      <Paragraph>欢迎来到我的博客</Paragraph>
      
      <div style={{ marginTop: '30px' }}>
        <Title level={3}>Redux 计数器示例</Title>
        <Paragraph>当前计数: <strong>{count}</strong></Paragraph>
        <Space>
          <Button type="primary" onClick={() => dispatch(increment())}>
            增加
          </Button>
          <Button onClick={() => dispatch(decrement())}>
            减少
          </Button>
          <Button onClick={() => dispatch(incrementByAmount(5))}>
            增加 5
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/about">关于我们</Link>
      </div>
    </Content>
  )
}

