import { useEffect } from 'react'
import { ConfigProvider } from 'antd'
import { useAppSelector } from '../store'
import { getThemeConfig } from '../store/slices/themeSlice'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((state) => state.theme)
  const themeConfig = getThemeConfig(theme)

  // 更新 HTML 的 data-theme 属性以支持 CSS 变量
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.mode)
  }, [theme.mode])

  return (
    <ConfigProvider theme={themeConfig}>
      {children}
    </ConfigProvider>
  )
}

