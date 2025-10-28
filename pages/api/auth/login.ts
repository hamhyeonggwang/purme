// Next.js API Routes - 인증 관련
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from '../lib/database'
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

// 토큰 생성
const generateToken = (user: any) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 토큰 검증 미들웨어
const authenticateToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('액세스 토큰이 필요합니다')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다')
  }
}

// 로그인
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        error: '사용자명과 비밀번호를 입력해주세요'
      })
    }

    // 사용자 찾기
    const user = await User.findOne({ username }).select('+password')
    if (!user) {
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다'
      })
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: '비활성화된 계정입니다'
      })
    }

    const token = generateToken(user)

    res.json({
      message: '로그인 성공',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        age: user.age,
        grade: user.grade
      },
      token
    })

  } catch (error) {
    console.error('로그인 오류:', error)
    res.status(500).json({
      error: '서버 오류가 발생했습니다'
    })
  }
}
