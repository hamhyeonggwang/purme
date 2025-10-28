'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Activity, 
  Settings,
  Shield,
  Database,
  TrendingUp,
  Clock,
  Target,
  UserCheck,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { userAPI, trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface QuickStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  averageAccuracy: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  // 권한 확인
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('관리자 권한이 필요합니다')
      window.location.href = '/'
    }
  }, [user])

  // 빠른 통계 로드
  const loadQuickStats = async () => {
    try {
      setLoading(true)
      
      const [usersResponse, trainingResponse] = await Promise.all([
        userAPI.getUsers(),
        trainingAPI.getStats()
      ])

      const users = usersResponse.users || []
      const trainingStats = trainingResponse.overview || {}

      setQuickStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.isActive).length,
        totalSessions: trainingStats.totalSessions || 0,
        averageAccuracy: trainingStats.averageAccuracy || 0
      })
    } catch (error) {
      console.error('빠른 통계 로드 실패:', error)
      toast.error('통계를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadQuickStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">관리자 패널을 불러오는 중...</p>
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

  const adminMenuItems = [
    {
      title: '대시보드',
      description: '시스템 전체 현황 및 통계',
      icon: BarChart3,
      href: '/admin/dashboard',
      color: 'blue',
      stats: quickStats ? `${quickStats.totalUsers}명 사용자` : '로딩 중...'
    },
    {
      title: '사용자 관리',
      description: '사용자 계정 관리 및 권한 설정',
      icon: Users,
      href: '/admin/users',
      color: 'green',
      stats: quickStats ? `${quickStats.activeUsers}명 활성` : '로딩 중...'
    },
    {
      title: '훈련 통계',
      description: '게임 세션 및 성과 분석',
      icon: Activity,
      href: '/admin/training',
      color: 'purple',
      stats: quickStats ? `${quickStats.totalSessions}개 세션` : '로딩 중...'
    },
    {
      title: '데이터 백업',
      description: '데이터 백업 및 복원 관리',
      icon: Database,
      href: '/admin/backup',
      color: 'indigo',
      stats: '백업 관리'
    },
    {
      title: '시스템 설정',
      description: '시스템 구성 및 보안 설정',
      icon: Settings,
      href: '/admin/settings',
      color: 'gray',
      stats: '설정 관리'
    }
  ]

  const quickActions = [
    {
      title: '새 사용자 추가',
      description: '새로운 사용자 계정 생성',
      icon: UserCheck,
      action: () => {
        // 새 사용자 추가 모달 또는 페이지로 이동
        toast.info('새 사용자 추가 기능은 준비 중입니다')
      }
    },
    {
      title: '데이터 백업',
      description: '시스템 데이터 백업',
      icon: Database,
      action: () => {
        toast.info('데이터 백업 기능은 준비 중입니다')
      }
    },
    {
      title: '보안 감사',
      description: '보안 로그 및 접근 기록 확인',
      icon: Shield,
      action: () => {
        toast.info('보안 감사 기능은 준비 중입니다')
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">관리자 패널</h1>
                <p className="text-gray-600 mt-1">Link IT 시스템 관리</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">관리자</p>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 빠른 통계 */}
        {quickStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-2xl font-bold text-gray-900">{quickStats.totalUsers}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.activeUsers}</p>
                </div>
              </div>
            </motion.div>

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
                  <p className="text-2xl font-bold text-gray-900">{quickStats.totalSessions}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">평균 정확도</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.averageAccuracy}%</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 메인 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {adminMenuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group ${
                  item.color === 'blue' ? 'hover:border-blue-300' :
                  item.color === 'green' ? 'hover:border-green-300' :
                  item.color === 'purple' ? 'hover:border-purple-300' :
                  'hover:border-gray-300'
                }`}>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${
                      item.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                      item.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                      item.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                      'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'green' ? 'text-green-600' :
                        item.color === 'purple' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      <p className="text-sm text-gray-500 mt-2">{item.stats}</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 빠른 작업 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={action.action}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
              >
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <action.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 시스템 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">데이터베이스</p>
                <p className="text-sm text-green-600">연결됨</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">보안</p>
                <p className="text-sm text-green-600">정상</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">서버</p>
                <p className="text-sm text-green-600">실행 중</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}