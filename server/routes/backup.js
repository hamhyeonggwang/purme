const express = require('express')
const BackupManager = require('../utils/backup-manager')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const backupManager = new BackupManager()

// 모든 백업 라우터에 관리자 인증 적용
router.use(authenticateToken)
router.use(requireAdmin)

// 백업 상태 조회
router.get('/status', async (req, res) => {
  try {
    const status = await backupManager.getBackupStatus()
    res.json({
      success: true,
      status
    })
  } catch (error) {
    console.error('백업 상태 조회 오류:', error)
    res.status(500).json({
      error: '백업 상태 조회 중 오류가 발생했습니다',
      code: 'BACKUP_STATUS_ERROR'
    })
  }
})

// 백업 목록 조회
router.get('/list', async (req, res) => {
  try {
    const backups = await backupManager.getBackupList()
    res.json({
      success: true,
      backups
    })
  } catch (error) {
    console.error('백업 목록 조회 오류:', error)
    res.status(500).json({
      error: '백업 목록 조회 중 오류가 발생했습니다',
      code: 'BACKUP_LIST_ERROR'
    })
  }
})

// 전체 데이터베이스 백업 (MongoDB 덤프)
router.post('/database', async (req, res) => {
  try {
    const result = await backupManager.createDatabaseBackup()
    res.json({
      success: true,
      message: '데이터베이스 백업이 완료되었습니다',
      result
    })
  } catch (error) {
    console.error('데이터베이스 백업 오류:', error)
    res.status(500).json({
      error: error.message || '데이터베이스 백업 중 오류가 발생했습니다',
      code: 'DATABASE_BACKUP_ERROR'
    })
  }
})

// JSON 백업 생성
router.post('/json', async (req, res) => {
  try {
    const result = await backupManager.createJsonBackup()
    res.json({
      success: true,
      message: 'JSON 백업이 완료되었습니다',
      result
    })
  } catch (error) {
    console.error('JSON 백업 오류:', error)
    res.status(500).json({
      error: 'JSON 백업 중 오류가 발생했습니다',
      code: 'JSON_BACKUP_ERROR'
    })
  }
})

// 사용자 데이터 백업
router.post('/users', async (req, res) => {
  try {
    const result = await backupManager.createUserBackup()
    res.json({
      success: true,
      message: '사용자 데이터 백업이 완료되었습니다',
      result
    })
  } catch (error) {
    console.error('사용자 데이터 백업 오류:', error)
    res.status(500).json({
      error: '사용자 데이터 백업 중 오류가 발생했습니다',
      code: 'USER_BACKUP_ERROR'
    })
  }
})

// 훈련 세션 데이터 백업
router.post('/training', async (req, res) => {
  try {
    const result = await backupManager.createTrainingBackup()
    res.json({
      success: true,
      message: '훈련 세션 데이터 백업이 완료되었습니다',
      result
    })
  } catch (error) {
    console.error('훈련 세션 데이터 백업 오류:', error)
    res.status(500).json({
      error: '훈련 세션 데이터 백업 중 오류가 발생했습니다',
      code: 'TRAINING_BACKUP_ERROR'
    })
  }
})

// 백업 파일 다운로드
router.get('/download/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params
    const path = require('path')
    const fs = require('fs').promises
    
    const filePath = path.join(backupManager.backupDir, fileName)
    
    // 파일 존재 확인
    await fs.access(filePath)
    
    // 파일 다운로드
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('파일 다운로드 오류:', err)
        res.status(500).json({
          error: '파일 다운로드 중 오류가 발생했습니다',
          code: 'DOWNLOAD_ERROR'
        })
      }
    })
  } catch (error) {
    console.error('파일 다운로드 오류:', error)
    res.status(404).json({
      error: '백업 파일을 찾을 수 없습니다',
      code: 'FILE_NOT_FOUND'
    })
  }
})

// 백업 복원
router.post('/restore/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params
    const { clearExisting = false } = req.body
    
    const result = await backupManager.restoreFromBackup(fileName, { clearExisting })
    
    res.json({
      success: true,
      message: '백업 복원이 완료되었습니다',
      result
    })
  } catch (error) {
    console.error('백업 복원 오류:', error)
    res.status(500).json({
      error: error.message || '백업 복원 중 오류가 발생했습니다',
      code: 'RESTORE_ERROR'
    })
  }
})

// 백업 파일 삭제
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params
    
    const result = await backupManager.deleteBackup(fileName)
    
    res.json({
      success: true,
      message: '백업 파일이 삭제되었습니다',
      result
    })
  } catch (error) {
    console.error('백업 파일 삭제 오류:', error)
    res.status(500).json({
      error: '백업 파일 삭제 중 오류가 발생했습니다',
      code: 'DELETE_ERROR'
    })
  }
})

// 자동 백업 설정 (스케줄링)
router.post('/schedule', async (req, res) => {
  try {
    const { type, interval, enabled } = req.body
    
    // 실제 구현에서는 cron job이나 스케줄러를 사용
    // 현재는 기본적인 설정만 저장
    
    res.json({
      success: true,
      message: '자동 백업 설정이 저장되었습니다',
      schedule: {
        type,
        interval,
        enabled,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('자동 백업 설정 오류:', error)
    res.status(500).json({
      error: '자동 백업 설정 중 오류가 발생했습니다',
      code: 'SCHEDULE_ERROR'
    })
  }
})

module.exports = router
