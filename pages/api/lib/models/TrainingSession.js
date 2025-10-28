const mongoose = require('mongoose')

const trainingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainingType: {
    type: String,
    required: true,
    enum: ['visual', 'cognitive', 'basic', 'kiosk']
  },
  module: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  score: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0 // 초 단위
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  levelCompleted: {
    type: Boolean,
    default: false
  },
  sessionData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  feedback: [{
    type: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
})

// 인덱스 설정
trainingSessionSchema.index({ userId: 1, createdAt: -1 })
trainingSessionSchema.index({ trainingType: 1 })
trainingSessionSchema.index({ module: 1 })
trainingSessionSchema.index({ status: 1 })
trainingSessionSchema.index({ createdAt: -1 })

// 가상 필드: 세션 지속 시간
trainingSessionSchema.virtual('duration').get(function() {
  if (this.endTime && this.startTime) {
    return Math.round((this.endTime - this.startTime) / 1000) // 초 단위
  }
  return 0
})

// 통계 집계 메서드
trainingSessionSchema.statics.getUserStats = async function(userId, period = 30) {
  const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000)
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalScore: { $sum: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalTimeSpent: { $sum: '$timeSpent' },
        completedLevels: { $sum: { $cond: ['$levelCompleted', 1, 0] } }
      }
    }
  ])
}

module.exports = mongoose.models.TrainingSession || mongoose.model('TrainingSession', trainingSessionSchema)
