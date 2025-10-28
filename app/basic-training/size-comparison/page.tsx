'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface SizeObject {
  id: string
  size: number
  label: string
  color: string
}

interface GameState {
  currentLevel: number
  score: number
  timeLeft: number
  targetSize: 'bigger' | 'smaller' | null
  objects: SizeObject[]
  gameStarted: boolean
  gameCompleted: boolean
  correctAnswers: number
  totalAnswers: number
  sessionId: string | null
  startTime: number | null
}

export default function SizeComparisonPage() {
  // const router = useRouter() // 사용하지 않음
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 60,
    targetSize: null,
    objects: [],
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    sessionId: null,
    startTime: null
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [selectedObject, setSelectedObject] = useState<SizeObject | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

  const generateObjects = (level: number): SizeObject[] => {
    const objectCount = Math.min(3 + level, 6)
    const objects: SizeObject[] = []
    
    for (let i = 0; i < objectCount; i++) {
      const size = 40 + Math.random() * 80 // 40px ~ 120px
      objects.push({
        id: `object-${i}`,
        size,
        label: `물체 ${i + 1}`,
        color: colors[i % colors.length]
      })
    }
    
    return objects.sort(() => Math.random() - 0.5) // 랜덤하게 섞기
  }

  const getTargetSize = (_objects: SizeObject[]): 'bigger' | 'smaller' => {
    return Math.random() > 0.5 ? 'bigger' : 'smaller'
  }

  const startGame = () => {
    try {
      // 백엔드에 훈련 세션 시작

      const objects = generateObjects(gameState.currentLevel)
      const targetSize = getTargetSize(objects)

      setGameState(prev => ({
        ...prev,
        objects,
        targetSize,
        gameStarted: true,
        timeLeft: 60,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: Date.now().toString(),
        startTime: Date.now()
      }))
      setShowInstructions(false)

    } catch (error) {
      console.error('Failed to start training session:', error)
    }
  }

  const handleObjectClick = (object: SizeObject) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return

    setSelectedObject(object)
    
    // 가장 큰 물체와 가장 작은 물체 찾기
    const sortedObjects = [...gameState.objects].sort((a, b) => a.size - b.size)
    const smallest = sortedObjects[0]
    const biggest = sortedObjects[sortedObjects.length - 1]
    
    let isCorrect = false
    if (gameState.targetSize === 'bigger') {
      isCorrect = object.id === biggest.id
    } else if (gameState.targetSize === 'smaller') {
      isCorrect = object.id === smallest.id
    }

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
    const newObjects = generateObjects(gameState.currentLevel + 1)
    const targetSize = getTargetSize(newObjects)

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      objects: newObjects,
      targetSize
    }))
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
      targetSize: null,
      objects: [],
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionId: null,
      startTime: null
    })
    setShowInstructions(true)
    setSelectedObject(null)
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
                <h1 className="text-xl font-bold text-mint-600">크기 비교</h1>
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
              <div className="text-6xl mb-4">📏</div>
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
            {/* 목표 설명 */}
            <div className="card mb-8">
              <h3 className="text-xl font-bold text-mint-600 mb-4">
                {gameState.targetSize === 'bigger' ? '가장 큰 물체를 찾아주세요!' : '가장 작은 물체를 찾아주세요!'}
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">
                  {gameState.targetSize === 'bigger' ? '🔍' : '🔍'}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {gameState.targetSize === 'bigger' ? '큰 것' : '작은 것'}
                </div>
              </div>
            </div>

            {/* 물체 선택 영역 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">물체를 선택하세요</h4>
              <div className="flex items-center justify-center space-x-8 min-h-[200px]">
                {gameState.objects.map((object, index) => (
                  <motion.button
                    key={object.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-full border-4 shadow-lg transition-all duration-200 flex items-center justify-center ${
                      selectedObject?.id === object.id 
                        ? 'border-blue-500 ring-4 ring-blue-200' 
                        : 'border-gray-300 hover:border-mint-400'
                    }`}
                    style={{ 
                      width: object.size, 
                      height: object.size, 
                      backgroundColor: object.color 
                    }}
                    onClick={() => handleObjectClick(object)}
                  >
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
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
                  <div className="text-6xl mb-6">📏</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    크기 비교 게임
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>화면에 나타나는 여러 물체를 관찰하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>가장 큰 물체 또는 가장 작은 물체를 찾아 클릭하세요</p>
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
                    📏 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">📏</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  크기 비교 훈련을 통해 크기 구분 능력을 향상시켜보세요!
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
