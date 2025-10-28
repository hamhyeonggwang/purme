const fs = require('fs').promises
const path = require('path')
const mongoose = require('mongoose')
const User = require('../models/User')
const TrainingSession = require('../models/TrainingSession')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

class BackupManager {
  constructor() {
    this.backupDir = path.join(__dirname, '../../backups')
    this.maxBackups = 10 // 최대 백업 파일 수
  }

  // 백업 디렉토리 초기화
  async initializeBackupDir() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true })
      console.log('✅ 백업 디렉토리 초기화 완료')
    } catch (error) {
      console.error('❌ 백업 디렉토리 초기화 실패:', error)
      throw error
    }
  }

  // 전체 데이터베이스 백업 (MongoDB 덤프)
  async createDatabaseBackup() {
    try {
      await this.initializeBackupDir()
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFileName = `mongodb-backup-${timestamp}.gz`
      const backupPath = path.join(this.backupDir, backupFileName)

      // MongoDB 덤프 명령어
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkit'
      const dbName = mongoUri.split('/').pop()
      
      const dumpCommand = `mongodump --uri="${mongoUri}" --archive="${backupPath}" --gzip`
      
      console.log('🔄 데이터베이스 백업 시작...')
      await execAsync(dumpCommand)
      
      console.log(`✅ 데이터베이스 백업 완료: ${backupFileName}`)
      
      // 오래된 백업 파일 정리
      await this.cleanupOldBackups()
      
      return {
        success: true,
        fileName: backupFileName,
        path: backupPath,
        size: await this.getFileSize(backupPath),
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ 데이터베이스 백업 실패:', error)
      throw error
    }
  }

  // JSON 형태로 데이터 백업
  async createJsonBackup() {
    try {
      await this.initializeBackupDir()
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFileName = `json-backup-${timestamp}.json`
      const backupPath = path.join(this.backupDir, backupFileName)

      console.log('🔄 JSON 백업 시작...')

      // 사용자 데이터 백업
      const users = await User.find({}).lean()
      const trainingSessions = await TrainingSession.find({}).lean()

      const backupData = {
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          database: 'linkit',
          totalUsers: users.length,
          totalSessions: trainingSessions.length
        },
        users: users.map(user => ({
          ...user,
          password: '[REDACTED]' // 비밀번호는 보안상 제외
        })),
        trainingSessions,
        statistics: {
          totalUsers: users.length,
          totalSessions: trainingSessions.length,
          activeUsers: users.filter(u => u.isActive).length,
          completedSessions: trainingSessions.filter(s => s.status === 'completed').length
        }
      }

      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2))
      
      console.log(`✅ JSON 백업 완료: ${backupFileName}`)
      
      return {
        success: true,
        fileName: backupFileName,
        path: backupPath,
        size: await this.getFileSize(backupPath),
        createdAt: new Date().toISOString(),
        statistics: backupData.statistics
      }
    } catch (error) {
      console.error('❌ JSON 백업 실패:', error)
      throw error
    }
  }

  // 사용자 데이터만 백업
  async createUserBackup() {
    try {
      await this.initializeBackupDir()
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFileName = `users-backup-${timestamp}.json`
      const backupPath = path.join(this.backupDir, backupFileName)

      console.log('🔄 사용자 데이터 백업 시작...')

      const users = await User.find({}).lean()
      
      const userBackupData = {
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          type: 'users',
          totalUsers: users.length
        },
        users: users.map(user => ({
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          age: user.age,
          grade: user.grade,
          isActive: user.isActive,
          createdAt: user.createdAt,
          statistics: user.statistics,
          profile: user.profile
        }))
      }

      await fs.writeFile(backupPath, JSON.stringify(userBackupData, null, 2))
      
      console.log(`✅ 사용자 데이터 백업 완료: ${backupFileName}`)
      
      return {
        success: true,
        fileName: backupFileName,
        path: backupPath,
        size: await this.getFileSize(backupPath),
        createdAt: new Date().toISOString(),
        userCount: users.length
      }
    } catch (error) {
      console.error('❌ 사용자 데이터 백업 실패:', error)
      throw error
    }
  }

  // 훈련 세션 데이터만 백업
  async createTrainingBackup() {
    try {
      await this.initializeBackupDir()
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFileName = `training-backup-${timestamp}.json`
      const backupPath = path.join(this.backupDir, backupFileName)

      console.log('🔄 훈련 세션 데이터 백업 시작...')

      const trainingSessions = await TrainingSession.find({}).lean()
      
      const trainingBackupData = {
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          type: 'training_sessions',
          totalSessions: trainingSessions.length
        },
        trainingSessions: trainingSessions.map(session => ({
          userId: session.userId,
          trainingType: session.trainingType,
          module: session.module,
          difficulty: session.difficulty,
          level: session.level,
          score: session.score,
          accuracy: session.accuracy,
          timeSpent: session.timeSpent,
          status: session.status,
          startTime: session.startTime,
          endTime: session.endTime,
          createdAt: session.createdAt,
          sessionData: session.sessionData
        }))
      }

      await fs.writeFile(backupPath, JSON.stringify(trainingBackupData, null, 2))
      
      console.log(`✅ 훈련 세션 데이터 백업 완료: ${backupFileName}`)
      
      return {
        success: true,
        fileName: backupFileName,
        path: backupPath,
        size: await this.getFileSize(backupPath),
        createdAt: new Date().toISOString(),
        sessionCount: trainingSessions.length
      }
    } catch (error) {
      console.error('❌ 훈련 세션 데이터 백업 실패:', error)
      throw error
    }
  }

  // 백업 파일 목록 조회
  async getBackupList() {
    try {
      await this.initializeBackupDir()
      
      const files = await fs.readdir(this.backupDir)
      const backupFiles = []

      for (const file of files) {
        const filePath = path.join(this.backupDir, file)
        const stats = await fs.stat(filePath)
        
        backupFiles.push({
          fileName: file,
          size: await this.getFileSize(filePath),
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          type: this.getBackupType(file)
        })
      }

      // 생성일 기준으로 정렬 (최신순)
      backupFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return backupFiles
    } catch (error) {
      console.error('❌ 백업 목록 조회 실패:', error)
      throw error
    }
  }

  // 백업 파일 복원
  async restoreFromBackup(fileName, options = {}) {
    try {
      const backupPath = path.join(this.backupDir, fileName)
      
      // 파일 존재 확인
      await fs.access(backupPath)
      
      const backupType = this.getBackupType(fileName)
      
      if (backupType === 'mongodb') {
        return await this.restoreDatabaseBackup(backupPath, options)
      } else if (backupType === 'json') {
        return await this.restoreJsonBackup(backupPath, options)
      } else {
        throw new Error('지원하지 않는 백업 파일 형식입니다')
      }
    } catch (error) {
      console.error('❌ 백업 복원 실패:', error)
      throw error
    }
  }

  // MongoDB 덤프 복원
  async restoreDatabaseBackup(backupPath, options = {}) {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkit'
      
      const restoreCommand = `mongorestore --uri="${mongoUri}" --archive="${backupPath}" --gzip --drop`
      
      console.log('🔄 데이터베이스 복원 시작...')
      await execAsync(restoreCommand)
      
      console.log('✅ 데이터베이스 복원 완료')
      
      return {
        success: true,
        message: '데이터베이스가 성공적으로 복원되었습니다',
        restoredAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ 데이터베이스 복원 실패:', error)
      throw error
    }
  }

  // JSON 백업 복원
  async restoreJsonBackup(backupPath, options = {}) {
    try {
      const backupData = JSON.parse(await fs.readFile(backupPath, 'utf8'))
      
      console.log('🔄 JSON 데이터 복원 시작...')

      if (options.clearExisting) {
        // 기존 데이터 삭제
        await User.deleteMany({})
        await TrainingSession.deleteMany({})
        console.log('🗑️ 기존 데이터 삭제 완료')
      }

      // 사용자 데이터 복원
      if (backupData.users && backupData.users.length > 0) {
        await User.insertMany(backupData.users)
        console.log(`✅ ${backupData.users.length}명의 사용자 복원 완료`)
      }

      // 훈련 세션 데이터 복원
      if (backupData.trainingSessions && backupData.trainingSessions.length > 0) {
        await TrainingSession.insertMany(backupData.trainingSessions)
        console.log(`✅ ${backupData.trainingSessions.length}개의 훈련 세션 복원 완료`)
      }

      console.log('✅ JSON 데이터 복원 완료')
      
      return {
        success: true,
        message: 'JSON 데이터가 성공적으로 복원되었습니다',
        restoredAt: new Date().toISOString(),
        restoredUsers: backupData.users?.length || 0,
        restoredSessions: backupData.trainingSessions?.length || 0
      }
    } catch (error) {
      console.error('❌ JSON 데이터 복원 실패:', error)
      throw error
    }
  }

  // 백업 파일 삭제
  async deleteBackup(fileName) {
    try {
      const backupPath = path.join(this.backupDir, fileName)
      await fs.unlink(backupPath)
      
      console.log(`✅ 백업 파일 삭제 완료: ${fileName}`)
      
      return {
        success: true,
        message: '백업 파일이 삭제되었습니다'
      }
    } catch (error) {
      console.error('❌ 백업 파일 삭제 실패:', error)
      throw error
    }
  }

  // 오래된 백업 파일 정리
  async cleanupOldBackups() {
    try {
      const backupFiles = await this.getBackupList()
      
      if (backupFiles.length > this.maxBackups) {
        const filesToDelete = backupFiles.slice(this.maxBackups)
        
        for (const file of filesToDelete) {
          await this.deleteBackup(file.fileName)
        }
        
        console.log(`🧹 ${filesToDelete.length}개의 오래된 백업 파일 정리 완료`)
      }
    } catch (error) {
      console.error('❌ 백업 파일 정리 실패:', error)
    }
  }

  // 파일 크기 조회
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath)
      return this.formatFileSize(stats.size)
    } catch (error) {
      return 'Unknown'
    }
  }

  // 파일 크기 포맷팅
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 백업 파일 타입 확인
  getBackupType(fileName) {
    if (fileName.includes('mongodb-backup')) return 'mongodb'
    if (fileName.includes('json-backup')) return 'json'
    if (fileName.includes('users-backup')) return 'users'
    if (fileName.includes('training-backup')) return 'training'
    return 'unknown'
  }

  // 백업 상태 확인
  async getBackupStatus() {
    try {
      const backupFiles = await this.getBackupList()
      const totalSize = backupFiles.reduce((sum, file) => {
        const sizeInBytes = this.parseFileSize(file.size)
        return sum + sizeInBytes
      }, 0)

      return {
        totalBackups: backupFiles.length,
        totalSize: this.formatFileSize(totalSize),
        lastBackup: backupFiles.length > 0 ? backupFiles[0].createdAt : null,
        backupDir: this.backupDir,
        maxBackups: this.maxBackups
      }
    } catch (error) {
      console.error('❌ 백업 상태 확인 실패:', error)
      throw error
    }
  }

  // 파일 크기 파싱 (문자열을 바이트로 변환)
  parseFileSize(sizeString) {
    const match = sizeString.match(/^([\d.]+)\s*([A-Za-z]+)$/)
    if (!match) return 0
    
    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()
    
    const multipliers = {
      'BYTES': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    }
    
    return value * (multipliers[unit] || 1)
  }
}

module.exports = BackupManager
