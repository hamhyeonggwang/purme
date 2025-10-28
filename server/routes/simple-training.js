const express = require('express')
const jwt = require('jsonwebtoken')
const { createSession, updateSession, completeSession, getUserStats } = require('../utils/memory-store')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'linkit-super-secret-key-change-in-production'

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

// 모든 훈련 라우터에 인증 적용
router.use(authenticateToken)

// 훈련 세션 시작
router.post('/sessions', (req, res) => {
  try {
    const { trainingType, module, difficulty = 'easy', level = 1 } = req.body

    if (!trainingType || !module) {
      return res.status(400).json({
        error: '훈련 타입과 모듈을 입력해주세요'
      })
    }

    const session = createSession(req.user.userId, {
      trainingType,
      module,
      difficulty,
      level
    })

    res.status(201).json({
      message: '훈련 세션이 시작되었습니다',
      session: {
        id: session.id,
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
      error: '훈련 세션 시작 중 오류가 발생했습니다'
    })
  }
})

// 훈련 세션 업데이트
router.put('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const updateData = req.body

    const session = updateSession(sessionId, updateData)
    if (!session) {
      return res.status(404).json({
        error: '훈련 세션을 찾을 수 없습니다'
      })
    }

    res.json({
      message: '훈련 세션이 업데이트되었습니다',
      session: {
        id: session.id,
        score: session.score,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        status: session.status
      }
    })

  } catch (error) {
    console.error('훈련 세션 업데이트 오류:', error)
    res.status(500).json({
      error: '훈련 세션 업데이트 중 오류가 발생했습니다'
    })
  }
})

// 훈련 세션 완료
router.put('/sessions/:sessionId/complete', (req, res) => {
  try {
    const { sessionId } = req.params
    const { score, accuracy, timeSpent, levelCompleted = false } = req.body

    if (score === undefined || accuracy === undefined || timeSpent === undefined) {
      return res.status(400).json({
        error: '점수, 정확도, 소요시간을 입력해주세요'
      })
    }

    const session = completeSession(sessionId, {
      score,
      accuracy,
      timeSpent,
      levelCompleted
    })

    if (!session) {
      return res.status(404).json({
        error: '훈련 세션을 찾을 수 없습니다'
      })
    }

    // 사용자 통계 조회
    const stats = getUserStats(req.user.userId)

    res.json({
      message: '훈련 세션이 완료되었습니다',
      session: {
        id: session.id,
        score: session.score,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        completedAt: session.endTime
      },
      userStats: stats
    })

  } catch (error) {
    console.error('훈련 세션 완료 오류:', error)
    res.status(500).json({
      error: '훈련 세션 완료 중 오류가 발생했습니다'
    })
  }
})

// 사용자 통계 조회
router.get('/stats', (req, res) => {
  try {
    const stats = getUserStats(req.user.userId)
    
    res.json({
      overview: stats,
      recentSessions: [],
      statsByType: []
    })

  } catch (error) {
    console.error('사용자 통계 조회 오류:', error)
    res.status(500).json({
      error: '사용자 통계 조회 중 오류가 발생했습니다'
    })
  }
})

// 최근 훈련 기록 조회
router.get('/recent-sessions', (req, res) => {
  try {
    const { sessions } = require('../utils/memory-store')
    const userSessions = Array.from(sessions.values())
      .filter(s => s.userId === req.user.userId && s.status === 'completed')
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
      .slice(0, 10)

    res.json({ 
      sessions: userSessions.map(s => ({
        id: s.id,
        trainingType: s.trainingType,
        module: s.module,
        score: s.score,
        accuracy: s.accuracy,
        timeSpent: s.timeSpent,
        createdAt: s.endTime
      }))
    })

  } catch (error) {
    console.error('최근 훈련 기록 조회 오류:', error)
    res.status(500).json({
      error: '최근 훈련 기록 조회 중 오류가 발생했습니다'
    })
  }
})

module.exports = router
