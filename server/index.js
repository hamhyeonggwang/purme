const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Link IT Backend API'
  })
})

// 간단한 인증 API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(400).json({ error: '사용자명과 비밀번호를 입력해주세요' })
  }
  
  res.json({
    message: '로그인 성공',
    user: {
      id: 1,
      username,
      email: 'test@example.com',
      name: '테스트 사용자',
      role: 'student'
    },
    token: 'test-token-' + Date.now()
  })
})

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, name } = req.body
  
  if (!username || !email || !password || !name) {
    return res.status(400).json({ 
      error: '필수 필드가 누락되었습니다',
      fields: ['username', 'email', 'password', 'name']
    })
  }
  
  res.status(201).json({
    message: '회원가입이 완료되었습니다',
    user: {
      id: Date.now(),
      username,
      email,
      name,
      role: 'student'
    },
    token: 'test-token-' + Date.now()
  })
})

// 훈련 세션 API
app.post('/api/training/sessions', (req, res) => {
  const { training_type, module, difficulty } = req.body
  
  res.status(201).json({
    message: '훈련 세션이 시작되었습니다',
    session_id: Date.now(),
    training_type,
    module,
    difficulty,
    start_time: new Date().toISOString()
  })
})

app.put('/api/training/sessions/:sessionId/complete', (req, res) => {
  const { sessionId } = req.params
  const { score, accuracy, time_spent } = req.body
  
  res.json({
    message: '훈련 세션이 완료되었습니다',
    session_id: sessionId,
    score: score || 0,
    accuracy: accuracy || 0,
    time_spent: time_spent || 0,
    completed_at: new Date().toISOString()
  })
})

// 사용자 통계 조회
app.get('/api/user/stats', (req, res) => {
  // 실제로는 데이터베이스에서 사용자별 통계를 조회
  res.json({
    totalSessions: 12,
    totalScore: 1850,
    averageAccuracy: 87,
    totalTimeSpent: 720, // 분
    completedLevels: 8,
    streak: 3,
    lastPlayed: '2025-10-27'
  })
})

// 최근 훈련 기록 조회
app.get('/api/user/recent-sessions', (req, res) => {
  // 실제로는 데이터베이스에서 최근 훈련 기록을 조회
  res.json([
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
})

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Link IT Backend Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔗 Frontend: http://localhost:3000`)
})

module.exports = app
