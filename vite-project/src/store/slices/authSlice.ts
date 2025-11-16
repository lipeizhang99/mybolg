import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  nickname: string
  avatar: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  userInfo: UserInfo | null
}

// 从 localStorage 加载初始状态
const loadAuthFromStorage = (): AuthState => {
  try {
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')
    
    if (token && userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as UserInfo
      return {
        isAuthenticated: true,
        token,
        userInfo,
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
  
  return {
    isAuthenticated: false,
    token: null,
    userInfo: null,
  }
}

const initialState: AuthState = loadAuthFromStorage()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userInfo: UserInfo }>
    ) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.userInfo = action.payload.userInfo
      // 保存到 localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo))
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.userInfo = null
      // 清除 localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload }
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
      }
    },
  },
})

export const { setCredentials, logout, updateUserInfo } = authSlice.actions

export default authSlice.reducer

