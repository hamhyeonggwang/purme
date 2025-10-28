const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { 
  generateAccessToken, 
  generateRefreshToken, 
  createTokenPayload 
} = require('../utils/jwt')
const { loginLimiter } = require('../middleware/auth')

const router = express.Router()

// 회원가입
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('사용자명은 3-20자 사이여야 합니다')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다'),
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식이 아닙니다')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문과 숫자를 포함해야 합니다'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다')
    .trim(),
  body('age')
    .optional()
    .isInt({ min: 7, max: 15 })
    .withMessage('나이는 7-15세 사이여야 합니다'),
  body('grade')
    .optional()
    .isIn(['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3'])
    .withMessage('올바른 학년을 선택해주세요'),
  body('role')
    .optional()
    .isIn(['student', 'therapist'])
    .withMessage('올바른 역할을 선택해주세요')
], async (req, res) => {
  try {
    // 입력 검증
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { username, email, password, name, age, grade, role = 'student' } = req.body

    // 중복 확인
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.username === username 
          ? '이미 사용 중인 사용자명입니다' 
          : '이미 사용 중인 이메일입니다',
        code: 'USER_EXISTS'
      })
    }

    // 사용자 생성
    const user = new User({
      username,
      email,
      password,
      name,
      age,
      grade,
      role
    })

    await user.save()

    // 토큰 생성
    const payload = createTokenPayload(user)
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken({ userId: user._id })

    // 비밀번호 제거 후 응답
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      message: '회원가입이 완료되었습니다',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken
      }
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
router.post('/login', loginLimiter, [
  body('username')
    .notEmpty()
    .withMessage('사용자명을 입력해주세요'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요')
], async (req, res) => {
  try {
    // 입력 검증
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '사용자명과 비밀번호를 입력해주세요',
        details: errors.array()
      })
    }

    const { username, password } = req.body

    // 사용자 찾기
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // 계정 잠금 확인
    if (user.isLocked) {
      return res.status(423).json({
        error: '계정이 잠겼습니다. 잠시 후에 다시 시도해주세요',
        code: 'ACCOUNT_LOCKED'
      })
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      await user.incLoginAttempts()
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // 활성 상태 확인
    if (!user.isActive) {
      return res.status(401).json({
        error: '비활성화된 계정입니다',
        code: 'ACCOUNT_INACTIVE'
      })
    }

    // 로그인 성공 처리
    await user.resetLoginAttempts()

    // 토큰 생성
    const payload = createTokenPayload(user)
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken({ userId: user._id })

    // 비밀번호 제거 후 응답
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      message: '로그인 성공',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    console.error('로그인 오류:', error)
    res.status(500).json({
      error: '서버 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 토큰 갱신
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        error: '리프레시 토큰이 필요합니다',
        code: 'REFRESH_TOKEN_REQUIRED'
      })
    }

    const { verifyToken } = require('../utils/jwt')
    const decoded = verifyToken(refreshToken)

    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: '유효하지 않은 사용자입니다',
        code: 'INVALID_USER'
      })
    }

    // 새 토큰 생성
    const payload = createTokenPayload(user)
    const newAccessToken = generateAccessToken(payload)
    const newRefreshToken = generateRefreshToken({ userId: user._id })

    res.json({
      message: '토큰이 갱신되었습니다',
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    })

  } catch (error) {
    res.status(401).json({
      error: '유효하지 않은 리프레시 토큰입니다',
      code: 'INVALID_REFRESH_TOKEN'
    })
  }
})

// 로그아웃
router.post('/logout', (req, res) => {
  // 클라이언트에서 토큰을 삭제하도록 안내
  res.json({
    message: '로그아웃되었습니다'
  })
})

// 프로필 조회
router.get('/profile', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({
      user
    })
  } catch (error) {
    res.status(500).json({
      error: '프로필 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 프로필 업데이트
router.put('/profile', require('../middleware/auth').authenticateToken, [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다')
    .trim(),
  body('age')
    .optional()
    .isInt({ min: 7, max: 15 })
    .withMessage('나이는 7-15세 사이여야 합니다'),
  body('grade')
    .optional()
    .isIn(['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3'])
    .withMessage('올바른 학년을 선택해주세요')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { name, age, grade } = req.body
    const updateData = {}

    if (name) updateData.name = name
    if (age) updateData.age = age
    if (grade) updateData.grade = grade

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: '프로필이 업데이트되었습니다',
      user
    })

  } catch (error) {
    res.status(500).json({
      error: '프로필 업데이트 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

module.exports = router
