'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Award,
  BarChart3,
  PlayCircle,
  ArrowRight,
  Brain,
  Eye,
  MousePointer
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
// import { userAPI } from '@/lib/api' // 사용하지 않음

interface TrainingStats {
  totalSessions: number
  totalScore: number
  averageAccuracy: number
  totalTimeSpent: number
  completedLevels: number
  streak: number
  lastPlayed: string
}

interface RecentSession {
  id: string
  trainingType: string
  module: string
  score: number
  accuracy: number
  completedAt: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<TrainingStats>({
    totalSessions: 0,
    totalScore: 0,
    averageAccuracy: 0,
    totalTimeSpent: 0,
    completedLevels: 0,
    streak: 0,
    lastPlayed: ''
  })
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)

  // 로그인하지 않은 경우 리다이렉트
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  // 더미 데이터 로드 (API 연동 준비 중)
  useEffect(() => {
    if (user) {
      // 임시로 더미 데이터 사용
      setTimeout(() => {
        setStats({
          totalSessions: 12,
          totalScore: 1850,
          averageAccuracy: 87,
          totalTimeSpent: 720,
          completedLevels: 8,
          streak: 3,
          lastPlayed: '2025-10-27'
        })
        
        setRecentSessions([
          {
            id: '1',
            trainingType: 'visual',
            module: 'shape_finding',
            score: 150,
            accuracy: 90,
            completedAt: '2025-10-27T10:30:00Z'
          },
          {
            id: '2',
            trainingType: 'cognitive',
            module: 'memory_game',
            score: 120,
            accuracy: 85,
            completedAt: '2025-10-26T15:20:00Z'
          },
          {
            id: '3',
            trainingType: 'visual',
            module: 'shape_finding',
            score: 180,
            accuracy: 95,
            completedAt: '2025-10-25T09:15:00Z'
          }
        ])
        
        setLoading(false)
      }, 1000)
    }
  }, [user])

  const getTrainingTypeIcon = (type: string) => {
    switch (type) {
      case 'visual': return <Eye className="w-5 h-5" />
      case 'cognitive': return <Brain className="w-5 h-5" />
      case 'kiosk': return <MousePointer className="w-5 h-5" />
      default: return <Target className="w-5 h-5" />
    }
  }

  const getTrainingTypeName = (type: string) => {
    switch (type) {
      case 'visual': return '시지각 훈련'
      case 'cognitive': return '인지 훈련'
      case 'kiosk': return '키오스크 훈련'
      default: return '기타 훈련'
    }
  }

  const getModuleName = (module: string) => {
    switch (module) {
      case 'shape_finding': return '도형 찾기'
      case 'memory_game': return '기억력 게임'
      case 'attention_task': return '주의력 과제'
      default: return module
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h2>
          <Link href="/" className="btn-primary">
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-mint-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-mint-500 to-lavender-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">내 대시보드</h1>
                <p className="text-sm text-gray-600">안녕하세요, {user.name}님!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/training" className="btn-primary">
                <PlayCircle className="w-4 h-4 mr-2" />
                훈련 시작
              </Link>
              <Link href="/" className="btn-secondary">
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold text-primary-600 mb-2">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600">총 훈련 횟수</div>
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mt-2" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold text-success-600 mb-2">{stats.totalScore}</div>
            <div className="text-sm text-gray-600">총 점수</div>
            <Star className="w-8 h-8 text-yellow-500 mx-auto mt-2" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold text-warning-600 mb-2">{stats.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">평균 정확도</div>
            <Target className="w-8 h-8 text-orange-500 mx-auto mt-2" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold text-secondary-600 mb-2">{stats.streak}</div>
            <div className="text-sm text-gray-600">연속 훈련</div>
            <Award className="w-8 h-8 text-purple-500 mx-auto mt-2" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최근 훈련 기록 */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
                최근 훈련 기록
              </h2>
              <Link href="/training" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                전체 보기
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {getTrainingTypeIcon(session.trainingType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getTrainingTypeName(session.trainingType)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getModuleName(session.module)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">{session.score}점</div>
                    <div className="text-sm text-gray-600">{session.accuracy}% 정확도</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 훈련 진행률 */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-success-600" />
              훈련 진행률
            </h2>
            
            <div className="space-y-6">
              {/* 시지각 훈련 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-mint-600" />
                    <span className="font-medium text-gray-900">시지각 훈련</span>
                  </div>
                  <span className="text-sm text-gray-600">8/10 완료</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-mint-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* 인지 훈련 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-lavender-600" />
                    <span className="font-medium text-gray-900">인지 훈련</span>
                  </div>
                  <span className="text-sm text-gray-600">5/10 완료</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-lavender-500 h-3 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* 키오스크 훈련 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">키오스크 훈련</span>
                  </div>
                  <span className="text-sm text-gray-600">3/8 완료</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '37.5%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">다음 목표</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                시지각 훈련 2개 더 완료하면 레벨업!
              </p>
            </div>
          </motion.div>
        </div>

        {/* 빠른 액션 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">빠른 시작</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/basic-training" className="card hover:shadow-lg transition-shadow group">
              <div className="text-center">
                <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mint-200 transition-colors">
                  <Eye className="w-8 h-8 text-mint-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">기초 훈련</h3>
                <p className="text-sm text-gray-600 mb-4">시지각 기초 능력 향상</p>
                <div className="flex items-center justify-center text-mint-600 font-medium">
                  시작하기 <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/training" className="card hover:shadow-lg transition-shadow group">
              <div className="text-center">
                <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lavender-200 transition-colors">
                  <Brain className="w-8 h-8 text-lavender-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">인지 훈련</h3>
                <p className="text-sm text-gray-600 mb-4">집중력과 기억력 향상</p>
                <div className="flex items-center justify-center text-lavender-600 font-medium">
                  시작하기 <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/kiosk-training" className="card hover:shadow-lg transition-shadow group">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <MousePointer className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">키오스크 훈련</h3>
                <p className="text-sm text-gray-600 mb-4">실생활 적용 능력 향상</p>
                <div className="flex items-center justify-center text-yellow-600 font-medium">
                  시작하기 <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
