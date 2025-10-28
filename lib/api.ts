const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// 토큰 관리
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token)
  }
}

const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
  }
}

// API 요청 헬퍼
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 인증 API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    if (data.token) {
      setToken(data.token)
    }

    return data
  },

  register: async (userData: {
    username: string
    email: string
    password: string
    name: string
    age?: number
    grade?: string
    role?: string
  }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    if (data.token) {
      setToken(data.token)
    }

    return data
  },

  logout: () => {
    clearTokens()
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile')
  },

  updateProfile: async (profileData: {
    name?: string
    age?: number
    grade?: string
  }) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }
}

// 훈련 API
export const trainingAPI = {
  startSession: async (sessionData: {
    training_type: string
    module: string
    difficulty: string
    level?: number
    sessionData?: any
  }) => {
    return await apiRequest('/training/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  },

  completeSession: async (sessionId: string, sessionData: {
    score?: number
    accuracy?: number
    time_spent?: number
    attempts?: number
    correctAnswers?: number
    totalAnswers?: number
    levelCompleted?: boolean
    feedback?: string[]
  }) => {
    return await apiRequest(`/training/sessions/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    })
  },

  getStats: async () => {
    return await apiRequest('/training/stats')
  },

  getRecentSessions: async () => {
    return await apiRequest('/training/recent-sessions')
  },
}

// 사용자 API (관리자용)
export const userAPI = {
  getUsers: async () => {
    return await apiRequest('/admin/users')
  },
  getUser: async (userId: string) => {
    return await apiRequest(`/admin/users/${userId}`)
  },
  createUser: async (userData: any) => {
    return await apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
  updateUser: async (userId: string, userData: any) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },
  deleteUser: async (userId: string) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    })
  },
}