'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface GridCell {
  id: string
  row: number
  col: number
  isTarget: boolean
  isClicked: boolean
  showTarget: boolean
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
  grid: GridCell[]
  gridSize: number
  targetPositions: number[]
  showTargets: boolean
  reactionTimes: number[]
  currentTargetIndex: number
}

export default function SpatialRelationshipPage() {
  // const router = useRouter() // 사용하지 않음
  const { user } = useAuth()
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
    grid: [],
    gridSize: 3,
    targetPositions: [],
    showTargets: false,
    reactionTimes: [],
    currentTargetIndex: 0
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [targetStartTime, setTargetStartTime] = useState<number | null>(null)

  const generateGrid = (size: number): GridCell[] => {
    const grid: GridCell[] = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        grid.push({
          id: `${row}-${col}`,
          row,
          col,
          isTarget: false,
          isClicked: false,
          showTarget: false
        })
      }
    }
    return grid
  }

  const generateTargets = (gridSize: number, level: number): number[] => {
    const targetCount = Math.min(3 + level - 1, 8) // 레벨마다 타겟 수 증가
    const totalCells = gridSize * gridSize
    const targets: number[] = []
    
    while (targets.length < targetCount) {
      const randomPos = Math.floor(Math.random() * totalCells)
      if (!targets.includes(randomPos)) {
        targets.push(randomPos)
      }
    }
    
    return targets
  }

  const startGame = async () => {
    try {
      // 백엔드에 훈련 세션 시작
      const sessionResponse = await trainingAPI.startSession({
        training_type: 'basic',
        module: 'spatial_relationship',
        difficulty: 'beginner'
      })

      const gridSize = Math.min(3 + gameState.currentLevel - 1, 10) // 레벨마다 그리드 크기 증가
      const grid = generateGrid(gridSize)
      const targetPositions = generateTargets(gridSize, gameState.currentLevel)

      setGameState(prev => ({
        ...prev,
        grid,
        gridSize,
        targetPositions,
        gameStarted: true,
        timeLeft: 60,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: sessionResponse.session_id.toString(),
        startTime: Date.now(),
        showTargets: false,
        reactionTimes: [],
        currentTargetIndex: 0
      }))
      setShowInstructions(false)

      // 첫 번째 타겟 표시
      showNextTarget()

      toast.success('공간관계 인식 훈련이 시작되었습니다!')
    } catch (error) {
      console.error('Failed to start training session:', error)
      toast.error('훈련 세션 시작에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const showNextTarget = () => {
    setGameState(prev => {
      // 현재 타겟 인덱스가 타겟 배열 길이보다 크거나 같으면 모든 타겟 완료
      if (prev.currentTargetIndex >= prev.targetPositions.length) {
        // 모든 타겟 완료, 다음 레벨
        setTimeout(() => nextLevel(), 1000)
        return prev
      }

      const targetPos = prev.targetPositions[prev.currentTargetIndex]
      const newGrid = prev.grid.map((cell, index) => ({
        ...cell,
        isTarget: index === targetPos,
        showTarget: index === targetPos
      }))

      return {
        ...prev,
        grid: newGrid,
        showTargets: true
      }
    })

    setTargetStartTime(Date.now())

    // 2초 후 타겟 숨기기
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showTargets: false,
        grid: prev.grid.map(cell => ({ ...cell, showTarget: false }))
      }))
    }, 2000)
  }

  const handleCellClick = (cellId: string) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return

    const cellIndex = gameState.grid.findIndex(cell => cell.id === cellId)
    const isCorrect = gameState.grid[cellIndex].isTarget

    if (isCorrect && targetStartTime) {
      const reactionTime = Date.now() - targetStartTime
      const newReactionTimes = [...gameState.reactionTimes, reactionTime]

      setGameState(prev => ({
        ...prev,
        totalAnswers: prev.totalAnswers + 1,
        correctAnswers: prev.correctAnswers + 1,
        score: prev.score + Math.max(0, 1000 - reactionTime), // 빠를수록 높은 점수
        reactionTimes: newReactionTimes,
        currentTargetIndex: prev.currentTargetIndex + 1,
        grid: prev.grid.map(cell => 
          cell.id === cellId ? { ...cell, isClicked: true } : cell
        )
      }))

      setFeedbackMessage(`정답! 반응시간: ${reactionTime}ms`)
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        showNextTarget()
      }, 1000)
    } else {
      setGameState(prev => ({
        ...prev,
        totalAnswers: prev.totalAnswers + 1,
        score: Math.max(0, prev.score - 100)
      }))

      setFeedbackMessage('틀렸습니다. 다시 시도해보세요!')
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
      }, 1000)
    }
  }

  const nextLevel = () => {
    const newGridSize = Math.min(3 + gameState.currentLevel, 10) // 레벨마다 그리드 크기 증가
    const newGrid = generateGrid(newGridSize)
    const newTargetPositions = generateTargets(newGridSize, gameState.currentLevel + 1)

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      grid: newGrid,
      gridSize: newGridSize,
      targetPositions: newTargetPositions,
      currentTargetIndex: 0,
      reactionTimes: []
    }))

    setTimeout(() => showNextTarget(), 1000)
  }

  const saveGameResults = async () => {
    if (!gameState.sessionId) return

    try {
      const timeSpent = gameState.startTime ? Date.now() - gameState.startTime : 0
      const accuracy = gameState.totalAnswers > 0 ? (gameState.correctAnswers / gameState.totalAnswers) * 100 : 0
  // const averageReactionTime = gameState.reactionTimes.length > 0 
  //   ? gameState.reactionTimes.reduce((sum, time) => sum + time, 0) / gameState.reactionTimes.length 
  //   : 0 // 사용하지 않음

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
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionId: null,
      startTime: null,
      grid: [],
      gridSize: 3,
      targetPositions: [],
      showTargets: false,
      reactionTimes: [],
      currentTargetIndex: 0
    })
    setShowInstructions(true)
    setShowFeedback(false)
    setTargetStartTime(null)
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
  const averageReactionTime = gameState.reactionTimes.length > 0 
    ? Math.round(gameState.reactionTimes.reduce((sum, time) => sum + time, 0) / gameState.reactionTimes.length)
    : 0

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
                <h1 className="text-xl font-bold text-mint-600">공간관계 인식</h1>
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
              <div className="text-6xl mb-4">🔲</div>
              <h2 className="text-3xl font-bold text-mint-600 mb-4">훈련 완료!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg">최종 점수: <span className="font-bold text-mint-600">{gameState.score}</span></p>
                <p className="text-lg">정확도: <span className="font-bold text-success-600">{accuracy}%</span></p>
                <p className="text-lg">완료한 레벨: <span className="font-bold text-secondary-600">{gameState.currentLevel - 1}</span></p>
                <p className="text-lg">평균 반응시간: <span className="font-bold text-warning-600">{averageReactionTime}ms</span></p>
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
            {/* 게임 설명 */}
            <div className="card mb-8">
              <h3 className="text-xl font-bold text-mint-600 mb-4">
                {gameState.showTargets ? '표시된 위치를 클릭하세요!' : '다음 타겟을 기다리세요...'}
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">🔲</div>
                <div className="text-lg font-semibold text-gray-700">
                  {gameState.showTargets ? '빠르게 클릭하세요!' : '타겟이 나타날 때까지 기다리세요'}
                </div>
              </div>
            </div>

            {/* 그리드 영역 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200 relative overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">
                {gameState.gridSize}x{gameState.gridSize} 그리드 - 타겟 위치를 따라 클릭하세요
              </h4>
              <div 
                className="grid gap-2 mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)`,
                  width: `${Math.min(gameState.gridSize * 60, 600)}px`
                }}
              >
                {gameState.grid.map((cell) => (
                  <motion.button
                    key={cell.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-lg border-4 shadow-lg transition-all duration-200 ${
                      cell.showTarget 
                        ? 'bg-red-500 border-red-600 ring-4 ring-red-200' 
                        : cell.isClicked
                        ? 'bg-green-500 border-green-600'
                        : 'bg-gray-200 border-gray-300 hover:border-mint-400'
                    }`}
                    onClick={() => handleCellClick(cell.id)}
                  >
                    {cell.showTarget && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-2xl"
                      >
                        ⭐
                      </motion.div>
                    )}
                    {cell.isClicked && !cell.showTarget && (
                      <div className="text-white text-2xl">✓</div>
                    )}
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
                  <div className="text-6xl mb-6">🔲</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    공간관계 인식 게임
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>3x3부터 10x10까지 점점 커지는 그리드가 나타납니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>그리드에서 <span className="text-red-600 font-bold">별표(⭐)</span>가 표시된 위치를 기억하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>별표가 사라진 후 <span className="text-blue-600 font-bold">기억한 위치를 클릭</span>하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>빠르고 정확할수록 높은 점수를 획득합니다!</p>
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
                    🔲 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🔲</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  공간관계 인식 게임을 통해 공간 기억 능력을 향상시켜보세요!
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
