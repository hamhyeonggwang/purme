// 간단한 메모리 기반 사용자 저장소 (MongoDB 없이 테스트용)
const users = new Map()
const sessions = new Map()

// 사용자 ID 생성기
let userIdCounter = 1

// 비밀번호 해싱 (간단한 버전)
const hashPassword = (password) => {
  // 실제로는 bcrypt를 사용해야 하지만, 간단한 테스트용으로 구현
  return Buffer.from(password).toString('base64')
}

// 비밀번호 검증
const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword
}

// 사용자 생성
const createUser = (userData) => {
  const userId = `user-${userIdCounter++}`
  const user = {
    id: userId,
    username: userData.username,
    email: userData.email,
    password: hashPassword(userData.password),
    name: userData.name,
    role: userData.role || 'student',
    age: userData.age,
    grade: userData.grade,
    isActive: true,
    createdAt: new Date(),
    statistics: {
      totalSessions: 0,
      totalScore: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      completedLevels: 0,
      currentStreak: 0,
      longestStreak: 0
    }
  }
  
  users.set(userData.username, user)
  console.log(`✅ 새 사용자 생성됨: ${userData.username} (${userData.role})`)
  return user
}

// 사용자 검증 함수
const validateUser = (username, password) => {
  const user = users.get(username)
  if (!user) return null
  
  // 관리자 계정 특별 처리
  if (username === 'admin' && password === 'admin123!') {
    return user
  }
  
  // 일반 사용자 비밀번호 검증
  if (verifyPassword(password, user.password)) {
    return user
  }
  
  return null
}

// 사용자명 중복 확인
const isUsernameExists = (username) => {
  return users.has(username)
}

// 이메일 중복 확인
const isEmailExists = (email) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return true
    }
  }
  return false
}

// 사용자 조회
const getUserByUsername = (username) => {
  return users.get(username)
}

// 사용자 조회 (ID로)
const getUserById = (userId) => {
  for (const user of users.values()) {
    if (user.id === userId) {
      return user
    }
  }
  return null
}

// 모든 사용자 조회
const getAllUsers = () => {
  return Array.from(users.values())
}

// 세션 생성
const createSession = (userId, sessionData) => {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const session = {
    id: sessionId,
    userId,
    ...sessionData,
    startTime: new Date(),
    status: 'in_progress'
  }
  
  sessions.set(sessionId, session)
  return session
}

// 세션 업데이트
const updateSession = (sessionId, updateData) => {
  const session = sessions.get(sessionId)
  if (!session) return null
  
  Object.assign(session, updateData)
  sessions.set(sessionId, session)
  return session
}

// 세션 완료
const completeSession = (sessionId, completionData) => {
  const session = sessions.get(sessionId)
  if (!session) return null
  
  session.status = 'completed'
  session.endTime = new Date()
  Object.assign(session, completionData)
  
  sessions.set(sessionId, session)
  
  // 사용자 통계 업데이트
  const user = getUserById(session.userId)
  if (user) {
    user.statistics.totalSessions += 1
    user.statistics.totalScore += session.score || 0
    user.statistics.totalTimeSpent += session.timeSpent || 0
    
    if (session.levelCompleted) {
      user.statistics.completedLevels += 1
    }
    
    // 평균 정확도 계산
    const totalAccuracy = user.statistics.averageAccuracy * (user.statistics.totalSessions - 1)
    user.statistics.averageAccuracy = Math.round((totalAccuracy + (session.accuracy || 0)) / user.statistics.totalSessions)
  }
  
  return session
}

// 사용자 통계 조회
const getUserStats = (userId) => {
  const user = getUserById(userId)
  if (!user) return null
  
  return user.statistics
}

// 기본 관리자 계정 생성
const createDefaultAdmin = () => {
  const adminUser = {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@linkit.com',
    password: hashPassword('admin123!'),
    name: '시스템 관리자',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    statistics: {
      totalSessions: 0,
      totalScore: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      completedLevels: 0,
      currentStreak: 0,
      longestStreak: 0
    }
  }
  
  users.set('admin', adminUser)
  console.log('✅ 기본 관리자 계정 생성됨: admin / admin123!')
}

// 초기화
createDefaultAdmin()

module.exports = {
  users,
  sessions,
  createUser,
  validateUser,
  isUsernameExists,
  isEmailExists,
  getUserByUsername,
  getUserById,
  getAllUsers,
  createSession,
  updateSession,
  completeSession,
  getUserStats
}
