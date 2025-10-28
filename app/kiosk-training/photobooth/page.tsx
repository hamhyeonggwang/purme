'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, Download } from 'lucide-react'
import Link from 'next/link'

interface PhotoBoothState {
  currentStep: number
  selectedTheme: string | null
  selectedPeople: string | null
  selectedPayment: string | null
  photos: string[]
  selectedPhotos: number[]
  isCapturing: boolean
  gameCompleted: boolean
  cameraStream: MediaStream | null
  capturedImages: string[]
  isCameraReady: boolean
  countdown: number
  currentPhoto: number
}

export default function PhotoBoothKiosk() {
  const [gameState, setGameState] = useState<PhotoBoothState>({
    currentStep: 0,
    selectedTheme: null,
    selectedPeople: null,
    selectedPayment: null,
    photos: [],
    selectedPhotos: [],
    isCapturing: false,
    gameCompleted: false,
    cameraStream: null,
    capturedImages: [],
    isCameraReady: false,
    countdown: 0,
    currentPhoto: 0
  })

  const themes = [
    { id: 'classic', name: '클래식', color: 'bg-slate-600', icon: '📷' },
    { id: 'romantic', name: '로맨틱', color: 'bg-rose-600', icon: '💕' },
    { id: 'funky', name: '펑키', color: 'bg-violet-600', icon: '🎵' },
    { id: 'cute', name: '귀여운', color: 'bg-emerald-600', icon: '🐰' }
  ]

  const peopleOptions = ['1명', '2명', '3명', '4명']
  const paymentOptions = ['카드 결제', '현금 결제', '모바일 결제']

  // 카메라 초기화
  const initializeCamera = async () => {
    try {
      // HTTPS 체크
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('HTTPS가 필요합니다. 카메라 접근을 위해 안전한 연결이 필요합니다.')
      }

      // 카메라 권한 체크
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      if (permission.state === 'denied') {
        throw new Error('카메라 권한이 거부되었습니다.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      })
      
      setGameState(prev => ({
        ...prev,
        cameraStream: stream,
        isCameraReady: true
      }))
    } catch (error) {
      console.error('카메라 접근 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '카메라 접근에 실패했습니다.'
      
      // 사용자에게 친화적인 에러 메시지
      if (errorMessage.includes('HTTPS')) {
        alert('카메라 접근을 위해 HTTPS 연결이 필요합니다. Vercel 배포에서는 자동으로 HTTPS가 적용됩니다.')
      } else if (errorMessage.includes('권한')) {
        alert('브라우저 설정에서 카메라 권한을 허용해주세요.')
      } else {
        alert('카메라 접근이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.')
      }
    }
  }

  // 카메라 정리
  const cleanupCamera = () => {
    if (gameState.cameraStream) {
      gameState.cameraStream.getTracks().forEach(track => track.stop())
      setGameState(prev => ({
        ...prev,
        cameraStream: null,
        isCameraReady: false
      }))
    }
  }

  // 사진 촬영
  const capturePhoto = (): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.getElementById('camera-video') as HTMLVideoElement
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      if (video && context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // 테마별 필터 적용
        context.filter = getThemeFilter(gameState.selectedTheme)
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // 캔버스를 이미지로 변환
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        resolve(imageData)
      } else {
        resolve('')
      }
    })
  }

  // 테마별 필터
  const getThemeFilter = (theme: string | null) => {
    switch (theme) {
      case '클래식':
        return 'contrast(1.2) brightness(1.1) saturate(0.8)'
      case '로맨틱':
        return 'contrast(1.1) brightness(1.2) saturate(1.3) hue-rotate(10deg)'
      case '펑키':
        return 'contrast(1.3) brightness(1.1) saturate(1.5) hue-rotate(30deg)'
      case '귀여운':
        return 'contrast(1.1) brightness(1.3) saturate(1.2) hue-rotate(-10deg)'
      default:
        return 'contrast(1.1) brightness(1.1) saturate(1.1)'
    }
  }

  // 컴포넌트 마운트 시 카메라 초기화
  useEffect(() => {
    initializeCamera()
    
    return () => {
      cleanupCamera()
    }
  }, [])

  // 가상의 사진들 (실제로는 카메라에서 촬영)
  const samplePhotos = [
    '📸 사진 1',
    '📸 사진 2', 
    '📸 사진 3',
    '📸 사진 4'
  ]

  const handleStepComplete = (value: string, stepType: string) => {
    setGameState(prev => ({
      ...prev,
      [stepType]: value,
      currentStep: prev.currentStep + 1
    }))
  }

  const startPhotoCapture = async () => {
    setGameState(prev => ({
      ...prev,
      isCapturing: true,
      capturedImages: [],
      currentPhoto: 0
    }))

    // 4장의 사진을 5초 간격으로 촬영
    const capturedPhotos: string[] = []
    
    for (let i = 0; i < 4; i++) {
      // 현재 사진 번호 업데이트
      setGameState(prev => ({
        ...prev,
        currentPhoto: i + 1
      }))

      // 5초 카운트다운
      for (let count = 5; count > 0; count--) {
        setGameState(prev => ({
          ...prev,
          countdown: count
        }))
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // 카운트다운 종료 후 촬영
      setGameState(prev => ({
        ...prev,
        countdown: 0
      }))
      
      try {
        const photoData = await capturePhoto()
        if (photoData) {
          capturedPhotos.push(photoData)
        }
      } catch (error) {
        console.error('사진 촬영 실패:', error)
      }
    }

    setGameState(prev => ({
      ...prev,
      isCapturing: false,
      capturedImages: capturedPhotos,
      photos: capturedPhotos.length > 0 ? capturedPhotos : samplePhotos,
      currentStep: prev.currentStep + 1,
      countdown: 0,
      currentPhoto: 0
    }))
  }

  const selectPhoto = (index: number) => {
    setGameState(prev => ({
      ...prev,
      selectedPhotos: [...prev.selectedPhotos, index]
    }))
  }

  const completeOrder = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true
    }))

    // 게임 결과를 로컬 스토리지에 저장
    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'photobooth-kiosk',
        timestamp: new Date().toISOString(),
        theme: gameState.selectedTheme,
        people: gameState.selectedPeople,
        payment: gameState.selectedPayment,
        photosSelected: gameState.selectedPhotos.length,
        capturedImages: gameState.capturedImages.length
      })
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
    } catch (error) {
      console.log('게임 결과 저장 실패:', error)
    }
  }

  // 사진 다운로드
  const downloadPhoto = (imageData: string, index: number) => {
    const link = document.createElement('a')
    link.download = `photobooth_${gameState.selectedTheme}_${index + 1}.jpg`
    link.href = imageData
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 모든 선택된 사진 다운로드
  const downloadAllPhotos = () => {
    gameState.selectedPhotos.forEach((photoIndex) => {
      const imageData = gameState.capturedImages[photoIndex]
      if (imageData) {
        downloadPhoto(imageData, photoIndex)
      }
    })
  }

  const resetGame = () => {
    setGameState({
      currentStep: 0,
      selectedTheme: null,
      selectedPeople: null,
      selectedPayment: null,
      photos: [],
      selectedPhotos: [],
      isCapturing: false,
      gameCompleted: false,
      cameraStream: null,
      capturedImages: [],
      isCameraReady: false,
      countdown: 0,
      currentPhoto: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-600">
      {/* 헤더 */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-400 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-slate-200 hover:text-slate-100">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-100">포토부스 키오스크</h1>
                <p className="text-sm text-slate-200">인생네컷 촬영</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-slate-600 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-lg transition-colors"
            >
              다시 시작
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 포토부스 기계 전체 */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-pink-700 rounded-3xl shadow-2xl p-8 border-4 border-pink-400">
            {/* 포토부스 상단 로고 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-4xl font-bold text-pink-100 mb-2">인생네컷 포토부스</h2>
              <p className="text-pink-200 text-lg">소중한 순간을 기록하세요!</p>
            </div>

            {/* 포토부스 기계 본체 */}
            <div className="bg-pink-800 rounded-2xl p-8 shadow-inner">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 왼쪽: 큰 카메라 화면 */}
                <div className="flex items-center justify-center">
                  {/* 실제 카메라 화면 - 크게 확장 */}
                  <div className="text-center w-full">
                    <div className="w-full h-96 mx-auto rounded-lg border-2 border-pink-400 bg-black relative overflow-hidden">
                      {gameState.isCameraReady && gameState.cameraStream ? (
                        <video
                          id="camera-video"
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{
                            filter: getThemeFilter(gameState.selectedTheme),
                            transform: 'scaleX(-1)' // 거울 효과
                          }}
                          ref={(video) => {
                            if (video && gameState.cameraStream) {
                              video.srcObject = gameState.cameraStream
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📷</div>
                            <p className="text-gray-400 text-lg">카메라 준비 중...</p>
                            {!gameState.isCameraReady && (
                              <button
                                onClick={initializeCamera}
                                className="mt-4 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-pink-100 rounded-lg text-lg"
                              >
                                카메라 활성화
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 촬영 중 오버레이 */}
                      {gameState.isCapturing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-center text-white">
                            {gameState.countdown > 0 ? (
                              <div>
                                <div className="text-8xl font-bold mb-4 text-pink-400 animate-pulse">
                                  {gameState.countdown}
                                </div>
                                <p className="text-2xl font-bold mb-2">준비하세요!</p>
                                <p className="text-lg">사진 {gameState.currentPhoto}/4</p>
                              </div>
                            ) : (
                              <div>
                                <div className="text-8xl mb-4 animate-pulse">📸</div>
                                <p className="text-2xl font-bold">촬영 중...</p>
                                <p className="text-lg">웃어주세요! 😊</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-pink-200 text-lg mt-4 font-semibold">실시간 카메라</p>
                  </div>
                </div>

                {/* 오른쪽: 터치 화면 */}
                <div>
                  <div className="bg-pink-900 rounded-xl p-6 border-2 border-pink-400">
                    {/* 진행 단계 표시 */}
                    <div className="flex justify-center mb-6">
                      <div className="flex space-x-2">
                        {[0, 1, 2, 3, 4, 5].map((step) => (
                          <div
                            key={step}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              step <= gameState.currentStep
                                ? 'bg-pink-500 text-white'
                                : 'bg-pink-600 text-pink-300'
                            }`}
                          >
                            {step + 1}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 테마 선택 */}
                    {gameState.currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">테마를 선택하세요</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {themes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => handleStepComplete(theme.name, 'selectedTheme')}
                              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                                gameState.selectedTheme === theme.name
                                  ? 'border-pink-400 bg-pink-500'
                                  : 'border-pink-600 bg-pink-700 hover:border-pink-400'
                              }`}
                            >
                              <div className="text-4xl mb-2">{theme.icon}</div>
                              <div className="text-pink-100 font-semibold">{theme.name}</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 인원수 선택 */}
                    {gameState.currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">인원수를 선택하세요</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {peopleOptions.map((people) => (
                            <button
                              key={people}
                              onClick={() => handleStepComplete(people, 'selectedPeople')}
                              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                                gameState.selectedPeople === people
                                  ? 'border-pink-400 bg-pink-500'
                                  : 'border-pink-600 bg-pink-700 hover:border-pink-400'
                              }`}
                            >
                              <div className="text-4xl mb-2">👥</div>
                              <div className="text-pink-100 font-semibold">{people}</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 결제 방법 선택 */}
                    {gameState.currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">결제 방법을 선택하세요</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {paymentOptions.map((payment) => (
                            <button
                              key={payment}
                              onClick={() => handleStepComplete(payment, 'selectedPayment')}
                              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                                gameState.selectedPayment === payment
                                  ? 'border-pink-400 bg-pink-500'
                                  : 'border-pink-600 bg-pink-700 hover:border-pink-400'
                              }`}
                            >
                              <div className="text-4xl mb-2">💳</div>
                              <div className="text-pink-100 font-semibold">{payment}</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 촬영 준비 */}
                    {gameState.currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">촬영 준비가 완료되었습니다!</h3>
                        <div className="bg-pink-600 rounded-xl p-6 mb-6">
                          <p className="text-pink-100 mb-2">테마: {gameState.selectedTheme}</p>
                          <p className="text-pink-100 mb-2">인원: {gameState.selectedPeople}</p>
                          <p className="text-pink-100">결제: {gameState.selectedPayment}</p>
                        </div>
                        <button
                          onClick={startPhotoCapture}
                          className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors shadow-lg"
                        >
                          📸 촬영 시작
                        </button>
                      </motion.div>
                    )}

                    {/* 촬영 중 */}
                    {gameState.isCapturing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        {gameState.countdown > 0 ? (
                          <div>
                            <div className="text-8xl font-bold mb-6 text-pink-400 animate-pulse">
                              {gameState.countdown}
                            </div>
                            <h3 className="text-2xl font-bold text-pink-100 mb-4">준비하세요!</h3>
                            <p className="text-pink-200 text-lg">사진 {gameState.currentPhoto}/4</p>
                            <div className="mt-6">
                              <div className="w-full bg-pink-600 rounded-full h-3">
                                <div 
                                  className="bg-pink-400 h-3 rounded-full transition-all duration-1000" 
                                  style={{ width: `${((5 - gameState.countdown) / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-8xl mb-6 animate-pulse">📸</div>
                            <h3 className="text-2xl font-bold text-pink-100 mb-4">촬영 중...</h3>
                            <p className="text-pink-200 text-lg">웃어주세요! 😊</p>
                            <p className="text-pink-200">사진 {gameState.currentPhoto}/4</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 사진 선택 */}
                    {gameState.currentStep === 4 && !gameState.isCapturing && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">마음에 드는 사진을 선택하세요</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {gameState.photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => selectPhoto(index)}
                              className={`p-2 rounded-xl border-2 transition-all duration-200 ${
                                gameState.selectedPhotos.includes(index)
                                  ? 'border-pink-400 bg-pink-500'
                                  : 'border-pink-600 bg-pink-700 hover:border-pink-400'
                              }`}
                            >
                              {typeof photo === 'string' && photo.startsWith('data:image') ? (
                                // 실제 촬영된 사진
                                <div className="relative">
                                  <img
                                    src={photo}
                                    alt={`촬영된 사진 ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                    style={{ transform: 'scaleX(-1)' }} // 거울 효과
                                  />
                                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    사진 {index + 1}
                                  </div>
                                </div>
                              ) : (
                                // 기본 아이콘
                                <div>
                                  <div className="text-3xl mb-2">{photo}</div>
                                  <div className="text-pink-100 text-sm">사진 {index + 1}</div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {gameState.selectedPhotos.length > 0 && (
                          <button
                            onClick={() => setGameState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))}
                            className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                          >
                            선택 완료 ({gameState.selectedPhotos.length}장)
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* 출력 완료 */}
                    {gameState.currentStep === 5 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-pink-100 mb-6">사진 출력이 완료되었습니다!</h3>
                        <div className="bg-pink-600 rounded-xl p-6 mb-6">
                          <div className="text-6xl mb-4">🎉</div>
                          <p className="text-pink-100 mb-2">선택한 사진: {gameState.selectedPhotos.length}장</p>
                          <p className="text-pink-100">출력 완료!</p>
                        </div>
                        <button
                          onClick={completeOrder}
                          className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors shadow-lg"
                        >
                          완료
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* 포토부스 하단 기능 버튼들 */}
              <div className="mt-8 flex justify-center space-x-4">
                <button className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-pink-100 text-sm">
                  취소
                </button>
                <button className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-pink-100 text-sm">
                  도움말
                </button>
                <button className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-pink-100 text-sm">
                  언어변경
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-pink-700 rounded-2xl shadow-2xl p-8 text-center border-4 border-pink-400 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-pink-100 mb-6">
                포토부스 이용 완료!
              </h2>
              <div className="bg-pink-600 rounded-xl p-4 mb-6">
                <p className="text-pink-100 mb-2">테마: {gameState.selectedTheme}</p>
                <p className="text-pink-100 mb-2">인원: {gameState.selectedPeople}</p>
                <p className="text-pink-100 mb-2">결제: {gameState.selectedPayment}</p>
                <p className="text-pink-100">출력 사진: {gameState.selectedPhotos.length}장</p>
              </div>
              
              {/* 촬영된 사진 미리보기 */}
              {gameState.capturedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-pink-100 font-semibold mb-3">촬영된 사진</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {gameState.selectedPhotos.map((photoIndex) => {
                      const imageData = gameState.capturedImages[photoIndex]
                      return imageData ? (
                        <div key={photoIndex} className="relative">
                          <img
                            src={imageData}
                            alt={`선택된 사진 ${photoIndex + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            style={{ transform: 'scaleX(-1)' }}
                          />
                          <button
                            onClick={() => downloadPhoto(imageData, photoIndex)}
                            className="absolute top-1 right-1 bg-pink-500 hover:bg-pink-400 text-white p-1 rounded-full"
                            title="다운로드"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  다시 하기
                </button>
                {gameState.capturedImages.length > 0 && (
                  <button
                    onClick={downloadAllPhotos}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>모든 사진 다운로드</span>
                  </button>
                )}
                <Link href="/kiosk-training" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  목록으로
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
