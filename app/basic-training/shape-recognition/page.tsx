'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface Shape {
  id: string
  name: string
  koreanName: string
  icon: string
  sides: number
}

interface GameState {
  currentLevel: number
  score: number
  timeLeft: number
  targetShape: Shape | null
  shapeOptions: Shape[]
  gameStarted: boolean
  gameCompleted: boolean
  correctAnswers: number
  totalAnswers: number
  sessionId: string | null
  startTime: number | null
}

export default function ShapeRecognitionPage() {
  // const router = useRouter() // 사용하지 않음
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 60,
    targetShape: null,
    shapeOptions: [],
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    sessionId: null,
    startTime: null
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const shapes: Shape[] = [
    { id: 'circle', name: 'Circle', koreanName: '원', icon: '⭕', sides: 0 },
    { id: 'triangle', name: 'Triangle', koreanName: '삼각형', icon: '🔺', sides: 3 },
    { id: 'square', name: 'Square', koreanName: '사각형', icon: '⬜', sides: 4 },
    { id: 'pentagon', name: 'Pentagon', koreanName: '오각형', icon: '⬟', sides: 5 },
    { id: 'hexagon', name: 'Hexagon', koreanName: '육각형', icon: '⬡', sides: 6 },
    { id: 'star', name: 'Star', koreanName: '별', icon: '⭐', sides: 5 },
    { id: 'heart', name: 'Heart', koreanName: '하트', icon: '❤️', sides: 0 },
    { id: 'diamond', name: 'Diamond', koreanName: '다이아몬드', icon: '💎', sides: 4 }
  ]

  const generateShapeOptions = (level: number): Shape[] => {
    const optionCount = Math.min(3 + level, 6)
    const shuffled = [...shapes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, optionCount)
  }

  const selectTargetShape = (options: Shape[]): Shape => {
    return options[Math.floor(Math.random() * options.length)]
  }

  const startGame = async () => {
    try {
      // 백엔드에 훈련 세션 시작
      const sessionResponse = await trainingAPI.startSession({
        training_type: 'basic',
        module: 'shape_recognition',
        difficulty: 'beginner'
      })

      const shapeOptions = generateShapeOptions(gameState.currentLevel)
      const targetShape = selectTargetShape(shapeOptions)

      setGameState(prev => ({
        ...prev,
        shapeOptions,
        targetShape,
        gameStarted: true,
        timeLeft: 60,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: sessionResponse.session_id.toString(),
        startTime: Date.now()
      }))
      setShowInstructions(false)

      toast.success('모양 찾기 훈련이 시작되었습니다!')
    } catch (error) {
      console.error('Failed to start training session:', error)
      toast.error('훈련 세션 시작에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleShapeClick = (shape: Shape) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return

    setSelectedShape(shape)
    const isCorrect = shape.id === gameState.targetShape?.id

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
    const newShapeOptions = generateShapeOptions(gameState.currentLevel + 1)
    const targetShape = selectTargetShape(newShapeOptions)

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      shapeOptions: newShapeOptions,
      targetShape
    }))
  }

  const saveGameResults = async () => {
    if (!gameState.sessionId) return

    try {
      const timeSpent = gameState.startTime ? Date.now() - gameState.startTime : 0
      const accuracy = gameState.totalAnswers > 0 ? (gameState.correctAnswers / gameState.totalAnswers) * 100 : 0

      await trainingAPI.completeSession(gameState.sessionId, {
        score: gameState.score,
        accuracy: Math.round(accuracy),
        time_spent: Math.round(timeSpent / 1000) // 초 단위로 변환
      })

      toast.success('훈련 결과가 저장되었습니다!')
    } catch (error) {
      console.error('Failed to save game results:', error)
      toast.error('결과 저장에 실패했습니다.')
    }
  }

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      timeLeft: 60,
      targetShape: null,
      shapeOptions: [],
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionId: null,
      startTime: null
    })
    setShowInstructions(true)
    setSelectedShape(null)
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
                <h1 className="text-xl font-bold text-mint-600">모양 찾기</h1>
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
              <div className="text-6xl mb-4">🔺</div>
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
            {/* 목표 모양 */}
            <div className="card mb-8">
              <h3 className="text-xl font-bold text-mint-600 mb-4">
                이 모양을 찾아주세요!
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-6xl">
                  {gameState.targetShape?.icon}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {gameState.targetShape?.koreanName}
                </div>
              </div>
            </div>

            {/* 모양 선택 영역 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">같은 모양을 선택하세요</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
                {gameState.shapeOptions.map((shape, index) => (
                  <motion.button
                    key={shape.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-xl border-4 shadow-lg transition-all duration-200 flex items-center justify-center text-4xl ${
                      selectedShape?.id === shape.id 
                        ? 'border-blue-500 ring-4 ring-blue-200 bg-blue-50' 
                        : 'border-gray-300 hover:border-mint-400 bg-white'
                    }`}
                    onClick={() => handleShapeClick(shape)}
                  >
                    {shape.icon}
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
            {!user ? (
              <div className="max-w-md mx-auto">
                <div className="card mb-8">
                  <div className="text-6xl mb-6">🔐</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    로그인이 필요합니다
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    훈련 결과를 저장하고 진행률을 추적하려면 로그인해주세요.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="/" className="btn-primary flex-1">
                      로그인하기
                    </Link>
                    <Link href="/basic-training" className="btn-secondary flex-1">
                      뒤로 가기
                    </Link>
                  </div>
                </div>
              </div>
            ) : showInstructions ? (
              <div className="max-w-2xl mx-auto">
                <div className="card mb-8">
                  <div className="text-6xl mb-6">🔺</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    모양 찾기 게임
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>화면에 나타나는 목표 모양을 기억하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>여러 모양 중에서 같은 모양을 찾아 클릭하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>정답을 맞히면 다음 레벨로, 틀리면 다시 시도하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>시간 내에 최대한 많은 점수를 획득하세요!</p>
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
                    🔺 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🔺</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  모양 찾기 훈련을 통해 도형 인식 능력을 향상시켜보세요!
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
