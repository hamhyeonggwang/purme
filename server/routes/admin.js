const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const TrainingSession = require('../models/TrainingSession')
const { authenticateToken, requireAdmin, requireTherapist } = require('../middleware/auth')

const router = express.Router()

// 모든 관리자 라우터에 인증 및 권한 확인 적용
router.use(authenticateToken)

// 사용자 목록 조회 (관리자/치료사)
router.get('/users', requireTherapist, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query
    
    const query = {}
    
    if (role) query.role = role
    if (isActive !== undefined) query.isActive = isActive === 'true'
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })

  } catch (error) {
    console.error('사용자 목록 조회 오류:', error)
    res.status(500).json({
      error: '사용자 목록 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 특정 사용자 상세 조회
router.get('/users/:userId', requireTherapist, async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다',
        code: 'USER_NOT_FOUND'
      })
    }

    // 사용자 통계 조회
    const stats = await TrainingSession.getUserStats(userId, 30)
    
    // 최근 훈련 기록
    const recentSessions = await TrainingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name username')

    res.json({
      user,
      statistics: stats,
      recentSessions
    })

  } catch (error) {
    console.error('사용자 상세 조회 오류:', error)
    res.status(500).json({
      error: '사용자 상세 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 사용자 생성 (관리자만)
router.post('/users', requireAdmin, [
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
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다')
    .trim(),
  body('role')
    .isIn(['student', 'therapist', 'admin'])
    .withMessage('올바른 역할을 선택해주세요')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { username, email, password, name, role, age, grade } = req.body

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
      role,
      age,
      grade
    })

    await user.save()

    // 비밀번호 제거 후 응답
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      message: '사용자가 생성되었습니다',
      user: userResponse
    })

  } catch (error) {
    console.error('사용자 생성 오류:', error)
    res.status(500).json({
      error: '사용자 생성 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 사용자 정보 수정 (관리자만)
router.put('/users/:userId', requireAdmin, [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다')
    .trim(),
  body('role')
    .optional()
    .isIn(['student', 'therapist', 'admin'])
    .withMessage('올바른 역할을 선택해주세요'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('활성 상태는 true/false여야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { userId } = req.params
    const { name, role, isActive, age, grade } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (age) updateData.age = age
    if (grade) updateData.grade = grade

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다',
        code: 'USER_NOT_FOUND'
      })
    }

    res.json({
      message: '사용자 정보가 업데이트되었습니다',
      user
    })

  } catch (error) {
    console.error('사용자 수정 오류:', error)
    res.status(500).json({
      error: '사용자 수정 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 사용자 삭제 (관리자만)
router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params

    // 본인 삭제 방지
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        error: '본인 계정은 삭제할 수 없습니다',
        code: 'CANNOT_DELETE_SELF'
      })
    }

    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({
        error: '사용자를 찾을 수 없습니다',
        code: 'USER_NOT_FOUND'
      })
    }

    res.json({
      message: '사용자가 삭제되었습니다'
    })

  } catch (error) {
    console.error('사용자 삭제 오류:', error)
    res.status(500).json({
      error: '사용자 삭제 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 전체 통계 조회
router.get('/statistics', requireTherapist, async (req, res) => {
  try {
    const { period = 30 } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // 전체 통계
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const totalSessions = await TrainingSession.countDocuments({
      status: 'completed',
      createdAt: { $gte: startDate }
    })

    // 사용자 역할별 통계
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])

    // 훈련 타입별 통계
    const sessionsByType = await TrainingSession.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$trainingType',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracy' }
        }
      }
    ])

    // 일별 활동 통계
    const dailyActivity = await TrainingSession.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          sessions: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: '$_id',
          sessions: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ])

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalSessions,
        period: parseInt(period)
      },
      usersByRole,
      sessionsByType,
      dailyActivity
    })

  } catch (error) {
    console.error('통계 조회 오류:', error)
    res.status(500).json({
      error: '통계 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 시스템 설정 조회 (관리자만)
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    // 실제로는 별도의 설정 모델이나 환경변수에서 가져옴
    const settings = {
      system: {
        version: '1.0.0',
        maintenanceMode: false,
        registrationEnabled: true
      },
      training: {
        maxSessionsPerDay: 10,
        defaultDifficulty: 'easy',
        sessionTimeout: 30 // 분
      },
      security: {
        maxLoginAttempts: 5,
        lockoutDuration: 120, // 분
        passwordMinLength: 6
      }
    }

    res.json({ settings })

  } catch (error) {
    console.error('설정 조회 오류:', error)
    res.status(500).json({
      error: '설정 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

module.exports = router
