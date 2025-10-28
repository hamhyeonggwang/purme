const express = require('express')
const { body, validationResult } = require('express-validator')
const TrainingSession = require('../models/TrainingSession')
const User = require('../models/User')
const { authenticateToken, requireOwnershipOrAdmin } = require('../middleware/auth')

const router = express.Router()

// 모든 훈련 라우터에 인증 적용
router.use(authenticateToken)

// 훈련 세션 시작
router.post('/sessions', [
  body('trainingType')
    .isIn(['visual', 'cognitive', 'basic', 'kiosk'])
    .withMessage('올바른 훈련 타입을 선택해주세요'),
  body('module')
    .notEmpty()
    .withMessage('모듈명을 입력해주세요'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('올바른 난이도를 선택해주세요'),
  body('level')
    .optional()
    .isInt({ min: 1 })
    .withMessage('레벨은 1 이상이어야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { trainingType, module, difficulty = 'easy', level = 1, sessionData = {} } = req.body

    // 훈련 세션 생성
    const session = new TrainingSession({
      userId: req.user._id,
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
    res.status(500).json({
      error: '훈련 세션 시작 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 훈련 세션 업데이트
router.put('/sessions/:sessionId', [
  body('score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('점수는 0 이상이어야 합니다'),
  body('accuracy')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('정확도는 0-100 사이여야 합니다'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('소요 시간은 0 이상이어야 합니다'),
  body('attempts')
    .optional()
    .isInt({ min: 0 })
    .withMessage('시도 횟수는 0 이상이어야 합니다'),
  body('correctAnswers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('정답 수는 0 이상이어야 합니다'),
  body('totalAnswers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('총 답변 수는 0 이상이어야 합니다'),
  body('sessionData')
    .optional()
    .isObject()
    .withMessage('세션 데이터는 객체여야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { sessionId } = req.params
    const updateData = req.body

    // 세션 소유권 확인
    const session = await TrainingSession.findOne({
      _id: sessionId,
      userId: req.user._id
    })

    if (!session) {
      return res.status(404).json({
        error: '훈련 세션을 찾을 수 없습니다',
        code: 'SESSION_NOT_FOUND'
      })
    }

    // 세션 업데이트
    Object.assign(session, updateData)
    await session.save()

    res.json({
      message: '훈련 세션이 업데이트되었습니다',
      session: {
        id: session._id,
        score: session.score,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        status: session.status
      }
    })

  } catch (error) {
    console.error('훈련 세션 업데이트 오류:', error)
    res.status(500).json({
      error: '훈련 세션 업데이트 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 훈련 세션 완료
router.put('/sessions/:sessionId/complete', [
  body('score')
    .isInt({ min: 0 })
    .withMessage('점수는 0 이상이어야 합니다'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('정확도는 0-100 사이여야 합니다'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('소요 시간은 0 이상이어야 합니다'),
  body('attempts')
    .optional()
    .isInt({ min: 0 })
    .withMessage('시도 횟수는 0 이상이어야 합니다'),
  body('correctAnswers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('정답 수는 0 이상이어야 합니다'),
  body('totalAnswers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('총 답변 수는 0 이상이어야 합니다'),
  body('levelCompleted')
    .optional()
    .isBoolean()
    .withMessage('레벨 완료 여부는 true/false여야 합니다'),
  body('feedback')
    .optional()
    .isObject()
    .withMessage('피드백은 객체여야 합니다')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 올바르지 않습니다',
        details: errors.array()
      })
    }

    const { sessionId } = req.params
    const { levelCompleted = false, ...sessionData } = req.body

    // 세션 소유권 확인
    const session = await TrainingSession.findOne({
      _id: sessionId,
      userId: req.user._id
    })

    if (!session) {
      return res.status(404).json({
        error: '훈련 세션을 찾을 수 없습니다',
        code: 'SESSION_NOT_FOUND'
      })
    }

    // 세션 완료 처리
    await session.complete(sessionData)

    // 사용자 통계 업데이트
    await req.user.updateStatistics({
      score: sessionData.score,
      accuracy: sessionData.accuracy,
      timeSpent: Math.round(sessionData.timeSpent / 60), // 초를 분으로 변환
      levelCompleted
    })

    res.json({
      message: '훈련 세션이 완료되었습니다',
      session: {
        id: session._id,
        score: session.score,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        completedAt: session.endTime
      },
      userStats: req.user.statistics
    })

  } catch (error) {
    console.error('훈련 세션 완료 오류:', error)
    res.status(500).json({
      error: '훈련 세션 완료 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 사용자 통계 조회
router.get('/stats', async (req, res) => {
  try {
    const { period = 30 } = req.query

    // 사용자 통계 계산
    const completedSessions = await TrainingSession.find({
      userId: req.user._id,
      status: 'completed',
      createdAt: { $gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000) }
    })

    const stats = {
      totalSessions: completedSessions.length,
      totalScore: completedSessions.reduce((sum, session) => sum + (session.score || 0), 0),
      averageAccuracy: completedSessions.length > 0 
        ? Math.round(completedSessions.reduce((sum, session) => sum + (session.accuracy || 0), 0) / completedSessions.length)
        : 0,
      totalTimeSpent: completedSessions.reduce((sum, session) => sum + (session.timeSpent || 0), 0),
      completedLevels: completedSessions.filter(session => session.levelCompleted).length,
      currentStreak: 0,
      longestStreak: 0
    }

    // 최근 훈련 기록
    const recentSessions = await TrainingSession.find({
      userId: req.user._id,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('trainingType module score accuracy timeSpent createdAt')

    // 훈련 타입별 통계
    const statsByType = await TrainingSession.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$trainingType',
          sessions: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracy' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ])

    res.json({
      overview: stats,
      recentSessions,
      statsByType
    })

  } catch (error) {
    console.error('사용자 통계 조회 오류:', error)
    res.status(500).json({
      error: '사용자 통계 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 최근 훈련 기록 조회
router.get('/recent-sessions', async (req, res) => {
  try {
    const { limit = 20, trainingType } = req.query

    const query = {
      userId: req.user._id,
      status: 'completed'
    }

    if (trainingType) {
      query.trainingType = trainingType
    }

    const sessions = await TrainingSession.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('trainingType module score accuracy timeSpent createdAt')

    res.json({ sessions })

  } catch (error) {
    console.error('최근 훈련 기록 조회 오류:', error)
    res.status(500).json({
      error: '최근 훈련 기록 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

// 특정 사용자의 훈련 기록 조회 (치료사/관리자용)
router.get('/users/:userId/sessions', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 50, trainingType, status } = req.query

    const query = { userId }

    if (trainingType) query.trainingType = trainingType
    if (status) query.status = status

    const sessions = await TrainingSession.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name username')

    res.json({ sessions })

  } catch (error) {
    console.error('사용자 훈련 기록 조회 오류:', error)
    res.status(500).json({
      error: '사용자 훈련 기록 조회 중 오류가 발생했습니다',
      code: 'SERVER_ERROR'
    })
  }
})

module.exports = router
