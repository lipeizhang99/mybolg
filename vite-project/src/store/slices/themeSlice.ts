import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type ThemeConfig, theme } from 'antd'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  primaryColor: string
}

// 从本地存储加载主题设置
const loadThemeFromStorage = (): ThemeState => {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        mode: parsed.mode || 'light',
        primaryColor: parsed.primaryColor || '#1677ff',
      }
    }
  } catch (error) {
    console.error('Failed to load theme from storage:', error)
  }
  return {
    mode: 'light',
    primaryColor: '#1677ff', // Ant Design 默认主色
  }
}

const initialState: ThemeState = loadThemeFromStorage()

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      // 保存到本地存储
      localStorage.setItem('theme', JSON.stringify(state))
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // 保存到本地存储
      localStorage.setItem('theme', JSON.stringify(state))
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload
      // 保存到本地存储
      localStorage.setItem('theme', JSON.stringify(state))
    },
  },
})

export const { setThemeMode, toggleTheme, setPrimaryColor } = themeSlice.actions

// 根据主题模式生成 Ant Design 主题配置
export const getThemeConfig = (state: ThemeState): ThemeConfig => {
  const isDark = state.mode === 'dark'
  
  return {
    token: {
      colorPrimary: state.primaryColor,
      // 浅色模式
      colorBgBase: isDark ? '#0f1419' : '#ffffff',
      colorBgContainer: isDark ? '#1a1f2e' : '#ffffff',
      colorBgElevated: isDark ? '#252b3d' : '#ffffff',
      colorTextBase: isDark ? '#e4e6eb' : '#1f2329',
      colorTextSecondary: isDark ? '#b0b3b8' : '#6b7280',
      colorBorder: isDark ? '#2d3748' : '#e5e7eb',
      colorBorderSecondary: isDark ? '#1a202c' : '#f3f4f6',
      // 阴影
      boxShadow: isDark 
        ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
        : '0 2px 8px rgba(0, 0, 0, 0.08)',
      boxShadowSecondary: isDark
        ? '0 4px 16px rgba(0, 0, 0, 0.5)'
        : '0 4px 16px rgba(0, 0, 0, 0.12)',
      // 圆角
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 4,
      // 字体
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
    },
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Layout: {
        bodyBg: isDark ? '#0f1419' : '#f5f5f5',
        headerBg: isDark ? '#1a1f2e' : '#ffffff',
        headerColor: isDark ? '#e4e6eb' : '#1f2329',
        footerBg: isDark ? '#1a1f2e' : '#ffffff',
        siderBg: isDark ? '#1a1f2e' : '#ffffff',
      },
      Card: {
        borderRadius: 12,
        boxShadow: isDark 
          ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        colorBgContainer: isDark ? '#1a1f2e' : '#ffffff',
      },
      Button: {
        borderRadius: 8,
        controlHeight: 40,
        fontWeight: 500,
      },
      Input: {
        borderRadius: 8,
        controlHeight: 40,
        colorBgContainer: isDark ? '#252b3d' : '#ffffff',
        activeBorderColor: state.primaryColor,
        hoverBorderColor: state.primaryColor,
      },
      Menu: {
        itemBg: isDark ? '#1a1f2e' : '#ffffff',
        itemHoverBg: isDark ? '#252b3d' : '#f5f5f5',
        itemSelectedBg: isDark ? '#252b3d' : '#f0f0f0',
        itemActiveBg: isDark ? '#252b3d' : '#f0f0f0',
      },
    },
  }
}

export default themeSlice.reducer

