import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { store } from './store'
import Router from './router'
import ThemeProvider from './components/ThemeProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
