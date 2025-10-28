const mongoose = require('mongoose')
const User = require('../models/User')
const connectDB = require('../config/database')

// 관리자 계정 생성 함수
const createAdminAccount = async () => {
  try {
    // 데이터베이스 연결
    await connectDB()

    // 기존 관리자 계정 확인
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      console.log('✅ 관리자 계정이 이미 존재합니다:')
      console.log(`   사용자명: ${existingAdmin.username}`)
      console.log(`   이메일: ${existingAdmin.email}`)
      console.log(`   이름: ${existingAdmin.name}`)
      return
    }

    // 기본 관리자 계정 생성
    const adminUser = new User({
      username: 'admin',
      email: 'admin@linkit.com',
      password: 'admin123!', // 실제 운영에서는 더 강력한 비밀번호 사용
      name: '시스템 관리자',
      role: 'admin',
      isActive: true
    })

    await adminUser.save()

    console.log('✅ 관리자 계정이 생성되었습니다:')
    console.log(`   사용자명: ${adminUser.username}`)
    console.log(`   비밀번호: admin123!`)
    console.log(`   이메일: ${adminUser.email}`)
    console.log('')
    console.log('⚠️  보안을 위해 첫 로그인 후 비밀번호를 변경해주세요!')

  } catch (error) {
    console.error('❌ 관리자 계정 생성 오류:', error.message)
  } finally {
    // 데이터베이스 연결 종료
    await mongoose.connection.close()
    process.exit(0)
  }
}

// 스크립트 실행
if (require.main === module) {
  createAdminAccount()
}

module.exports = createAdminAccount
