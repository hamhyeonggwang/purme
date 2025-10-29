'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface FocusTarget {
  id: string
  x: number
  y: number
  color: string
  size: number
  isTarget: boolean
}

interface GameState {
  currentLevel: number
  score: number
  timeLeft: number
  targets: FocusTarget[]
  gameStarted: boolean
  gameCompleted: boolean
  correctAnswers: number
  totalAnswers: number
  sessionId: string | null
  startTime: number | null
  currentTarget: FocusTarget | null
  showTarget: boolean
}

export default function FocusTrainingPage() {
  // const router = useRouter() // 사용하지 않음
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 60,
    targets: [],
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    sessionId: null,
    startTime: null,
    currentTarget: null,
    showTarget: false
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [selectedTarget, setSelectedTarget] = useState<FocusTarget | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

  const generateTargets = (level: number): FocusTarget[] => {
    const targetCount = Math.min(4 + level, 8)
    const targets: FocusTarget[] = []
    
    // 화면을 격자로 나누어 균등 분포
    const cols = Math.ceil(Math.sqrt(targetCount))
    const rows = Math.ceil(targetCount / cols)
    const cellWidth = 1400 / cols
    const cellHeight = 600 / rows
    
    for (let i = 0; i < targetCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      
      // 각 격자 내에서 랜덤 위치
      const x = col * cellWidth + Math.random() * cellWidth
      const y = row * cellHeight + Math.random() * cellHeight
      
      targets.push({
        id: `target-${i}`,
        x: Math.max(150, Math.min(1250, x)), // 더 넉넉한 경계 (최대 원 크기 240px 고려)
        y: Math.max(150, Math.min(450, y)), // 더 넉넉한 경계 (최대 원 크기 240px 고려)
        color: colors[i % colors.length],
        size: 160 + Math.random() * 80, // 4배 크기 (160~240px)
        isTarget: false
      })
    }
    
    // 하나의 타겟을 랜덤하게 선택
    const targetIndex = Math.floor(Math.random() * targets.length)
    targets[targetIndex].isTarget = true
    
    return targets
  }

  const startGame = () => {
    try {
      // 백엔드에 훈련 세션 시작

      const targets = generateTargets(gameState.currentLevel)
      const currentTarget = targets.find(t => t.isTarget) || null

      setGameState(prev => ({
        ...prev,
        targets,
        currentTarget,
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
      toast.error('훈련 세션 시작에 실패했습니다')
    }
  }

  const handleTargetClick = (target: FocusTarget) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return

    setSelectedTarget(target)
    const isCorrect = target.isTarget

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
    const newTargets = generateTargets(gameState.currentLevel + 1)
    const currentTarget = newTargets.find(t => t.isTarget) || null

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      targets: newTargets,
      currentTarget,
      showTarget: true
    }))

    // 3초 후 타겟 숨기기
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showTarget: false }))
    }, 3000)
  }

  const saveGameResults = async () => {
    if (!gameState.sessionId) return

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
      // 게임 결과 저장 실패 (무시)
    }
  }

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      timeLeft: 60,
      targets: [],
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionId: null,
      startTime: null,
      currentTarget: null,
      showTarget: false
    })
    setShowInstructions(true)
    setSelectedTarget(null)
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
                <h1 className="text-xl font-bold text-mint-600">집중 훈련</h1>
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
              <div className="text-6xl mb-4">🎯</div>
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
                {gameState.showTarget ? '🧠 목표 원을 기억하세요!' : '🎯 기억한 원을 찾아주세요!'}
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">{gameState.showTarget ? '👀' : '🧠'}</div>
                <div className="text-lg font-semibold text-gray-700">
                  {gameState.showTarget ? '노란색 테두리가 있는 원을 3초간 기억하세요!' : '방금 전 기억한 원을 클릭하세요!'}
                </div>
              </div>
            </div>

            {/* 타겟 영역 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200 relative overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">
                {gameState.showTarget ? '👀 노란색 테두리 원을 주의깊게 보세요!' : '🧠 기억한 원을 클릭하세요!'}
              </h4>
              <div className="relative w-full h-[600px] bg-gray-50 rounded-lg border-2 border-gray-300">
                {gameState.targets.map((target, index) => (
                  <motion.button
                    key={target.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute rounded-full border-4 shadow-lg transition-all duration-200 cursor-pointer ${
                      selectedTarget?.id === target.id 
                        ? 'border-blue-500 ring-4 ring-blue-200' 
                        : 'border-gray-300 hover:border-mint-400'
                    } ${target.isTarget && gameState.showTarget ? 'ring-4 ring-yellow-300 border-yellow-500' : ''}`}
                    style={{ 
                      left: target.x, 
                      top: target.y, 
                      width: target.size, 
                      height: target.size, 
                      backgroundColor: target.color 
                    }}
                    onClick={() => handleTargetClick(target)}
                  >
                    <span className="text-white font-bold text-sm">
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
                  <div className="text-6xl mb-6">🎯</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    집중 훈련 게임 (기억력 테스트)
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 font-semibold text-lg">
                      🧠 이 게임은 무엇인가요?
                    </p>
                    <p className="text-yellow-700 mt-2">
                      여러 물체 중에서 목표 물체를 기억하고 찾는 <strong>단기 기억력</strong> 훈련입니다.
                    </p>
                  </div>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>화면에 여러 색깔의 원이 나타납니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p><span className="text-yellow-600 font-bold">목표 원이 노란색 테두리</span>로 3초간 강조됩니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>강조가 사라진 후 <span className="text-red-600 font-bold">기억한 원을 클릭</span>하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>정답 시 다음 레벨로, 오답 시 점수가 감점됩니다!</p>
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
                    🎯 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  집중 훈련을 통해 주의 집중 능력을 향상시켜보세요!
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
