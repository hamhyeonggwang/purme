const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database') // MongoDB 연결 활성화
const {
  securityHeaders,
  apiLimiter,
  requestLogger
} = require('./middleware/auth')

// 라우터 import (MongoDB 연결 시 사용)
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const trainingRoutes = require('./routes/training')

// 간단한 라우터 (MongoDB 없이 사용)
const simpleAuthRoutes = require('./routes/simple-auth')
const simpleTrainingRoutes = require('./routes/simple-training')

const app = express()
const PORT = process.env.PORT || 3001

// 데이터베이스 연결
connectDB()

// 보안 미들웨어
app.use(securityHeaders)

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// 기본 미들웨어
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 요청 로깅
app.use(requestLogger)

// API 요청 제한
app.use('/api', apiLimiter)

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Link IT Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    mode: 'mongodb-connected' // MongoDB 연결 모드 표시
  })
})

// 라우터 설정 (MongoDB 연결 시 우선 사용)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/training', trainingRoutes)

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    error: '요청한 리소스를 찾을 수 없습니다',
    code: 'NOT_FOUND',
    path: req.path
  })
})

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
  console.error('서버 오류:', error)
  
  res.status(error.status || 500).json({
    error: error.message || '서버 내부 오류가 발생했습니다',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Link IT Backend Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`💾 Mode: MongoDB Connected`) // MongoDB 연결 모드 안내
  console.log(`🔐 Admin Login: admin / admin123!`) // 관리자 계정 안내
})

module.exports = app
