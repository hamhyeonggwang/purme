const express = require('express')
const jwt = require('jsonwebtoken')
const { 
  validateUser, 
  createUser, 
  isUsernameExists, 
  isEmailExists, 
  getUserById 
} = require('../utils/memory-store')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'linkit-super-secret-key-change-in-production'

// 토큰 생성
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      error: '액세스 토큰이 필요합니다',
      code: 'TOKEN_REQUIRED'
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ 
      error: '유효하지 않은 토큰입니다',
      code: 'INVALID_TOKEN'
    })
  }
}

// 회원가입
router.post('/register', (req, res) => {
  try {
    const { username, email, password, name, age, grade, role = 'student' } = req.body

    // 입력 검증
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        error: '필수 필드가 누락되었습니다',
        details: ['username', 'email', 'password', 'name']
      })
    }

    // 사용자명 중복 확인
    if (isUsernameExists(username)) {
      return res.status(409).json({
        error: '이미 사용 중인 사용자명입니다',
        code: 'USERNAME_EXISTS'
      })
    }

    // 이메일 중복 확인
    if (isEmailExists(email)) {
      return res.status(409).json({
        error: '이미 사용 중인 이메일입니다',
        code: 'EMAIL_EXISTS'
      })
    }

    // 사용자 생성
    const user = createUser({
      username,
      email,
      password,
      name,
      age,
      grade,
      role
    })

    // 토큰 생성
    const token = generateToken(user)

    res.status(201).json({
      message: '회원가입이 완료되었습니다',
      user: {
        id: user.id,
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
})

// 로그인
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        error: '사용자명과 비밀번호를 입력해주세요'
      })
    }

    const user = validateUser(username, password)
    if (!user) {
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
        id: user.id,
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
})

// 로그아웃
router.post('/logout', (req, res) => {
  res.json({
    message: '로그아웃되었습니다'
  })
})

// 프로필 조회
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다'
      })
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        age: user.age,
        grade: user.grade,
        statistics: user.statistics,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    res.status(500).json({
      error: '프로필 조회 중 오류가 발생했습니다'
    })
  }
})

// 프로필 업데이트
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, age, grade } = req.body
    const user = getUserById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다'
      })
    }

    // 프로필 업데이트
    if (name) user.name = name
    if (age !== undefined) user.age = age
    if (grade) user.grade = grade

    res.json({
      message: '프로필이 업데이트되었습니다',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        age: user.age,
        grade: user.grade
      }
    })

  } catch (error) {
    res.status(500).json({
      error: '프로필 업데이트 중 오류가 발생했습니다'
    })
  }
})

module.exports = router
