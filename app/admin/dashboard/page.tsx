'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { userAPI, trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  adminUsers: number
}

interface TrainingStats {
  totalSessions: number
  totalScore: number
  averageAccuracy: number
  totalTimeSpent: number
  completedLevels: number
  sessionsToday: number
}

interface RecentUser {
  id: string
  username: string
  name: string
  email: string
  role: string
  createdAt: string
  lastLogin?: string
  statistics: {
    totalSessions: number
    totalScore: number
    averageAccuracy: number
  }
}

interface RecentSession {
  id: string
  userId: string
  username: string
  trainingType: string
  module: string
  score: number
  accuracy: number
  timeSpent: number
  completedAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // 권한 확인
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('관리자 권한이 필요합니다')
      window.location.href = '/'
    }
  }, [user])

  // 데이터 로드
  const loadDashboardData = async () => {
    try {
      setRefreshing(true)
      
      // 사용자 통계 로드
      const usersResponse = await userAPI.getUsers()
      const users = usersResponse.users || []
      
      const today = new Date().toDateString()
      const newUsersToday = users.filter((u: any) => 
        new Date(u.createdAt).toDateString() === today
      ).length
      
      const activeUsers = users.filter((u: any) => u.isActive).length
      const adminUsers = users.filter((u: any) => u.role === 'admin').length
      
      setUserStats({
        totalUsers: users.length,
        activeUsers,
        newUsersToday,
        adminUsers
      })

      // 최근 사용자 (최근 5명)
      setRecentUsers(users.slice(0, 5))

      // 훈련 통계 로드
      const trainingResponse = await trainingAPI.getStats()
      const stats = trainingResponse.overview || {}
      
      const sessionsToday = trainingResponse.recentSessions?.filter((s: any) => 
        new Date(s.completedAt).toDateString() === today
      ).length || 0

      setTrainingStats({
        totalSessions: stats.totalSessions || 0,
        totalScore: stats.totalScore || 0,
        averageAccuracy: stats.averageAccuracy || 0,
        totalTimeSpent: stats.totalTimeSpent || 0,
        completedLevels: stats.completedLevels || 0,
        sessionsToday
      })

      // 최근 세션 (최근 10개)
      setRecentSessions(trainingResponse.recentSessions?.slice(0, 10) || [])

    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error)
      toast.error('데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData()
    }
  }, [user])

  // 데이터 새로고침
  const handleRefresh = () => {
    loadDashboardData()
  }

  // 데이터 내보내기
  const handleExport = () => {
    const data = {
      userStats,
      trainingStats,
      recentUsers,
      recentSessions,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-dashboard-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('데이터가 내보내기되었습니다')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">접근 권한 없음</h1>
          <p className="text-gray-600">관리자 권한이 필요합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">Link IT 시스템 관리</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                새로고침
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 사용자 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{userStats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <UserCheck className="w-4 h-4 mr-1" />
              활성: {userStats?.activeUsers || 0}명
            </div>
          </motion.div>

          {/* 오늘 신규 사용자 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오늘 신규</p>
                <p className="text-2xl font-bold text-gray-900">{userStats?.newUsersToday || 0}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              오늘 가입
            </div>
          </motion.div>

          {/* 총 훈련 세션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 세션</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats?.totalSessions || 0}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Target className="w-4 h-4 mr-1" />
              오늘: {trainingStats?.sessionsToday || 0}개
            </div>
          </motion.div>

          {/* 평균 정확도 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 정확도</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats?.averageAccuracy || 0}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              전체 평균
            </div>
          </motion.div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최근 사용자 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">최근 가입 사용자</h3>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user.role}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">최근 가입 사용자가 없습니다</p>
              )}
            </div>
          </motion.div>

          {/* 최근 훈련 세션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">최근 훈련 세션</h3>
            </div>
            <div className="p-6">
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{session.username}</p>
                          <p className="text-sm text-gray-600">{session.module}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{session.score}점</p>
                        <p className="text-xs text-gray-500">{session.accuracy}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">최근 훈련 세션이 없습니다</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* 추가 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">시스템 통계</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{trainingStats?.totalScore || 0}</div>
                <div className="text-sm text-gray-600">총 점수</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Math.round((trainingStats?.totalTimeSpent || 0) / 60)}</div>
                <div className="text-sm text-gray-600">총 훈련 시간 (분)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{trainingStats?.completedLevels || 0}</div>
                <div className="text-sm text-gray-600">완료된 레벨</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
