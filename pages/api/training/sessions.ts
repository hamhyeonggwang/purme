// Next.js API Routes - 훈련 세션 관리
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import connectDB from '../lib/database'
import TrainingSession from '../lib/models/TrainingSession'
import User from '../lib/models/User'

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

// 훈련 세션 시작
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    // 토큰 검증
    const decoded = authenticateToken(req)

    // 사용자 찾기
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다'
      })
    }

    const { trainingType, module, difficulty = 'easy', level = 1, sessionData = {} } = req.body

    // 입력 검증
    if (!trainingType || !module) {
      return res.status(400).json({
        error: '필수 필드가 누락되었습니다',
        details: ['trainingType', 'module']
      })
    }

    // 훈련 세션 생성
    const session = new TrainingSession({
      userId: user._id,
      trainingType,
      module,
      difficulty,
      level,
      sessionData
    })

    await session.save()

    res.status(201).json({
      message: '훈련 세션이 시작되었습니다',
      session: {
        id: session._id,
        trainingType: session.trainingType,
        module: session.module,
        difficulty: session.difficulty,
        level: session.level,
        startTime: session.startTime
      }
    })

  } catch (error) {
    console.error('훈련 세션 시작 오류:', error)
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    
    if (errorMessage.includes('토큰')) {
      return res.status(401).json({
        error: errorMessage,
        code: 'AUTH_ERROR'
      })
    }

    res.status(500).json({
      error: '훈련 세션 시작 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
}
