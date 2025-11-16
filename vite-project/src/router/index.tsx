import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import About from '../pages/About'
import Login from '../pages/Login'
import Register from '../pages/Register'
// 路由守卫组件，用于保护需要登录的页面
// import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      // 示例：如果需要保护某个页面，可以使用 ProtectedRoute
      // 首先取消上面的注释导入 ProtectedRoute
      // {
      //   path: 'profile',
      //   element: (
      //     <ProtectedRoute>
      //       <Profile />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}

