const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkit'

    // MongoDB 연결 옵션 (Vercel 호환)
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      connectTimeoutMS: 10000, // 10초 연결 타임아웃
      socketTimeoutMS: 45000, // 45초 소켓 타임아웃
      maxPoolSize: 10, // 최대 연결 풀 크기
      minPoolSize: 5, // 최소 연결 풀 크기
      maxIdleTimeMS: 30000, // 30초 유휴 시간
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    }

    // MongoDB 연결 시도
    await mongoose.connect(mongoURI, options)

    console.log('✅ MongoDB 연결 성공')

    // 연결 상태 모니터링
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 연결 오류:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB 연결 끊어짐')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB 재연결됨')
    })

  } catch (error) {
    console.warn('⚠️ MongoDB 연결 실패 - 메모리 모드로 실행:', error.message)
    console.log('💡 MongoDB를 설치하거나 MongoDB Atlas를 사용해주세요')

    // 개발 모드에서는 계속 진행
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 개발 모드: MongoDB 없이 계속 실행')
      return
    }

    // 프로덕션에서는 MongoDB 연결 필수
    console.error('❌ 프로덕션 환경에서 MongoDB 연결 실패')
    throw error
  }
}

module.exports = connectDB
module.exports.default = connectDB
