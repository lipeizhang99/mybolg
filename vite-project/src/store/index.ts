import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import counterReducer from './slices/counterSlice'
import themeReducer from './slices/themeSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
    auth: authReducer,
  },
})

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

