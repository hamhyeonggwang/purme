// Next.js API Routes - 훈련 세션 완료
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { connectDB } from '../../../lib/database'
import TrainingSession from '../../../lib/models/TrainingSession'
import User from '../../../lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'linkit-super-secret-key-change-in-production-2024'

// MongoDB 연결
let isConnected = false
const connectToDatabase = async () => {
  if (isConnected) return
  try {
    await connectDB()
    isConnected = true
  } catch (error) {
    console.error('MongoDB 연결 실패:', error)
  }
}

// 토큰 검증
const authenticateToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('액세스 토큰이 필요합니다')
  }

  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다')
  }
}

// 훈련 세션 완료
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    // 토큰 검증
    const decoded = authenticateToken(req)

    const { sessionId } = req.query
    const { score, accuracy, timeSpent, levelCompleted = false } = req.body

    if (!sessionId) {
      return res.status(400).json({
        error: '세션 ID가 필요합니다'
      })
    }

    // 훈련 세션 찾기
    const session = await TrainingSession.findOne({
      _id: sessionId,
      userId: decoded.userId,
      status: 'in_progress'
    })

    if (!session) {
      return res.status(404).json({
        error: '진행 중인 훈련 세션을 찾을 수 없습니다',
        code: 'SESSION_NOT_FOUND'
      })
    }

    // 세션 완료 처리
    session.status = 'completed'
    session.endTime = new Date()
    if (score !== undefined) session.score = score
    if (accuracy !== undefined) session.accuracy = accuracy
    if (timeSpent !== undefined) session.timeSpent = timeSpent
    session.levelCompleted = levelCompleted

    await session.save()

    // 사용자 통계 업데이트
    const user = await User.findById(decoded.userId)
    if (user) {
      user.statistics.totalSessions += 1
      user.statistics.totalScore += session.score || 0
      user.statistics.totalTimeSpent += Math.round((session.timeSpent || 0) / 60) // 초를 분으로 변환

      if (session.levelCompleted) {
        user.statistics.completedLevels += 1
      }

      // 평균 정확도 계산
      const totalAccuracy = user.statistics.averageAccuracy * (user.statistics.totalSessions - 1)
      user.statistics.averageAccuracy = Math.round((totalAccuracy + (session.accuracy || 0)) / user.statistics.totalSessions)

      await user.save()
    }

    res.json({
      message: '훈련 세션이 완료되었습니다',
      session: {
        id: session._id,
        score: session.score,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        completedAt: session.endTime
      },
      userStats: user?.statistics
    })

  } catch (error) {
    console.error('훈련 세션 완료 오류:', error)
    
    if (error.message.includes('토큰')) {
      return res.status(401).json({
        error: error.message,
        code: 'AUTH_ERROR'
      })
    }

    res.status(500).json({
      error: '훈련 세션 완료 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
}
