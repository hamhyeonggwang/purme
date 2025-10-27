'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, TokenManager } from '@/lib/api'

interface User {
  id: number
  username: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (_credentials: { username: string; password: string }) => Promise<void>
  register: (_userData: {
    username: string
    email: string
    password: string
    name: string
    age?: number
    grade?: string
    role?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const token = TokenManager.getToken()
    if (token) {
      // 간단한 사용자 정보 설정 (실제로는 토큰에서 파싱)
      setUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: '테스트 사용자',
        role: 'student'
      })
    }
    setLoading(false)
  }, [])

  const login = async (_credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(_credentials)
      setUser(response.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (_userData: {
    username: string
    email: string
    password: string
    name: string
    age?: number
    grade?: string
    role?: string
  }) => {
    try {
      const response = await authAPI.register(_userData)
      setUser(response.user)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
