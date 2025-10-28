const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const { verifyToken, extractUserFromToken } = require('../utils/jwt')
const User = require('../models/User')

// 기본 보안 헤더 설정
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
})

// 로그인 시도 제한
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5번 시도
  message: {
    error: '너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
})

// API 요청 제한
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100번 요청
  message: {
    error: '너무 많은 요청이 있었습니다. 잠시 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// 인증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: '액세스 토큰이 필요합니다',
        code: 'TOKEN_REQUIRED'
      })
    }

    const userInfo = extractUserFromToken(token)
    
    // 사용자 존재 확인 및 활성 상태 확인
    const user = await User.findById(userInfo.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ 
        error: '사용자를 찾을 수 없습니다',
        code: 'USER_NOT_FOUND'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: '비활성화된 계정입니다',
        code: 'ACCOUNT_INACTIVE'
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ 
      error: '유효하지 않은 토큰입니다',
      code: 'INVALID_TOKEN'
    })
  }
}

// 관리자 권한 확인
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: '인증이 필요합니다',
      code: 'AUTHENTICATION_REQUIRED'
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: '관리자 권한이 필요합니다',
      code: 'ADMIN_REQUIRED'
    })
  }

  next()
}

// 치료사 권한 확인
const requireTherapist = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: '인증이 필요합니다',
      code: 'AUTHENTICATION_REQUIRED'
    })
  }

  if (!['admin', 'therapist'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: '치료사 또는 관리자 권한이 필요합니다',
      code: 'THERAPIST_REQUIRED'
    })
  }

  next()
}

// 사용자 본인 또는 관리자 확인
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: '인증이 필요합니다',
      code: 'AUTHENTICATION_REQUIRED'
    })
  }

  const targetUserId = req.params.userId || req.body.userId
  const isOwner = req.user._id.toString() === targetUserId
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ 
      error: '본인의 데이터이거나 관리자 권한이 필요합니다',
      code: 'OWNERSHIP_OR_ADMIN_REQUIRED'
    })
  }

  next()
}

// 요청 로깅 미들웨어
const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.userId || 'anonymous'
    }
    
    console.log(`[${new Date().toISOString()}] ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`)
  })
  
  next()
}

module.exports = {
  securityHeaders,
  loginLimiter,
  apiLimiter,
  authenticateToken,
  requireAdmin,
  requireTherapist,
  requireOwnershipOrAdmin,
  requestLogger
}
