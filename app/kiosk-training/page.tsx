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
  theme: 'atm' | 'hospital' | 'shopping' | 'library' | 'pharmacy' | 'photobooth' | 'cafe' | 'restaurant' | 'train' | 'civil' | 'delivery'
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

  // 키오스크 훈련 데이터 - 6개 시나리오
  const kioskTrainings: KioskTraining[] = [
    {
      id: 'cafe',
      name: '카페 주문',
      description: '음료 주문부터 결제까지 실제 카페 키오스크를 체험해보세요',
      icon: '☕',
      difficulty: 'beginner',
      duration: 8,
      category: 'touch',
      theme: 'cafe',
      steps: [
        {
          id: 'step1',
          instruction: '메뉴를 선택하세요',
          action: 'tap',
          target: 'menu-item',
          feedback: '원하는 음료를 터치하세요'
        },
        {
          id: 'step2',
          instruction: '옵션을 선택하세요',
          action: 'select',
          options: ['사이즈', '온도', '추가옵션'],
          feedback: '사이즈와 온도를 선택하세요'
        },
        {
          id: 'step3',
          instruction: '장바구니를 확인하세요',
          action: 'tap',
          target: 'cart',
          feedback: '주문 내용을 확인하세요'
        },
        {
          id: 'step4',
          instruction: '픽업 이름을 입력하세요',
          action: 'tap',
          target: 'name-input',
          feedback: '픽업할 이름을 입력하세요'
        },
        {
          id: 'step5',
          instruction: '결제 방법을 선택하세요',
          action: 'select',
          options: ['카드 결제', 'QR 결제', '현금 결제'],
          feedback: '원하는 결제 방법을 선택하세요'
        },
        {
          id: 'step6',
          instruction: '영수증을 확인하세요',
          action: 'tap',
          target: 'receipt',
          feedback: '주문 완료 영수증을 확인하세요'
        }
      ]
    },
    {
      id: 'restaurant',
      name: '식당 주문',
      description: '음식 주문부터 호출벨까지 식당 키오스크를 체험해보세요',
      icon: '🍽️',
      difficulty: 'intermediate',
      duration: 10,
      category: 'touch',
      theme: 'restaurant',
      steps: [
        {
          id: 'step1',
          instruction: '카테고리를 선택하세요',
          action: 'select',
          options: ['메인 요리', '면류', '밥류', '사이드'],
          feedback: '원하는 음식 카테고리를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '메뉴를 선택하세요',
          action: 'tap',
          target: 'menu-item',
          feedback: '원하는 음식을 터치하세요'
        },
        {
          id: 'step3',
          instruction: '매장/포장을 선택하세요',
          action: 'select',
          options: ['매장 식사', '포장'],
          feedback: '매장에서 드실지 포장할지 선택하세요'
        },
        {
          id: 'step4',
          instruction: '주문을 확인하세요',
          action: 'tap',
          target: 'order-summary',
          feedback: '주문 내용을 확인하세요'
        },
        {
          id: 'step5',
          instruction: '결제를 완료하세요',
          action: 'tap',
          target: 'payment',
          feedback: '결제를 완료하세요'
        },
        {
          id: 'step6',
          instruction: '호출벨 번호를 확인하세요',
          action: 'tap',
          target: 'bell-number',
          feedback: '호출벨 번호를 확인하세요'
        }
      ]
    },
    {
      id: 'photobooth',
      name: '포토부스',
      description: '사진 촬영부터 인쇄까지 포토부스 키오스크를 체험해보세요',
      icon: '📸',
      difficulty: 'beginner',
      duration: 8,
      category: 'touch',
      theme: 'photobooth',
      steps: [
        {
          id: 'step1',
          instruction: '레이아웃을 선택하세요',
          action: 'select',
          options: ['2컷', '4컷', '증명사진'],
          feedback: '원하는 사진 레이아웃을 선택하세요'
        },
        {
          id: 'step2',
          instruction: '사진을 촬영하세요',
          action: 'tap',
          target: 'camera',
          feedback: '카메라를 맞추고 촬영하세요'
        },
        {
          id: 'step3',
          instruction: '편집을 하세요',
          action: 'tap',
          target: 'edit',
          feedback: '필터와 프레임을 선택하세요'
        },
        {
          id: 'step4',
          instruction: '인쇄/저장을 하세요',
          action: 'tap',
          target: 'print-save',
          feedback: '인쇄하거나 저장하세요'
        }
      ]
    },
    {
      id: 'train',
      name: '기차표 예매',
      description: '기차표 예매부터 승차권까지 기차역 키오스크를 체험해보세요',
      icon: '🚄',
      difficulty: 'intermediate',
      duration: 12,
      category: 'navigation',
      theme: 'train',
      steps: [
        {
          id: 'step1',
          instruction: '출발지와 도착지를 선택하세요',
          action: 'tap',
          target: 'station-select',
          feedback: '출발지와 도착지를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '날짜와 시간을 선택하세요',
          action: 'tap',
          target: 'datetime-select',
          feedback: '여행 날짜와 시간을 선택하세요'
        },
        {
          id: 'step3',
          instruction: '열차를 선택하세요',
          action: 'tap',
          target: 'train-select',
          feedback: '원하는 열차를 선택하세요'
        },
        {
          id: 'step4',
          instruction: '좌석을 선택하세요',
          action: 'tap',
          target: 'seat-select',
          feedback: '원하는 좌석을 선택하세요'
        },
        {
          id: 'step5',
          instruction: '승객 정보를 입력하세요',
          action: 'tap',
          target: 'passenger-info',
          feedback: '승객 정보를 입력하세요'
        },
        {
          id: 'step6',
          instruction: '승차권을 확인하세요',
          action: 'tap',
          target: 'ticket',
          feedback: '승차권을 확인하세요'
        }
      ]
    },
    {
      id: 'civil',
      name: '민원발급',
      description: '민원서류 발급 신청부터 완료까지 민원센터 키오스크를 체험해보세요',
      icon: '🏛️',
      difficulty: 'advanced',
      duration: 15,
      category: 'navigation',
      theme: 'civil',
      steps: [
        {
          id: 'step1',
          instruction: '업무를 선택하세요',
          action: 'select',
          options: ['주민등록등본', '가족관계증명서', '납세증명서', '소득증명서'],
          feedback: '발급받을 서류를 선택하세요'
        },
        {
          id: 'step2',
          instruction: '신청자 구분을 선택하세요',
          action: 'select',
          options: ['본인', '대리인'],
          feedback: '본인인지 대리인인지 선택하세요'
        },
        {
          id: 'step3',
          instruction: '본인인증을 하세요',
          action: 'tap',
          target: 'identity-verification',
          feedback: '신분증을 촬영하거나 정보를 입력하세요'
        },
        {
          id: 'step4',
          instruction: '발급 설정을 하세요',
          action: 'tap',
          target: 'issue-config',
          feedback: '발급 옵션을 설정하세요'
        },
        {
          id: 'step5',
          instruction: '수수료를 결제하세요',
          action: 'tap',
          target: 'fee-payment',
          feedback: '수수료를 결제하세요'
        },
        {
          id: 'step6',
          instruction: '미리보기를 확인하세요',
          action: 'tap',
          target: 'preview',
          feedback: '발급될 서류를 확인하세요'
        }
      ]
    },
    {
      id: 'delivery',
      name: '배달앱 주문',
      description: '배달 주문부터 추적까지 배달앱 키오스크를 체험해보세요',
      icon: '🚚',
      difficulty: 'intermediate',
      duration: 10,
      category: 'touch',
      theme: 'delivery',
      steps: [
        {
          id: 'step1',
          instruction: '주소를 입력하세요',
          action: 'tap',
          target: 'address-input',
          feedback: '배달받을 주소를 입력하세요'
        },
        {
          id: 'step2',
          instruction: '매장을 선택하세요',
          action: 'tap',
          target: 'store-select',
          feedback: '원하는 매장을 선택하세요'
        },
        {
          id: 'step3',
          instruction: '메뉴를 선택하세요',
          action: 'tap',
          target: 'menu-select',
          feedback: '메뉴를 선택하고 장바구니에 담으세요'
        },
        {
          id: 'step4',
          instruction: '주문을 확인하세요',
          action: 'tap',
          target: 'order-confirm',
          feedback: '주문 내용을 확인하세요'
        },
        {
          id: 'step5',
          instruction: '결제를 완료하세요',
          action: 'tap',
          target: 'payment',
          feedback: '결제를 완료하세요'
        },
        {
          id: 'step6',
          instruction: '주문을 추적하세요',
          action: 'tap',
          target: 'order-tracking',
          feedback: '주문 상태를 확인하세요'
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
      case 'cafe':
        return {
          cardBg: 'bg-gradient-to-br from-amber-50 to-orange-100',
          iconBg: 'bg-amber-200',
          textColor: 'text-amber-800',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          buttonText: 'text-white'
        }
      case 'restaurant':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-50 to-green-100',
          iconBg: 'bg-emerald-200',
          textColor: 'text-emerald-800',
          buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
          buttonText: 'text-white'
        }
      case 'photobooth':
        return {
          cardBg: 'bg-gradient-to-br from-pink-50 to-rose-100',
          iconBg: 'bg-pink-200',
          textColor: 'text-pink-800',
          buttonBg: 'bg-pink-500 hover:bg-pink-600',
          buttonText: 'text-white'
        }
      case 'train':
        return {
          cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          iconBg: 'bg-blue-200',
          textColor: 'text-blue-800',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          buttonText: 'text-white'
        }
      case 'civil':
        return {
          cardBg: 'bg-gradient-to-br from-slate-50 to-gray-100',
          iconBg: 'bg-slate-200',
          textColor: 'text-slate-800',
          buttonBg: 'bg-slate-500 hover:bg-slate-600',
          buttonText: 'text-white'
        }
      case 'delivery':
        return {
          cardBg: 'bg-gradient-to-br from-violet-50 to-purple-100',
          iconBg: 'bg-violet-200',
          textColor: 'text-violet-800',
          buttonBg: 'bg-violet-500 hover:bg-violet-600',
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
          background: 'bg-gradient-to-br from-slate-800 to-slate-600',
          cardBackground: 'bg-slate-700',
          buttonColor: 'bg-slate-600 hover:bg-slate-700',
          textColor: 'text-slate-100',
          accentColor: 'border-slate-400',
          iconBg: 'bg-slate-500',
          machineBg: 'bg-gray-800',
          screenBg: 'bg-slate-900',
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
            {/* 깔끔한 키오스크 훈련 화면 */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
              {/* 헤더 */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{gameState.currentTraining.icon}</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {gameState.currentTraining.name}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  단계 {gameState.currentStep + 1} / {gameState.currentTraining.steps.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-mint-500 to-lavender-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((gameState.currentStep + 1) / gameState.currentTraining.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 메인 훈련 화면 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center w-full">
                  {/* 현재 단계 지시사항 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {gameState.currentTraining.steps[gameState.currentStep].instruction}
                    </h4>
                    {gameState.currentTraining.steps[gameState.currentStep].feedback && (
                      <p className="text-gray-600">
                        {gameState.currentTraining.steps[gameState.currentStep].feedback}
                      </p>
                    )}
              </div>
              
                  {/* 선택 옵션들 */}
                  {gameState.currentTraining.steps[gameState.currentStep].options ? (
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {gameState.currentTraining.steps[gameState.currentStep].options!.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleOptionSelect(option)}
                          className={`p-6 rounded-xl border-2 transition-all duration-200 font-medium ${
                            selectedOption === option
                              ? 'bg-gradient-to-r from-mint-500 to-lavender-500 text-white border-transparent shadow-lg'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-mint-400 hover:shadow-md'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
              </div>
                  ) : (
                    /* 터치 액션 */
                    <div className="max-w-md mx-auto">
                      <motion.div 
                        className="w-32 h-32 mx-auto rounded-full border-4 border-dashed border-mint-400 flex items-center justify-center mb-6 bg-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTouchAction('screen')}
                      >
                        <span className="text-4xl">{gameState.currentTraining.steps[gameState.currentStep].target}</span>
                      </motion.div>
                      <p className="text-gray-600 text-lg">
                        화면을 터치하세요
                      </p>
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
                            if (training.id === 'cafe') {
                              window.location.href = '/kiosk-training/cafe'
                            } else if (training.id === 'photobooth') {
                              window.location.href = '/kiosk-training/photobooth'
                            } else if (training.id === 'restaurant') {
                              window.location.href = '/kiosk-training/restaurant'
                            } else if (training.id === 'train') {
                              window.location.href = '/kiosk-training/train'
                            } else if (training.id === 'civil') {
                              window.location.href = '/kiosk-training/civil'
                            } else if (training.id === 'delivery') {
                              window.location.href = '/kiosk-training/delivery'
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