'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CreditCard, Download } from 'lucide-react'
import Link from 'next/link'

interface CivilService {
  id: string
  name: string
  fee: number
  requiresIdCapture: boolean
}

interface Identity {
  nationalIdPartial: string
  dob: string
  capture?: string
}

interface DocConfig {
  maskPersonal: boolean
  copies: number
  purpose?: string
}

interface CivilState {
  currentStep: 'service' | 'applicant' | 'identity' | 'config' | 'payment' | 'preview'
  selectedService: CivilService | null
  applicantType: 'self' | 'agent' | null
  identity: Identity
  docConfig: DocConfig
  paymentMethod: 'card' | 'qr' | 'cash' | null
  isPaymentProcessing: boolean
  gameCompleted: boolean
}

export default function CivilKiosk() {
  const [gameState, setGameState] = useState<CivilState>({
    currentStep: 'service',
    selectedService: null,
    applicantType: null,
    identity: {
      nationalIdPartial: '',
      dob: '',
      capture: undefined
    },
    docConfig: {
      maskPersonal: true,
      copies: 1,
      purpose: ''
    },
    paymentMethod: null,
    isPaymentProcessing: false,
    gameCompleted: false
  })

  const civilServices: CivilService[] = [
    {
      id: 'resident-register',
      name: '주민등록등본',
      fee: 500,
      requiresIdCapture: false
    },
    {
      id: 'family-relation',
      name: '가족관계증명서',
      fee: 600,
      requiresIdCapture: false
    },
    {
      id: 'tax-certificate',
      name: '납세증명서',
      fee: 700,
      requiresIdCapture: true
    },
    {
      id: 'income-certificate',
      name: '소득증명서',
      fee: 800,
      requiresIdCapture: true
    },
    {
      id: 'health-insurance',
      name: '건강보험자격득실증명서',
      fee: 500,
      requiresIdCapture: false
    },
    {
      id: 'driving-record',
      name: '운전면허증명서',
      fee: 1000,
      requiresIdCapture: true
    }
  ]

  // 서비스 선택
  const selectService = (service: CivilService) => {
    setGameState(prev => ({
      ...prev,
      selectedService: service,
      currentStep: 'applicant'
    }))
  }

  // 신청자 구분 선택
  const selectApplicantType = (type: 'self' | 'agent') => {
    setGameState(prev => ({
      ...prev,
      applicantType: type,
      currentStep: 'identity'
    }))
  }

  // 본인인증
  const setIdentity = (identity: Identity) => {
    setGameState(prev => ({
      ...prev,
      identity,
      currentStep: 'config'
    }))
  }

  // 문서 설정
  const setDocConfig = (config: DocConfig) => {
    setGameState(prev => ({
      ...prev,
      docConfig: config,
      currentStep: 'payment'
    }))
  }

  // 결제 처리
  const processPayment = async (method: 'card' | 'qr' | 'cash') => {
    setGameState(prev => ({
      ...prev,
      paymentMethod: method,
      isPaymentProcessing: true
    }))

    await new Promise(resolve => setTimeout(resolve, 2000))

    setGameState(prev => ({
      ...prev,
      isPaymentProcessing: false,
      currentStep: 'preview'
    }))
  }

  // 게임 완료
  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true
    }))

    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'civil-kiosk',
        timestamp: new Date().toISOString(),
        service: gameState.selectedService?.name,
        fee: gameState.selectedService?.fee,
        paymentMethod: gameState.paymentMethod
      })
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
    } catch (error) {
      console.log('게임 결과 저장 실패:', error)
    }
  }

  const resetGame = () => {
    setGameState({
      currentStep: 'service',
      selectedService: null,
      applicantType: null,
      identity: {
        nationalIdPartial: '',
        dob: '',
        capture: undefined
      },
      docConfig: {
        maskPersonal: true,
        copies: 1,
        purpose: ''
      },
      paymentMethod: null,
      isPaymentProcessing: false,
      gameCompleted: false
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-slate-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">민원발급</h1>
                <p className="text-sm text-gray-600">민원서류 발급 신청부터 완료까지</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-slate-100 hover:bg-slate-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              다시 시작
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 진행 단계 표시 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-center space-x-4">
            {['service', 'applicant', 'identity', 'config', 'payment', 'preview'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  gameState.currentStep === step
                    ? 'bg-slate-500 text-white'
                    : ['service', 'applicant', 'identity', 'config', 'payment', 'preview'].indexOf(gameState.currentStep) > index
                    ? 'bg-slate-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 선택 화면 */}
        {gameState.currentStep === 'service' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">발급받을 서류를 선택하세요</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {civilServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => selectService(service)}
                    className="p-6 bg-gray-50 hover:bg-slate-100 border-2 border-gray-300 rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-8 h-8 text-slate-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-600">수수료: {service.fee.toLocaleString()}원</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 신청자 구분 화면 */}
        {gameState.currentStep === 'applicant' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">신청자 구분을 선택하세요</h3>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => selectApplicantType('self')}
                  className="p-8 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors"
                >
                  <div className="text-5xl mb-4">👤</div>
                  <h4 className="text-xl font-bold text-blue-800">본인</h4>
                </button>
                <button
                  onClick={() => selectApplicantType('agent')}
                  className="p-8 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition-colors"
                >
                  <div className="text-5xl mb-4">👥</div>
                  <h4 className="text-xl font-bold text-purple-800">대리인</h4>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 본인인증 화면 */}
        {gameState.currentStep === 'identity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">본인인증</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주민등록번호 (앞 6자리)</label>
                  <input
                    type="text"
                    value={gameState.identity.nationalIdPartial}
                    onChange={(e) => setGameState(prev => ({ ...prev, identity: { ...prev.identity, nationalIdPartial: e.target.value } }))}
                    placeholder="901010"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                  <input
                    type="date"
                    value={gameState.identity.dob}
                    onChange={(e) => setGameState(prev => ({ ...prev, identity: { ...prev.identity, dob: e.target.value } }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  />
                </div>
                {gameState.selectedService?.requiresIdCapture && (
                  <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ 신분증 촬영이 필요합니다. 카메라 권한을 허용해주세요.
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!gameState.identity.nationalIdPartial || !gameState.identity.dob) {
                      alert('모든 정보를 입력해주세요.')
                      return
                    }
                    setIdentity(gameState.identity)
                  }}
                  className="w-full px-8 py-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                >
                  인증하기
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 문서 설정 화면 */}
        {gameState.currentStep === 'config' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">발급 옵션 설정</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">발급 부수</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setGameState(prev => ({ ...prev, docConfig: { ...prev.docConfig, copies: Math.max(1, prev.docConfig.copies - 1) } }))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold">{gameState.docConfig.copies}</span>
                    <button
                      onClick={() => setGameState(prev => ({ ...prev, docConfig: { ...prev.docConfig, copies: prev.docConfig.copies + 1 } }))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={gameState.docConfig.maskPersonal}
                      onChange={(e) => setGameState(prev => ({ ...prev, docConfig: { ...prev.docConfig, maskPersonal: e.target.checked } }))}
                      className="w-6 h-6"
                    />
                    <span className="text-gray-700">개인정보 마스킹 처리</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">용도</label>
                  <input
                    type="text"
                    value={gameState.docConfig.purpose}
                    onChange={(e) => setGameState(prev => ({ ...prev, docConfig: { ...prev.docConfig, purpose: e.target.value } }))}
                    placeholder="예: 은행 제출용"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setDocConfig(gameState.docConfig)}
                  className="w-full px-8 py-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                >
                  다음
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 결제 화면 */}
        {gameState.currentStep === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">결제 방법을 선택해주세요</h3>
                <p className="text-gray-600">수수료: {gameState.selectedService?.fee.toLocaleString()}원 x {gameState.docConfig.copies}부 = {gameState.selectedService && (gameState.selectedService.fee * gameState.docConfig.copies).toLocaleString()}원</p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                <button
                  onClick={() => processPayment('card')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-800">카드 결제</span>
                  </div>
                </button>
                <button
                  onClick={() => processPayment('qr')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">QR</span>
                    </div>
                    <span className="text-lg font-semibold text-green-800">QR 결제</span>
                  </div>
                </button>
                <button
                  onClick={() => processPayment('cash')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">💵</span>
                    <span className="text-lg font-semibold text-yellow-800">현금 결제</span>
                  </div>
                </button>
              </div>

              {gameState.isPaymentProcessing && (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">결제 처리 중...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 미리보기 화면 */}
        {gameState.currentStep === 'preview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">발급 완료!</h3>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">발급 정보</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">서류 종류</span>
                    <span className="font-semibold">{gameState.selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">발급 부수</span>
                    <span className="font-semibold">{gameState.docConfig.copies}부</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">개인정보 마스킹</span>
                    <span className="font-semibold">{gameState.docConfig.maskPersonal ? '예' : '아니오'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">수수료</span>
                    <span className="font-bold text-slate-600">{
                      gameState.selectedService && (gameState.selectedService.fee * gameState.docConfig.copies).toLocaleString()
                    }원</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
                <Download className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">PDF 파일로 저장되었습니다</p>
                <button className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  다운로드
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={completeGame}
                  className="px-8 py-3 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                >
                  완료
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 게임 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-slate-200 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">민원발급 완료!</h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-gray-800 mb-2">{gameState.selectedService?.name}</p>
                <p className="text-gray-800 mb-2">발급 부수: {gameState.docConfig.copies}부</p>
                <p className="text-gray-800 mb-2">수수료: {gameState.selectedService && (gameState.selectedService.fee * gameState.docConfig.copies).toLocaleString()}원</p>
                <p className="text-gray-800">결제 방법: {
                  gameState.paymentMethod === 'card' ? '카드 결제' :
                  gameState.paymentMethod === 'qr' ? 'QR 결제' : '현금 결제'
                }</p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  다시 하기
                </button>
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

