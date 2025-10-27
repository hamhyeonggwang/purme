'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

// 키오스크 훈련 타입
interface KioskTraining {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  category: 'touch' | 'voice' | 'visual' | 'navigation'
  steps: TrainingStep[]
}

interface TrainingStep {
  id: string
  instruction: string
  action: 'tap' | 'swipe' | 'voice' | 'select' | 'navigate'
  target?: string
  options?: string[]
  feedback?: string
}

interface GameState {
  currentTraining: KioskTraining | null
  currentStep: number
  score: number
  timeLeft: number
  gameStarted: boolean
  gameCompleted: boolean
  sessionId: string | null
  startTime: number | null
  correctAnswers: number
  totalAnswers: number
  streak: number
  maxStreak: number
}

export default function KioskTrainingPage() {
  // const router = useRouter() // 사용하지 않음
  const { user } = useAuth()
  
  const [gameState, setGameState] = useState<GameState>({
    currentTraining: null,
    currentStep: 0,
    score: 0,
    timeLeft: 300,
    gameStarted: false,
    gameCompleted: false,
    sessionId: null,
    startTime: null,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    maxStreak: 0
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // 키오스크 훈련 데이터
  const kioskTrainings: KioskTraining[] = [
    {
      id: 'atm-basic',
      name: 'ATM 기본 조작',
      description: 'ATM 화면에서 기본적인 금융 서비스를 이용하는 방법을 학습합니다',
      icon: '🏧',
      difficulty: 'beginner',
      duration: 5,
      category: 'touch',
      steps: [
        {
          id: 'step1',
          instruction: '카드를 삽입하세요',
          action: 'tap',
          target: 'card-slot',
          feedback: '카드 삽입구를 터치하세요'
        },
        {
          id: 'step2',
          instruction: 'PIN 번호를 입력하세요',
          action: 'tap',
          target: 'pin-pad',
          feedback: '숫자 패드를 터치하여 PIN을 입력하세요'
        },
        {
          id: 'step3',
          instruction: '원하는 서비스를 선택하세요',
          action: 'select',
          options: ['현금 인출', '잔액 조회', '이체', '예금'],
          feedback: '화면에서 원하는 서비스를 선택하세요'
        },
        {
          id: 'step4',
          instruction: '금액을 입력하세요',
          action: 'tap',
          target: 'amount-input',
          feedback: '원하는 금액을 입력하세요'
        },
        {
          id: 'step5',
          instruction: '확인 버튼을 누르세요',
          action: 'tap',
          target: 'confirm-button',
          feedback: '거래를 확인하세요'
        }
      ]
    },
    {
      id: 'hospital-kiosk',
      name: '병원 키오스크',
      description: '병원에서 접수 및 예약을 위한 키오스크 사용법을 학습합니다',
      icon: '🏥',
      difficulty: 'intermediate',
      duration: 8,
      category: 'navigation',
      steps: [
        {
          id: 'step1',
          instruction: '방문 목적을 선택하세요',
          action: 'select',
          options: ['초진 예약', '재진 예약', '접수', '검사 결과 조회'],
          feedback: '원하는 서비스를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '환자 정보를 입력하세요',
          action: 'tap',
          target: 'patient-info',
          feedback: '주민등록번호나 환자번호를 입력하세요'
        },
        {
          id: 'step3',
          instruction: '진료과를 선택하세요',
          action: 'select',
          options: ['내과', '외과', '소아과', '산부인과', '정신과'],
          feedback: '원하는 진료과를 선택하세요'
        },
        {
          id: 'step4',
          instruction: '예약 가능한 시간을 선택하세요',
          action: 'tap',
          target: 'time-slot',
          feedback: '원하는 시간대를 선택하세요'
        },
        {
          id: 'step5',
          instruction: '예약을 확정하세요',
          action: 'tap',
          target: 'confirm-reservation',
          feedback: '예약 정보를 확인하고 확정하세요'
        }
      ]
    },
    {
      id: 'shopping-kiosk',
      name: '쇼핑몰 키오스크',
      description: '쇼핑몰에서 상품 주문 및 결제를 위한 키오스크 사용법을 학습합니다',
      icon: '🛍️',
      difficulty: 'advanced',
      duration: 10,
      category: 'touch',
      steps: [
        {
          id: 'step1',
          instruction: '카테고리를 선택하세요',
          action: 'select',
          options: ['음식', '음료', '디저트', '세트메뉴'],
          feedback: '원하는 카테고리를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '상품을 선택하세요',
          action: 'tap',
          target: 'product-list',
          feedback: '원하는 상품을 터치하세요'
        },
        {
          id: 'step3',
          instruction: '수량을 조절하세요',
          action: 'tap',
          target: 'quantity-control',
          feedback: '+ 또는 - 버튼으로 수량을 조절하세요'
        },
        {
          id: 'step4',
          instruction: '장바구니에 추가하세요',
          action: 'tap',
          target: 'add-to-cart',
          feedback: '장바구니에 추가 버튼을 누르세요'
        },
        {
          id: 'step5',
          instruction: '결제 방법을 선택하세요',
          action: 'select',
          options: ['카드 결제', '현금 결제', '모바일 결제'],
          feedback: '원하는 결제 방법을 선택하세요'
        },
        {
          id: 'step6',
          instruction: '주문을 완료하세요',
          action: 'tap',
          target: 'complete-order',
          feedback: '주문 완료 버튼을 누르세요'
        }
      ]
    }
  ]

  // 훈련 시작
  const startTraining = async (training: KioskTraining) => {
    try {
      const sessionResponse = await trainingAPI.startSession({
        training_type: 'kiosk',
        module: training.id,
        difficulty: training.difficulty
      })

      setGameState(prev => ({
        ...prev,
        currentTraining: training,
        currentStep: 0,
        gameStarted: true,
        timeLeft: training.duration * 60,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: sessionResponse.session_id.toString(),
        startTime: Date.now(),
        streak: 0,
        maxStreak: 0
      }))
      setShowInstructions(false)

      toast.success(`${training.name} 훈련이 시작되었습니다!`)
    } catch (error) {
      console.error('Failed to start training session:', error)
      toast.error('훈련 세션 시작에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 단계 완료 처리
  const completeStep = (isCorrect: boolean) => {
    if (!gameState.currentTraining) return

    // const currentStepData = gameState.currentTraining.steps[gameState.currentStep] // 사용하지 않음
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? 100 * (prev.streak + 1) : 0),
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : prev.streak)
    }))

    // 피드백 표시
    setFeedbackMessage(isCorrect ? '정확합니다! 🎉' : '다시 시도해보세요! 😊')
    setShowFeedback(true)
    
    setTimeout(() => {
      setShowFeedback(false)
      
      // 다음 단계로 이동
      if (gameState.currentTraining && gameState.currentStep < gameState.currentTraining.steps.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1
        }))
        setSelectedOption(null)
      } else {
        // 훈련 완료
        setGameState(prev => ({
          ...prev,
          gameCompleted: true
        }))
      }
    }, 1500)
  }

  // 옵션 선택 처리
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    
    // 정답 체크 (간단한 로직)
    const currentStepData = gameState.currentTraining?.steps[gameState.currentStep]
    const isCorrect = currentStepData?.options?.includes(option) || true
    
    setTimeout(() => {
      completeStep(isCorrect)
    }, 500)
  }

  // 터치 액션 처리
  const handleTouchAction = (target: string) => {
    // 정답 체크 (간단한 로직)
    const currentStepData = gameState.currentTraining?.steps[gameState.currentStep]
    const isCorrect = currentStepData?.target === target
    
    completeStep(isCorrect)
  }

  // 시간 관리
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState.gameStarted && gameState.timeLeft > 0 && !gameState.gameCompleted) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }))
      }, 1000)
    } else if (gameState.timeLeft === 0 && !gameState.gameCompleted) {
      setGameState(prev => ({
        ...prev,
        gameCompleted: true
      }))
    }
    return () => clearTimeout(timer)
  }, [gameState.timeLeft, gameState.gameStarted, gameState.gameCompleted])

  const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg border-b-4 border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/training" className="text-blue-500 hover:text-blue-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-blue-600">키오스크 훈련</h1>
                <p className="text-sm text-gray-600">실제 키오스크 사용법 학습</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 시작
                </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 게임 상태 표시 */}
        {gameState.gameStarted && !gameState.gameCompleted && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.currentStep + 1}/{gameState.currentTraining?.steps.length}</div>
              <div className="text-sm text-gray-600">단계</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-success-600">{gameState.score}</div>
              <div className="text-sm text-gray-600">점수</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warning-600">{Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-600">시간</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-secondary-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">정확도</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
              <div className="text-sm text-gray-600">연속</div>
          </div>
          </motion.div>
        )}

        {/* 게임 화면 */}
        {gameState.gameStarted && !gameState.gameCompleted && gameState.currentTraining && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {/* 키오스크 화면 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {gameState.currentTraining.name} - 단계 {gameState.currentStep + 1}
              </h3>
              
              {/* 키오스크 인터페이스 */}
              <div className="bg-gray-100 rounded-xl p-8 mb-6">
                <div className="text-4xl mb-4">{gameState.currentTraining.icon}</div>
                
                {/* 현재 단계 지시사항 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    {gameState.currentTraining.steps[gameState.currentStep].instruction}
                  </h4>
                  <p className="text-blue-600">
                    {gameState.currentTraining.steps[gameState.currentStep].feedback}
                  </p>
                </div>

                {/* 키오스크 버튼들 */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {gameState.currentTraining.steps[gameState.currentStep].options ? (
                    // 선택형 질문
                    gameState.currentTraining.steps[gameState.currentStep].options!.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedOption === option
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    // 터치 액션
                    <div className="col-span-2 grid grid-cols-3 gap-4">
                      <button
                        onClick={() => handleTouchAction('card-slot')}
                        className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        💳 카드삽입구
                      </button>
                      <button
                        onClick={() => handleTouchAction('pin-pad')}
                        className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        🔢 PIN패드
                      </button>
                      <button
                        onClick={() => handleTouchAction('confirm-button')}
                        className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        ✅ 확인
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 피드백 */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-blue-200">
                <div className="text-4xl mb-4">
                  {feedbackMessage.includes('정확') ? '🎉' : '😊'}
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {feedbackMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 훈련 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="card mb-8">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                훈련 완료!
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">최종 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">정확도</div>
              </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{gameState.maxStreak}</div>
                  <div className="text-sm text-gray-600">최대 연속</div>
            </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">{Math.floor((Date.now() - (gameState.startTime || 0)) / 1000)}초</div>
                  <div className="text-sm text-gray-600">소요 시간</div>
          </div>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  다시 하기
                </button>
                <Link href="/training" className="btn-secondary">
                  훈련 목록
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* 시작 화면 */}
        {!gameState.gameStarted && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {!user ? (
              <div className="max-w-md mx-auto">
                <div className="card mb-8">
                  <div className="text-6xl mb-6">🔐</div>
                  <h2 className="text-3xl font-bold text-blue-600 mb-6">
                    로그인이 필요합니다
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    훈련 결과를 저장하고 진행률을 추적하려면 로그인해주세요.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="/" className="btn-primary flex-1">
                      로그인하기
                    </Link>
                    <Link href="/training" className="btn-secondary flex-1">
                      뒤로 가기
                    </Link>
              </div>
                </div>
              </div>
            ) : showInstructions ? (
              <div className="max-w-4xl mx-auto">
                <div className="card mb-8">
                  <div className="text-6xl mb-6">🖥️</div>
                  <h2 className="text-3xl font-bold text-blue-600 mb-6">
                    키오스크 훈련
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <p>실제 키오스크와 동일한 인터페이스로 훈련합니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <p>단계별로 안내받으며 <span className="text-blue-600 font-bold">터치 조작</span>을 학습합니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-bold text-sm">3</span>
                      </div>
                      <p>ATM, 병원, 쇼핑몰 등 <span className="text-green-600 font-bold">다양한 키오스크</span>를 체험할 수 있습니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-bold text-sm">4</span>
                      </div>
                      <p>실제 상황에서 <span className="text-purple-600 font-bold">자신감</span>을 갖고 키오스크를 사용할 수 있습니다!</p>
            </div>
          </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-blue-700 text-sm">
                      🎯 실제 키오스크 사용법을 단계별로 학습해보세요!
                    </p>
                  </div>
                </div>

                {/* 훈련 목록 */}
                <div className="grid md:grid-cols-3 gap-6">
                  {kioskTrainings.map(training => (
                    <div
                      key={training.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                    >
                      <div className="text-4xl mb-4">{training.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{training.name}</h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {training.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          training.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          training.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {training.difficulty === 'beginner' ? '초급' :
                           training.difficulty === 'intermediate' ? '중급' : '고급'}
                  </span>
                        <span className="text-sm text-gray-600">⏱️ {training.duration}분</span>
                  </div>
                      <button
                        onClick={() => startTraining(training)}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
                      >
                  훈련 시작
                </button>
              </div>
            ))}
          </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🖥️</div>
                <h2 className="text-3xl font-bold text-blue-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  키오스크 사용법을 단계별로 학습해보세요!
                </p>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="btn-primary"
                >
                  시작하기
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}