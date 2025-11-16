import axios, { type AxiosInstance, AxiosError } from 'axios'

// ==================== Axios 实例配置 ====================
/**
 * 创建 axios 请求实例
 * 配置默认的 baseURL 和请求头
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/6875863-6590912-default',
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器（用于添加 token 等）
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器（统一处理错误和 token 过期）
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      const status = error.response.status
      // 401 未授权，可能是 token 过期
      if (status === 401) {
        // 清除本地存储的 token 和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 可以在这里触发 Redux 的 logout action
        // 注意：这里不能直接导入 store，避免循环依赖
        // 建议在组件中处理 401 错误
        console.warn('Token 已过期，请重新登录')
      }
      console.error('API 错误:', status, error.response.data)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误:', error.request)
    } else {
      // 其他错误
      console.error('请求错误:', error.message)
    }
    return Promise.reject(error)
  }
)

// ==================== 类型定义 ====================

/**
 * 通用 API 响应格式
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 图片验证码响应数据
 */
export interface CaptchaResponse {
  captchaId: string
  imageBase64: string
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string
  password: string
  nickname: string
  captchaCode: string
  captchaId: string
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string
  nickname: string
  avatar: string
  role: string
}

// ==================== API 方法 ====================

/**
 * 获取图片验证码
 * @returns Promise<ApiResponse<CaptchaResponse>>
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await getCaptcha()
 *   if (response.code === 200) {
 *     const { captchaId, imageBase64 } = response.data
 *     // 使用 imageBase64 显示验证码图片
 *     // 保存 captchaId 用于后续注册时提交
 *     console.log('验证码ID:', captchaId)
 *   }
 * } catch (error) {
 *   console.error('获取验证码失败:', error)
 * }
 * ```
 */
export async function getCaptcha(): Promise<ApiResponse<CaptchaResponse>> {
  try {
    const response = await apiClient.get<ApiResponse<CaptchaResponse>>('/captcha')
    return response.data
  } catch (error) {
    // 错误已在拦截器中处理，这里可以添加额外的错误处理逻辑
    if (error instanceof AxiosError) {
      throw new Error(`获取验证码失败: ${error.message}`)
    }
    throw error
  }
}

/**
 * 用户注册
 * @param data 注册参数
 * @returns Promise<ApiResponse<null>>
 * 
 * @example
 * ```typescript
 * try {
 *   const registerData: RegisterParams = {
 *     username: 'david01',
 *     password: '123456',
 *     nickname: 'David',
 *     captchaCode: 'aBc1',
 *     captchaId: 'b1a9f50a-abc3-45d1-9b3c-8e1d0c7d894f'
 *   }
 *   const response = await register(registerData)
 *   if (response.code === 200) {
 *     console.log('注册成功:', response.message)
 *   }
 * } catch (error) {
 *   console.error('注册失败:', error)
 * }
 * ```
 */
export async function register(
  data: RegisterParams
): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.post<ApiResponse<null>>('/user/register', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`注册失败: ${error.message}`)
    }
    throw error
  }
}

/**
 * 用户登录
 * @param data 登录参数
 * @returns Promise<ApiResponse<LoginResponse>>
 * 
 * @example
 * ```typescript
 * try {
 *   const loginData: LoginParams = {
 *     username: 'david01',
 *     password: '123456'
 *   }
 *   const response = await login(loginData)
 *   if (response.code === 200) {
 *     const { token, nickname, avatar, role } = response.data
 *     // 保存 token 到 localStorage
 *     localStorage.setItem('token', token)
 *     console.log('登录成功，用户信息:', { nickname, avatar, role })
 *   }
 * } catch (error) {
 *   console.error('登录失败:', error)
 * }
 * ```
 */
export async function login(
  data: LoginParams
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/user/login',
      data
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`登录失败: ${error.message}`)
    }
    throw error
  }
}

// 导出 axios 实例（可选：供其他模块使用）
export { apiClient }

