const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'linkit-super-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

// 액세스 토큰 생성
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'linkit-api',
    audience: 'linkit-client'
  })
}

// 리프레시 토큰 생성
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'linkit-api',
    audience: 'linkit-client'
  })
}

// 토큰 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'linkit-api',
      audience: 'linkit-client'
    })
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다')
  }
}

// 토큰에서 사용자 정보 추출
const extractUserFromToken = (token) => {
  try {
    const decoded = verifyToken(token)
    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    }
  } catch (error) {
    throw new Error('토큰에서 사용자 정보를 추출할 수 없습니다')
  }
}

// 토큰 페이로드 생성
const createTokenPayload = (user) => {
  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  extractUserFromToken,
  createTokenPayload,
  JWT_SECRET
}
