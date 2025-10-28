'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// 키오스크 훈련 타입
interface KioskTraining {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  category: 'touch' | 'voice' | 'visual' | 'navigation'
  theme: 'atm' | 'hospital' | 'shopping' | 'library' | 'pharmacy' | 'photobooth'
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
  startTime: number | null
  correctAnswers: number
  totalAnswers: number
  streak: number
  maxStreak: number
}

export default function KioskTrainingPage() {
  const [gameState, setGameState] = useState<GameState>({
    currentTraining: null,
    currentStep: 0,
    score: 0,
    timeLeft: 300,
    gameStarted: false,
    gameCompleted: false,
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
  const [showOpening, setShowOpening] = useState(true)

  // 게임 초기화 함수
  const resetGame = () => {
    setGameState({
      currentTraining: null,
      currentStep: 0,
      score: 0,
      timeLeft: 300,
      gameStarted: false,
      gameCompleted: false,
      startTime: null,
      correctAnswers: 0,
      totalAnswers: 0,
      streak: 0,
      maxStreak: 0
    })
    setShowInstructions(true)
    setShowFeedback(false)
    setFeedbackMessage('')
    setSelectedOption(null)
  }

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
      theme: 'atm',
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
      theme: 'hospital',
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
      theme: 'shopping',
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
    },
    {
      id: 'library-kiosk',
      name: '도서관 키오스크',
      description: '도서관에서 도서 대출/반납을 위한 키오스크 사용법을 학습합니다',
      icon: '📚',
      difficulty: 'beginner',
      duration: 6,
      category: 'touch',
      theme: 'library',
      steps: [
        {
          id: 'step1',
          instruction: '서비스를 선택하세요',
          action: 'select',
          options: ['도서 대출', '도서 반납', '연장 신청', '예약 조회'],
          feedback: '원하는 서비스를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '회원증을 스캔하세요',
          action: 'tap',
          target: 'card-scanner',
          feedback: '회원증을 스캔 영역에 올려주세요'
        },
        {
          id: 'step3',
          instruction: '도서를 스캔하세요',
          action: 'tap',
          target: 'book-scanner',
          feedback: '도서의 바코드를 스캔하세요'
        },
        {
          id: 'step4',
          instruction: '확인 버튼을 누르세요',
          action: 'tap',
          target: 'confirm-button',
          feedback: '대출/반납을 확인하세요'
        }
      ]
    },
    {
      id: 'pharmacy-kiosk',
      name: '약국 키오스크',
      description: '약국에서 처방전 접수 및 약품 조회를 위한 키오스크 사용법을 학습합니다',
      icon: '💊',
      difficulty: 'intermediate',
      duration: 7,
      category: 'navigation',
      theme: 'pharmacy',
      steps: [
        {
          id: 'step1',
          instruction: '서비스를 선택하세요',
          action: 'select',
          options: ['처방전 접수', '약품 조회', '복용법 안내', '예약 조회'],
          feedback: '원하는 서비스를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '처방전을 스캔하세요',
          action: 'tap',
          target: 'prescription-scanner',
          feedback: '처방전을 스캔 영역에 올려주세요'
        },
        {
          id: 'step3',
          instruction: '환자 정보를 확인하세요',
          action: 'tap',
          target: 'patient-info',
          feedback: '화면에 표시된 환자 정보를 확인하세요'
        },
        {
          id: 'step4',
          instruction: '접수를 완료하세요',
          action: 'tap',
          target: 'complete-button',
          feedback: '접수 완료 버튼을 누르세요'
        }
      ]
    },
    {
      id: 'photobooth-kiosk',
      name: '포토부스 키오스크',
      description: '인생네컷처럼 포토부스에서 사진 촬영 및 출력을 위한 키오스크 사용법을 학습합니다',
      icon: '📸',
      difficulty: 'beginner',
      duration: 8,
      category: 'touch',
      theme: 'photobooth',
      steps: [
        {
          id: 'step1',
          instruction: '테마를 선택하세요',
          action: 'select',
          options: ['클래식', '로맨틱', '펑키', '귀여운'],
          feedback: '원하는 포토 테마를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '인원수를 선택하세요',
          action: 'select',
          options: ['1명', '2명', '3명', '4명'],
          feedback: '촬영할 인원수를 선택하세요'
        },
        {
          id: 'step3',
          instruction: '결제 방법을 선택하세요',
          action: 'select',
          options: ['카드 결제', '현금 결제', '모바일 결제'],
          feedback: '원하는 결제 방법을 선택하세요'
        },
        {
          id: 'step4',
          instruction: '촬영을 시작하세요',
          action: 'tap',
          target: 'start-photo',
          feedback: '촬영 시작 버튼을 누르세요'
        },
        {
          id: 'step5',
          instruction: '사진을 선택하세요',
          action: 'tap',
          target: 'select-photos',
          feedback: '마음에 드는 사진을 선택하세요'
        },
        {
          id: 'step6',
          instruction: '출력을 완료하세요',
          action: 'tap',
          target: 'print-photos',
          feedback: '사진 출력 완료 버튼을 누르세요'
        }
      ]
    }
  ]

  // 훈련 시작
  const startTraining = (training: KioskTraining) => {
    setGameState(prev => ({
      ...prev,
      currentTraining: training,
      currentStep: 0,
      gameStarted: true,
      timeLeft: training.duration * 60,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      startTime: Date.now(),
      streak: 0,
      maxStreak: 0
    }))
    setShowInstructions(false)
  }

  // 단계 완료 처리
  const completeStep = (isCorrect: boolean) => {
    if (!gameState.currentTraining) return
    
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
        
        // 게임 결과를 로컬 스토리지에 저장
        try {
          const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
          gameHistory.push({
            game: 'kiosk-training',
            training: gameState.currentTraining?.name,
            timestamp: new Date().toISOString(),
            score: gameState.score,
            accuracy: Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100),
            duration: gameState.currentTraining?.duration,
            maxStreak: gameState.maxStreak
          })
          localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
        } catch (error) {
          console.log('게임 결과 저장 실패:', error)
        }
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

  // 오프닝 애니메이션 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOpening(false)
    }, 3000) // 3초 후 오프닝 종료

    return () => clearTimeout(timer)
  }, [])

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

  const getModernThemeStyles = (theme: string) => {
    switch (theme) {
      case 'atm':
        return {
          cardBg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          iconBg: 'bg-blue-200',
          textColor: 'text-blue-800',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          buttonText: 'text-white'
        }
      case 'hospital':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
          iconBg: 'bg-emerald-200',
          textColor: 'text-emerald-800',
          buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
          buttonText: 'text-white'
        }
      case 'shopping':
        return {
          cardBg: 'bg-gradient-to-br from-violet-50 to-violet-100',
          iconBg: 'bg-violet-200',
          textColor: 'text-violet-800',
          buttonBg: 'bg-violet-500 hover:bg-violet-600',
          buttonText: 'text-white'
        }
      case 'library':
        return {
          cardBg: 'bg-gradient-to-br from-amber-50 to-amber-100',
          iconBg: 'bg-amber-200',
          textColor: 'text-amber-800',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          buttonText: 'text-white'
        }
      case 'pharmacy':
        return {
          cardBg: 'bg-gradient-to-br from-rose-50 to-rose-100',
          iconBg: 'bg-rose-200',
          textColor: 'text-rose-800',
          buttonBg: 'bg-rose-500 hover:bg-rose-600',
          buttonText: 'text-white'
        }
      case 'photobooth':
        return {
          cardBg: 'bg-gradient-to-br from-pink-50 to-pink-100',
          iconBg: 'bg-pink-200',
          textColor: 'text-pink-800',
          buttonBg: 'bg-pink-500 hover:bg-pink-600',
          buttonText: 'text-white'
        }
      default:
        return {
          cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
          iconBg: 'bg-slate-200',
          textColor: 'text-slate-800',
          buttonBg: 'bg-slate-500 hover:bg-slate-600',
          buttonText: 'text-white'
        }
    }
  }

  const getKioskLayout = (theme: string) => {
    switch (theme) {
      case 'atm':
        return {
          background: 'bg-gradient-to-br from-blue-900 to-blue-700',
          cardBackground: 'bg-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          textColor: 'text-blue-100',
          accentColor: 'border-blue-400',
          iconBg: 'bg-blue-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-blue-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      case 'hospital':
        return {
          background: 'bg-gradient-to-br from-green-800 to-green-600',
          cardBackground: 'bg-green-700',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          textColor: 'text-green-100',
          accentColor: 'border-green-400',
          iconBg: 'bg-green-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-green-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      case 'shopping':
        return {
          background: 'bg-gradient-to-br from-purple-800 to-purple-600',
          cardBackground: 'bg-purple-700',
          buttonColor: 'bg-purple-600 hover:bg-purple-700',
          textColor: 'text-purple-100',
          accentColor: 'border-purple-400',
          iconBg: 'bg-purple-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-purple-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      case 'library':
        return {
          background: 'bg-gradient-to-br from-amber-800 to-amber-600',
          cardBackground: 'bg-amber-700',
          buttonColor: 'bg-amber-600 hover:bg-amber-700',
          textColor: 'text-amber-100',
          accentColor: 'border-amber-400',
          iconBg: 'bg-amber-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-amber-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      case 'pharmacy':
        return {
          background: 'bg-gradient-to-br from-red-800 to-red-600',
          cardBackground: 'bg-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          textColor: 'text-red-100',
          accentColor: 'border-red-400',
          iconBg: 'bg-red-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-red-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      case 'photobooth':
        return {
          background: 'bg-gradient-to-br from-pink-800 to-pink-600',
          cardBackground: 'bg-pink-700',
          buttonColor: 'bg-pink-600 hover:bg-pink-700',
          textColor: 'text-pink-100',
          accentColor: 'border-pink-400',
          iconBg: 'bg-pink-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-pink-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
      default:
        return {
          background: 'bg-gradient-to-br from-gray-800 to-gray-600',
          cardBackground: 'bg-gray-700',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          textColor: 'text-gray-100',
          accentColor: 'border-gray-400',
          iconBg: 'bg-gray-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-gray-900',
          cardSlot: 'bg-gray-600',
          keypad: 'bg-gray-700'
        }
    }
  }

  // 오프닝 화면
  if (showOpening) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* Link IT 로고 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/images/link-it-logo-main.png"
              alt="Link IT"
              width={200}
              height={200}
              className="mx-auto mb-6"
            />
          </motion.div>
          
          {/* Link IT 텍스트 */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-6xl font-bold text-gray-900 mb-4"
          >
            Link IT
          </motion.h1>
          
          {/* 서브텍스트 */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xl text-gray-700 mb-8"
          >
            키오스크 훈련
          </motion.p>
          
          {/* 로딩 애니메이션 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-mint-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50"
    >
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-mint-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center space-x-4">
              <Link href="/training" className="text-gray-700 hover:text-mint-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Image
                src="/images/link-it-logo-small.png"
                alt="Link IT 로고"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">키오스크 훈련</h1>
                <p className="text-sm text-gray-500">실제 키오스크 사용법을 학습해보세요</p>
              </div>
            </div>

            {/* 액션 버튼 */}
            <button
              onClick={resetGame}
              className="bg-mint-100 hover:bg-mint-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>초기화</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* 게임 상태 표시 */}
        {gameState.gameStarted && !gameState.gameCompleted && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center border border-mint-200/50">
              <div className="text-2xl font-bold text-mint-600">{gameState.currentStep + 1}/{gameState.currentTraining?.steps.length}</div>
              <div className="text-sm text-gray-600 mt-1">단계</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center border border-mint-200/50">
              <div className="text-2xl font-bold text-lavender-600">{gameState.score}</div>
              <div className="text-sm text-gray-600 mt-1">점수</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center border border-mint-200/50">
              <div className="text-2xl font-bold text-yellow-600">{Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-600 mt-1">시간</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center border border-mint-200/50">
              <div className="text-2xl font-bold text-mint-600">{gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0}%</div>
              <div className="text-sm text-gray-600 mt-1">정확도</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center border border-mint-200/50">
              <div className="text-2xl font-bold text-lavender-600">{gameState.streak}</div>
              <div className="text-sm text-gray-600 mt-1">연속</div>
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
            {/* 키오스크 기계 전체 */}
            <div className={`max-w-4xl mx-auto rounded-3xl shadow-2xl p-8 ${getKioskLayout(gameState.currentTraining.theme).background}`}>
              {/* 키오스크 상단 로고 */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{gameState.currentTraining.icon}</div>
                <h3 className={`text-2xl font-bold ${getKioskLayout(gameState.currentTraining.theme).textColor}`}>
                  {gameState.currentTraining.name}
                </h3>
                <p className={`text-sm ${getKioskLayout(gameState.currentTraining.theme).textColor} opacity-80`}>
                  단계 {gameState.currentStep + 1} / {gameState.currentTraining.steps.length}
                </p>
              </div>

              {/* 키오스크 기계 본체 */}
              <div className={`rounded-2xl p-6 ${getKioskLayout(gameState.currentTraining.theme).machineBg} shadow-inner`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* 왼쪽: 카드 투입구 및 키패드 */}
                  <div className="space-y-4">
                    {/* 카드 투입구 */}
                    <div className="text-center">
                      <div className={`w-32 h-20 mx-auto rounded-lg border-2 border-dashed ${getKioskLayout(gameState.currentTraining.theme).cardSlot} flex items-center justify-center mb-2`}>
                        <span className="text-gray-400 text-sm">💳</span>
                      </div>
                      <p className={`text-xs ${getKioskLayout(gameState.currentTraining.theme).textColor} opacity-70`}>카드 투입구</p>
                    </div>

                    {/* 키패드 */}
                    <div className={`rounded-lg p-4 ${getKioskLayout(gameState.currentTraining.theme).keypad}`}>
                      <p className={`text-xs text-center mb-3 ${getKioskLayout(gameState.currentTraining.theme).textColor} opacity-70`}>키패드</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((key) => (
                          <button
                            key={key}
                            onClick={() => handleTouchAction('pin-pad')}
                            className={`w-8 h-8 rounded text-xs font-bold ${getKioskLayout(gameState.currentTraining!.theme).buttonColor} ${getKioskLayout(gameState.currentTraining!.theme).textColor} hover:opacity-80 transition-opacity`}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 현금 투입구 (ATM용) */}
                    {gameState.currentTraining.theme === 'atm' && (
                      <div className="text-center">
                        <div className={`w-24 h-16 mx-auto rounded-lg border-2 border-dashed ${getKioskLayout(gameState.currentTraining.theme).cardSlot} flex items-center justify-center mb-2`}>
                          <span className="text-gray-400 text-sm">💰</span>
                        </div>
                        <p className={`text-xs ${getKioskLayout(gameState.currentTraining.theme).textColor} opacity-70`}>현금 투입구</p>
                      </div>
                    )}

                    {/* 스캐너 (도서관/약국용) */}
                    {(gameState.currentTraining.theme === 'library' || gameState.currentTraining.theme === 'pharmacy') && (
                      <div className="text-center">
                        <div className={`w-32 h-20 mx-auto rounded-lg border-2 border-dashed ${getKioskLayout(gameState.currentTraining.theme).cardSlot} flex items-center justify-center mb-2`}>
                          <span className="text-gray-400 text-sm">📄</span>
                        </div>
                        <p className={`text-xs ${getKioskLayout(gameState.currentTraining.theme).textColor} opacity-70`}>스캔 영역</p>
                      </div>
                    )}
                  </div>

                  {/* 가운데: 메인 화면 */}
                  <div className="lg:col-span-2">
                    <div className={`rounded-xl p-6 ${getKioskLayout(gameState.currentTraining.theme).screenBg} border-2 ${getKioskLayout(gameState.currentTraining.theme).accentColor}`}>
                      {/* 현재 단계 지시사항 */}
                      <div className={`border rounded-lg p-4 mb-6 ${getKioskLayout(gameState.currentTraining.theme).accentColor} ${getKioskLayout(gameState.currentTraining.theme).cardBackground}`}>
                        <h4 className={`text-lg font-semibold mb-2 ${getKioskLayout(gameState.currentTraining.theme).textColor}`}>
                          {gameState.currentTraining.steps[gameState.currentStep].instruction}
                        </h4>
                        <p className={getKioskLayout(gameState.currentTraining.theme).textColor}>
                          {gameState.currentTraining.steps[gameState.currentStep].feedback}
                        </p>
                      </div>

                      {/* 화면 버튼들 */}
                      <div className="grid grid-cols-2 gap-4">
                        {gameState.currentTraining.steps[gameState.currentStep].options ? (
                          // 선택형 질문
                          gameState.currentTraining.steps[gameState.currentStep].options!.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionSelect(option)}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                selectedOption === option
                                  ? `${getKioskLayout(gameState.currentTraining!.theme).buttonColor} text-white border-current`
                                  : `bg-white text-gray-700 border-gray-300 hover:border-current hover:bg-opacity-20`
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
                              className={`p-4 rounded-lg hover:opacity-80 transition-colors ${getKioskLayout(gameState.currentTraining!.theme).buttonColor} ${getKioskLayout(gameState.currentTraining!.theme).textColor}`}
                            >
                              💳 카드삽입구
                            </button>
                            <button
                              onClick={() => handleTouchAction('pin-pad')}
                              className={`p-4 rounded-lg hover:opacity-80 transition-colors ${getKioskLayout(gameState.currentTraining!.theme).buttonColor} ${getKioskLayout(gameState.currentTraining!.theme).textColor}`}
                            >
                              🔢 PIN패드
                            </button>
                            <button
                              onClick={() => handleTouchAction('confirm-button')}
                              className={`p-4 rounded-lg hover:opacity-80 transition-colors ${getKioskLayout(gameState.currentTraining!.theme).buttonColor} ${getKioskLayout(gameState.currentTraining!.theme).textColor}`}
                            >
                              ✅ 확인
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 키오스크 하단 기능 버튼들 */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button className={`px-6 py-2 rounded-lg ${getKioskLayout(gameState.currentTraining.theme).buttonColor} ${getKioskLayout(gameState.currentTraining.theme).textColor} text-sm`}>
                    취소
                  </button>
                  <button className={`px-6 py-2 rounded-lg ${getKioskLayout(gameState.currentTraining.theme).buttonColor} ${getKioskLayout(gameState.currentTraining.theme).textColor} text-sm`}>
                    도움말
                  </button>
                  <button className={`px-6 py-2 rounded-lg ${getKioskLayout(gameState.currentTraining.theme).buttonColor} ${getKioskLayout(gameState.currentTraining.theme).textColor} text-sm`}>
                    언어변경
                  </button>
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
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                훈련 완료!
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">최종 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0}%</div>
                  <div className="text-sm text-gray-600">정확도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{gameState.maxStreak}</div>
                  <div className="text-sm text-gray-600">최대 연속</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{Math.floor((Date.now() - (gameState.startTime || 0)) / 1000)}초</div>
                  <div className="text-sm text-gray-600">소요 시간</div>
                </div>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                >
                  다시 하기
                </button>
                <Link href="/training" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg">
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
            {showInstructions ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl mb-12 border border-mint-200/50">
                  <div className="text-8xl mb-8">🖥️</div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    키오스크 훈련
                  </h2>
                  <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    실제 키오스크와 동일한 인터페이스로 안전하게 훈련해보세요
                  </p>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>실제 키오스크와 동일한 인터페이스로 훈련합니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>단계별로 안내받으며 <span className="text-mint-600 font-bold">터치 조작</span>을 학습합니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>ATM, 병원, 쇼핑몰 등 <span className="text-lavender-600 font-bold">다양한 키오스크</span>를 체험할 수 있습니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>실제 상황에서 <span className="text-yellow-600 font-bold">자신감</span>을 갖고 키오스크를 사용할 수 있습니다!</p>
                    </div>
                  </div>
                  <div className="bg-mint-50 border border-mint-200 rounded-lg p-3 mt-4">
                    <p className="text-mint-700 text-sm">
                      🎯 실제 키오스크 사용법을 단계별로 학습해보세요!
                    </p>
                  </div>
                </div>

                {/* 훈련 목록 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {kioskTrainings.map(training => {
                    const themeStyles = getModernThemeStyles(training.theme)
                    return (
                      <motion.div
                        key={training.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${themeStyles.cardBg} border border-white/20`}
                      >
                        <div className={`text-5xl mb-6 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${themeStyles.iconBg}`}>
                          {training.icon}
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${themeStyles.textColor}`}>{training.name}</h3>
                        <p className={`mb-6 text-sm leading-relaxed ${themeStyles.textColor} opacity-80`}>
                          {training.description}
                        </p>
                        <div className="flex items-center justify-between mb-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            training.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                            training.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {training.difficulty === 'beginner' ? '초급' :
                             training.difficulty === 'intermediate' ? '중급' : '고급'}
                          </span>
                          <span className={`text-sm ${themeStyles.textColor} opacity-70`}>⏱️ {training.duration}분</span>
                        </div>
                        <button
                          onClick={() => {
                            if (training.id === 'photobooth-kiosk') {
                              window.location.href = '/kiosk-training/photobooth'
                            } else {
                              startTraining(training)
                            }
                          }}
                          className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${themeStyles.buttonBg} ${themeStyles.buttonText}`}
                        >
                          훈련 시작
                        </button>
                      </motion.div>
                    )
                  })}
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
                  className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
                >
                  시작하기
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}