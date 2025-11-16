import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 路由守卫组件
 * 用于保护需要登录才能访问的页面
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    // 保存当前路径，登录后可以跳转回来
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

