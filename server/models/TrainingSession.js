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
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  level: {
    type: Number,
    default: 1
  },
  score: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // 초 단위
  },
  attempts: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAnswers: {
    type: Number,
    default: 0
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
  endTime: {
    type: Date
  },
  sessionData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }
}, {
  timestamps: true
})

// 인덱스 설정
trainingSessionSchema.index({ userId: 1, createdAt: -1 })
trainingSessionSchema.index({ trainingType: 1 })
trainingSessionSchema.index({ status: 1 })
trainingSessionSchema.index({ createdAt: -1 })

// 세션 완료 메서드
trainingSessionSchema.methods.complete = function(data) {
  this.status = 'completed'
  this.endTime = new Date()
  
  if (data) {
    Object.assign(this, data)
  }
  
  return this.save()
}

// 통계 집계 메서드
trainingSessionSchema.statics.getUserStats = async function(userId, period = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - period)
  
  const stats = await this.aggregate([
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
        averageTimeSpent: { $avg: '$timeSpent' },
        maxScore: { $max: '$score' },
        completedLevels: { $sum: { $cond: [{ $gt: ['$level', 1] }, 1, 0] } }
      }
    }
  ])
  
  return stats[0] || {
    totalSessions: 0,
    totalScore: 0,
    averageAccuracy: 0,
    totalTimeSpent: 0,
    averageTimeSpent: 0,
    maxScore: 0,
    completedLevels: 0
  }
}

module.exports = mongoose.model('TrainingSession', trainingSessionSchema)
