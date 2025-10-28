// Next.js API Routes - 회원가입
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

// 회원가입
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    const { username, email, password, name, age, grade, role = 'student' } = req.body

    // 입력 검증
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        error: '필수 필드가 누락되었습니다',
        details: ['username', 'email', 'password', 'name']
      })
    }

    // 사용자명 중복 확인
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({
        error: '이미 사용 중인 사용자명입니다',
        code: 'USERNAME_EXISTS'
      })
    }

    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(409).json({
        error: '이미 사용 중인 이메일입니다',
        code: 'EMAIL_EXISTS'
      })
    }

    // 비밀번호 해싱
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 사용자 생성
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      role,
      age,
      grade,
      isActive: true
    })

    await user.save()

    const token = generateToken(user)

    res.status(201).json({
      message: '회원가입이 완료되었습니다',
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
    console.error('회원가입 오류:', error)
    res.status(500).json({
      error: '서버 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
}
