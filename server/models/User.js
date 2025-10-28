const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '사용자명은 필수입니다'],
    unique: true,
    trim: true,
    minlength: [3, '사용자명은 최소 3자 이상이어야 합니다'],
    maxlength: [20, '사용자명은 최대 20자까지 가능합니다']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 형식이 아닙니다']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true,
    maxlength: [50, '이름은 최대 50자까지 가능합니다']
  },
  age: {
    type: Number,
    min: [7, '나이는 최소 7세 이상이어야 합니다'],
    max: [15, '나이는 최대 15세까지 가능합니다']
  },
  grade: {
    type: String,
    enum: ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3']
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'therapist'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  profile: {
    avatar: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'child'],
        default: 'child'
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
      }
    }
  },
  statistics: {
    totalSessions: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // 분 단위
    completedLevels: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastPlayed: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 가상 필드: 계정 잠금 상태
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  // 비밀번호가 수정되지 않았다면 다음으로
  if (!this.isModified('password')) return next()
  
  try {
    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// 로그인 시도 증가
userSchema.methods.incLoginAttempts = function() {
  // 이미 잠금된 경우
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // 5번 실패 시 2시간 잠금
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2시간
  }
  
  return this.updateOne(updates)
}

// 성공적인 로그인 후 리셋
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  })
}

// 통계 업데이트 메서드
userSchema.methods.updateStatistics = function(sessionData) {
  const { score, accuracy, timeSpent, levelCompleted } = sessionData
  
  this.statistics.totalSessions += 1
  this.statistics.totalScore += score || 0
  this.statistics.totalTimeSpent += timeSpent || 0
  
  // 평균 정확도 계산
  const totalAccuracy = this.statistics.averageAccuracy * (this.statistics.totalSessions - 1)
  this.statistics.averageAccuracy = Math.round((totalAccuracy + (accuracy || 0)) / this.statistics.totalSessions)
  
  if (levelCompleted) {
    this.statistics.completedLevels += 1
  }
  
  this.statistics.lastPlayed = new Date()
  
  return this.save()
}

// 인덱스 설정
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

module.exports = mongoose.model('User', userSchema)
