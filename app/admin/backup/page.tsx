'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Archive, 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  FileText, 
  Users, 
  Activity,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface BackupFile {
  fileName: string
  size: string
  createdAt: string
  modifiedAt: string
  type: string
}

interface BackupStatus {
  totalBackups: number
  totalSize: string
  lastBackup: string | null
  backupDir: string
  maxBackups: number
}

export default function BackupManagement() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingBackup, setCreatingBackup] = useState(false)

  useEffect(() => {
    fetchBackupData()
  }, [])

  const fetchBackupData = async () => {
    try {
      setLoading(true)
      
      // 백업 상태 조회
      const statusResponse = await fetch('/api/backup/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setBackupStatus(statusData.status)
      }

      // 백업 목록 조회
      const listResponse = await fetch('/api/backup/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (listResponse.ok) {
        const listData = await listResponse.json()
        setBackups(listData.backups)
      }

      setLoading(false)
    } catch (error) {
      console.error('백업 데이터 조회 실패:', error)
      toast.error('백업 데이터를 불러오는 데 실패했습니다.')
      setLoading(false)
    }
  }

  const createBackup = async (type: string) => {
    try {
      setCreatingBackup(true)
      
      const response = await fetch(`/api/backup/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        fetchBackupData() // 데이터 새로고침
      } else {
        const error = await response.json()
        toast.error(error.error || '백업 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('백업 생성 실패:', error)
      toast.error('백업 생성에 실패했습니다.')
    } finally {
      setCreatingBackup(false)
    }
  }

  const downloadBackup = async (fileName: string) => {
    try {
      const response = await fetch(`/api/backup/download/${fileName}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('백업 파일이 다운로드되었습니다.')
      } else {
        toast.error('백업 파일 다운로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('백업 다운로드 실패:', error)
      toast.error('백업 파일 다운로드에 실패했습니다.')
    }
  }

  const deleteBackup = async (fileName: string) => {
    if (!confirm('정말로 이 백업 파일을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/backup/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        toast.success('백업 파일이 삭제되었습니다.')
        fetchBackupData() // 데이터 새로고침
      } else {
        toast.error('백업 파일 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('백업 삭제 실패:', error)
      toast.error('백업 파일 삭제에 실패했습니다.')
    }
  }

  const restoreBackup = async (fileName: string) => {
    if (!confirm('정말로 이 백업으로 복원하시겠습니까? 기존 데이터가 삭제될 수 있습니다.')) {
      return
    }

    try {
      const response = await fetch(`/api/backup/restore/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clearExisting: true })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
      } else {
        const error = await response.json()
        toast.error(error.error || '백업 복원에 실패했습니다.')
      }
    } catch (error) {
      console.error('백업 복원 실패:', error)
      toast.error('백업 복원에 실패했습니다.')
    }
  }

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'mongodb': return <Database className="w-5 h-5 text-blue-500" />
      case 'json': return <FileText className="w-5 h-5 text-green-500" />
      case 'users': return <Users className="w-5 h-5 text-purple-500" />
      case 'training': return <Activity className="w-5 h-5 text-orange-500" />
      default: return <Archive className="w-5 h-5 text-gray-500" />
    }
  }

  const getBackupTypeName = (type: string) => {
    switch (type) {
      case 'mongodb': return 'MongoDB 덤프'
      case 'json': return 'JSON 백업'
      case 'users': return '사용자 데이터'
      case 'training': return '훈련 세션'
      default: return '알 수 없음'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">백업 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">데이터 백업 관리</h1>
          <button
            onClick={fetchBackupData}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>

        {/* 백업 상태 요약 */}
        {backupStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">총 백업 수</p>
                  <p className="text-3xl font-bold text-gray-900">{backupStatus.totalBackups}</p>
                </div>
                <Archive className="text-blue-500 w-10 h-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">총 크기</p>
                  <p className="text-3xl font-bold text-gray-900">{backupStatus.totalSize}</p>
                </div>
                <Database className="text-green-500 w-10 h-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">최근 백업</p>
                  <p className="text-sm font-bold text-gray-900">
                    {backupStatus.lastBackup 
                      ? new Date(backupStatus.lastBackup).toLocaleDateString()
                      : '없음'
                    }
                  </p>
                </div>
                <Clock className="text-purple-500 w-10 h-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">최대 백업</p>
                  <p className="text-3xl font-bold text-gray-900">{backupStatus.maxBackups}</p>
                </div>
                <AlertCircle className="text-orange-500 w-10 h-10" />
              </div>
            </motion.div>
          </div>
        )}

        {/* 백업 생성 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">백업 생성</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => createBackup('database')}
              disabled={creatingBackup}
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Database className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-blue-800">MongoDB 덤프</span>
            </button>

            <button
              onClick={() => createBackup('json')}
              disabled={creatingBackup}
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <FileText className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-green-800">JSON 백업</span>
            </button>

            <button
              onClick={() => createBackup('users')}
              disabled={creatingBackup}
              className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Users className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium text-purple-800">사용자 데이터</span>
            </button>

            <button
              onClick={() => createBackup('training')}
              disabled={creatingBackup}
              className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Activity className="w-5 h-5 text-orange-600 mr-3" />
              <span className="font-medium text-orange-800">훈련 세션</span>
            </button>
          </div>
        </motion.div>

        {/* 백업 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">백업 파일 목록</h2>
          
          {backups.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-500">아직 생성된 백업이 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">위의 버튼을 클릭하여 백업을 생성해보세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">파일명</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">타입</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">크기</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">생성일</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getBackupTypeIcon(backup.type)}
                          <span className="ml-3 font-medium text-gray-900">{backup.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {getBackupTypeName(backup.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{backup.size}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(backup.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadBackup(backup.fileName)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => restoreBackup(backup.fileName)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="복원"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.fileName)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
