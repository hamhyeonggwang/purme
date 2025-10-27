// 간단한 API 클라이언트
const API_BASE_URL = 'http://localhost:3001/api'

// 토큰 관리
export const TokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

// 기본 API 요청 함수
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = TokenManager.getToken()
  
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

// 간단한 인증 API
export const authAPI = {
  register: async (userData: {
    username: string
    email: string
    password: string
    name: string
    age?: number
    grade?: string
    role?: string
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.token) {
      TokenManager.setToken(response.token)
    }
    
    return response
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      TokenManager.setToken(response.token)
    }
    
    return response
  },

  logout: () => {
    TokenManager.removeToken()
  },
}

// 간단한 훈련 API
export const trainingAPI = {
  startSession: async (sessionData: {
    training_type: string
    module: string
    difficulty: string
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
  }) => {
    return await apiRequest(`/training/sessions/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    })
  },
}

// 사용자 API
export const userAPI = {
  getStats: async () => {
    return await apiRequest('/user/stats')
  },

  getRecentSessions: async () => {
    return await apiRequest('/user/recent-sessions')
  },
}
