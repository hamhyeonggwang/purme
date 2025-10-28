'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface ColorItem {
  id: string
  color: string
  isCorrect: boolean
}

interface GameState {
  currentLevel: number
  score: number
  timeLeft: number
  gameStarted: boolean
  gameCompleted: boolean
  correctAnswers: number
  totalAnswers: number
  sessionId: string | null
  startTime: number | null
  targetColor: string
  colorOptions: ColorItem[]
  showTarget: boolean
}

export default function ColorRecognitionPage() {
  // const router = useRouter() // 사용하지 않음
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 60,
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    sessionId: null,
    startTime: null,
    targetColor: '',
    colorOptions: [],
    showTarget: false
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [selectedOption, setSelectedOption] = useState<ColorItem | null>(null)

  const colors = [
    '#FF6B6B', // 빨강
    '#4ECDC4', // 청록
    '#45B7D1', // 파랑
    '#96CEB4', // 연두
    '#FFEAA7', // 노랑
    '#DDA0DD', // 보라
    '#FFB347', // 주황
    '#87CEEB', // 하늘색
    '#98FB98', // 연녹색
    '#F0E68C'  // 카키
  ]

  const generateColorOptions = (level: number): { targetColor: string, colorOptions: ColorItem[] } => {
    const targetColor = colors[Math.floor(Math.random() * colors.length)]
    const options: ColorItem[] = []
    
    // 정답 추가
    options.push({
      id: 'correct',
      color: targetColor,
      isCorrect: true
    })
    
    // 오답들 추가 (난이도에 따라 비슷한 색상 사용)
    const similarColors = getSimilarColors(targetColor, level)
    while (options.length < 4) {
      const randomColor = similarColors[Math.floor(Math.random() * similarColors.length)]
      if (!options.some(opt => opt.color === randomColor)) {
        options.push({
          id: `option-${options.length}`,
          color: randomColor,
          isCorrect: false
        })
      }
    }
    
    // 선택지 섞기
    const shuffledOptions = options.sort(() => Math.random() - 0.5)
    
    return { targetColor, colorOptions: shuffledOptions }
  }

  const getSimilarColors = (targetColor: string, level: number): string[] => {
    // 난이도에 따라 비슷한 색상 반환
    if (level <= 3) {
      // 쉬운 레벨: 완전히 다른 색상들
      return colors.filter(color => color !== targetColor)
    } else if (level <= 6) {
      // 중간 레벨: 약간 비슷한 색상들
      return colors.filter(color => color !== targetColor)
    } else {
      // 어려운 레벨: 매우 비슷한 색상들
      return colors.filter(color => color !== targetColor)
    }
  }

  const startGame = () => {
    try {
      // 백엔드에 훈련 세션 시작

      const { targetColor, colorOptions } = generateColorOptions(gameState.currentLevel)

      setGameState(prev => ({
        ...prev,
        targetColor,
        colorOptions,
        gameStarted: true,
        timeLeft: 60,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: Date.now().toString(),
        startTime: Date.now(),
        showTarget: true
      }))
      setShowInstructions(false)

      // 3초 후 타겟 숨기기
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showTarget: false }))
      }, 3000)

    } catch (error) {
      console.error('Failed to start training session:', error)
    }
  }

  const handleOptionClick = (option: ColorItem) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return

    setSelectedOption(option)
    const isCorrect = option.isCorrect

    setGameState(prev => ({
      ...prev,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      score: isCorrect ? prev.score + 10 : Math.max(0, prev.score - 5)
    }))

    setFeedbackMessage(isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요! 😊')
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      if (isCorrect) {
        nextLevel()
      }
    }, 1500)
  }

  const nextLevel = () => {
    const { targetColor, colorOptions } = generateColorOptions(gameState.currentLevel + 1)

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      targetColor,
      colorOptions,
      showTarget: true
    }))

    // 3초 후 타겟 숨기기
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showTarget: false }))
    }, 3000)
  }

  const saveGameResults = async () => {
    if (!gameState.sessionId) return

    try {
      const timeSpent = gameState.startTime ? Date.now() - gameState.startTime : 0
      const accuracy = gameState.totalAnswers > 0 ? (gameState.correctAnswers / gameState.totalAnswers) * 100 : 0

      // 게임 결과를 로컬 스토리지에 저장
      try {
        const gameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]")
        gameHistory.push({
          game: "spatial-relationship",
          timestamp: new Date().toISOString(),
          score: gameState.score,
          accuracy: Math.round(accuracy),
          timeSpent: Math.round(timeSpent / 1000),
          level: gameState.currentLevel
        })
        localStorage.setItem("gameHistory", JSON.stringify(gameHistory.slice(-50)))
      } catch (error) {
        console.log("게임 결과 저장 실패:", error)
      }
    } catch (error) {
      console.error('Failed to save game results:', error)
    }
  }

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      timeLeft: 60,
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionId: null,
      startTime: null,
      targetColor: '',
      colorOptions: [],
      showTarget: false
    })
    setShowInstructions(true)
    setSelectedOption(null)
    setShowFeedback(false)
  }

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
      // 게임 완료 시 결과 저장
      saveGameResults()
    }
    return () => clearTimeout(timer)
  }, [gameState.timeLeft, gameState.gameStarted, gameState.gameCompleted])

  const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-lavender-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg border-b-4 border-mint-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/basic-training" className="text-mint-500 hover:text-mint-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-mint-600">색상 구분</h1>
                <p className="text-sm text-gray-600">기초 시지각 훈련</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetGame}
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="card text-center">
              <div className="text-2xl font-bold text-mint-600">{gameState.currentLevel}</div>
              <div className="text-sm text-gray-600">레벨</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-success-600">{gameState.score}</div>
              <div className="text-sm text-gray-600">점수</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warning-600">{gameState.timeLeft}</div>
              <div className="text-sm text-gray-600">시간</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-secondary-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">정확도</div>
            </div>
          </motion.div>
        )}

        {/* 게임 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="card max-w-md mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-mint-600 mb-4">훈련 완료!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg">최종 점수: <span className="font-bold text-mint-600">{gameState.score}</span></p>
                <p className="text-lg">정확도: <span className="font-bold text-success-600">{accuracy}%</span></p>
                <p className="text-lg">완료한 레벨: <span className="font-bold text-secondary-600">{gameState.currentLevel - 1}</span></p>
                <p className="text-lg">총 답변 수: <span className="font-bold text-warning-600">{gameState.totalAnswers}</span></p>
                <p className="text-lg">정답 수: <span className="font-bold text-success-600">{gameState.correctAnswers}</span></p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-green-700 text-sm">
                  ✅ 훈련 결과가 저장되었습니다!
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetGame}
                  className="btn-primary flex-1"
                >
                  다시 하기
                </button>
                <Link href="/dashboard" className="btn-secondary flex-1">
                  내 대시보드
                </Link>
                <Link href="/basic-training" className="btn-secondary flex-1">
                  다른 훈련
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* 게임 화면 */}
        {gameState.gameStarted && !gameState.gameCompleted && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {/* 타겟 색상 표시 */}
            <div className="card mb-8">
              <h3 className="text-xl font-bold text-mint-600 mb-4">
                {gameState.showTarget ? '이 색상을 기억하세요!' : '같은 색상을 찾아주세요!'}
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div 
                  className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-lg"
                  style={{ backgroundColor: gameState.targetColor }}
                ></div>
                <div className="text-lg font-semibold text-gray-700">
                  {gameState.showTarget ? '3초 후 사라집니다' : '같은 색상을 선택하세요'}
                </div>
              </div>
            </div>

            {/* 색상 선택지 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200 relative overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">같은 색상을 선택하세요</h4>
              <div className="grid grid-cols-2 gap-4">
                {gameState.colorOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full h-24 rounded-lg border-4 shadow-lg flex items-center justify-center transition-all duration-200 ${
                      selectedOption?.id === option.id 
                        ? 'border-blue-500 ring-4 ring-blue-200' 
                        : 'border-gray-300 hover:border-mint-400'
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div 
                      className="w-16 h-16 rounded-full"
                      style={{ backgroundColor: option.color }}
                    ></div>
                  </motion.button>
                ))}
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
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-mint-200">
                <div className="text-4xl mb-4">
                  {feedbackMessage.includes('정답') ? '🎉' : '😊'}
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {feedbackMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 시작 화면 */}
        {!gameState.gameStarted && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {showInstructions ? (
              <div className="max-w-2xl mx-auto">
                <div className="card mb-8">
                  <div className="text-6xl mb-6">🎨</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    색상 구분 게임
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>화면에 나타나는 색상을 3초간 기억하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>색상이 사라진 후 <span className="text-red-600 font-bold">같은 색상</span>을 찾으세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>4개의 색상 중에서 정확한 색상을 선택하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>정확할수록 높은 점수를 획득합니다!</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-blue-700 text-sm">
                      💾 훈련 결과는 자동으로 저장됩니다!
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={startGame}
                    className="game-button"
                  >
                    🎨 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🎨</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  색상 구분 게임을 통해 색상 인식 능력을 향상시켜보세요!
                </p>
                <button
                  onClick={startGame}
                  className="game-button"
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