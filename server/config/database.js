const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkit'
    
    // MongoDB 연결 시도
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
    })
    
    console.log('✅ MongoDB 연결 성공')
    
    // 연결 상태 모니터링
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 연결 오류:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB 연결 끊어짐')
    })
    
  } catch (error) {
    console.warn('⚠️ MongoDB 연결 실패 - 메모리 모드로 실행:', error.message)
    console.log('💡 MongoDB를 설치하거나 Docker로 실행해주세요')
    
    // 개발 모드에서는 계속 진행
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 개발 모드: MongoDB 없이 계속 실행')
      return
    }
    
    console.error('❌ 프로덕션 환경에서 MongoDB 연결 실패')
    process.exit(1)
  }
}

module.exports = connectDB
