import { Layout } from 'antd'
import { Link } from 'react-router-dom'

const { Content } = Layout

export default function About() {
  return (
    <Content style={{ padding: '50px' }}>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
      <Link to="/">返回首页</Link>
    </Content>
  )
}

