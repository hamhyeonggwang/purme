const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  age: {
    type: Number,
    min: 3,
    max: 18
  },
  grade: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    avatar: String,
    bio: String,
    preferences: {
      theme: { type: String, default: 'light' },
      language: { type: String, default: 'ko' }
    }
  },
  statistics: {
    totalSessions: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // 분 단위
    completedLevels: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true
})

// 인덱스 설정
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// 비밀번호 검증 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// 계정 잠금 확인
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 통계 업데이트 메서드
userSchema.methods.updateStatistics = async function(data) {
  this.statistics.totalSessions += 1
  this.statistics.totalScore += data.score || 0
  this.statistics.totalTimeSpent += data.timeSpent || 0
  
  if (data.levelCompleted) {
    this.statistics.completedLevels += 1
  }
  
  // 평균 정확도 계산
  const totalAccuracy = this.statistics.averageAccuracy * (this.statistics.totalSessions - 1)
  this.statistics.averageAccuracy = Math.round((totalAccuracy + (data.accuracy || 0)) / this.statistics.totalSessions)
  
  return this.save()
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
