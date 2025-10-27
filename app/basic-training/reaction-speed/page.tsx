'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface GameState {
  currentRound: number
  totalRounds: number
  reactionTimes: number[]
  gameStarted: boolean
  gameCompleted: boolean
  sessionId: string | null
  startTime: number | null
  showMouse: boolean
  mouseAppearTime: number | null
  waitingForClick: boolean
  averageReactionTime: number
}

export default function ReactionSpeedPage() {
  // const router = useRouter() // 사용하지 않음
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 5,
    reactionTimes: [],
    gameStarted: false,
    gameCompleted: false,
    sessionId: null,
    startTime: null,
    showMouse: false,
    mouseAppearTime: null,
    waitingForClick: false,
    averageReactionTime: 0
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const startGame = async () => {
    try {
      // 백엔드에 훈련 세션 시작
      const sessionResponse = await trainingAPI.startSession({
        training_type: 'basic',
        module: 'reaction_speed',
        difficulty: 'beginner'
      })

      setGameState(prev => ({
        ...prev,
        gameStarted: true,
        sessionId: sessionResponse.session_id.toString(),
        startTime: Date.now(),
        currentRound: 1,
        reactionTimes: [],
        gameCompleted: false
      }))
      setShowInstructions(false)

      // 첫 번째 라운드 시작
      startRound()

      toast.success('반응 속도 훈련이 시작되었습니다!')
    } catch (error) {
      console.error('Failed to start training session:', error)
      toast.error('훈련 세션 시작에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const startRound = () => {
    // 2-5초 랜덤 대기 후 쥐 등장
    const waitTime = 2000 + Math.random() * 3000 // 2-5초
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showMouse: true,
        mouseAppearTime: Date.now(),
        waitingForClick: true
      }))
    }, waitTime)
  }

  const handleMouseClick = () => {
    if (!gameState.waitingForClick || !gameState.mouseAppearTime) return

    const reactionTime = Date.now() - gameState.mouseAppearTime
    const newReactionTimes = [...gameState.reactionTimes, reactionTime]

    setGameState(prev => ({
      ...prev,
      reactionTimes: newReactionTimes,
      showMouse: false,
      waitingForClick: false,
      mouseAppearTime: null
    }))

    setFeedbackMessage(`반응 시간: ${reactionTime}ms`)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      
      if (gameState.currentRound < gameState.totalRounds) {
        // 다음 라운드
        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1
        }))
        setTimeout(() => startRound(), 1000)
      } else {
        // 게임 완료
        const averageTime = newReactionTimes.reduce((sum, time) => sum + time, 0) / newReactionTimes.length
        setGameState(prev => ({
          ...prev,
          gameCompleted: true,
          averageReactionTime: Math.round(averageTime)
        }))
        saveGameResults(Math.round(averageTime))
      }
    }, 1500)
  }

  const saveGameResults = async (averageTime: number) => {
    if (!gameState.sessionId) return

    try {
      const timeSpent = gameState.startTime ? Date.now() - gameState.startTime : 0

      await trainingAPI.completeSession(gameState.sessionId, {
        score: Math.max(0, 1000 - averageTime), // 빠를수록 높은 점수
        accuracy: Math.round((1000 - averageTime) / 10), // 반응 속도 기반 정확도
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
      currentRound: 1,
      totalRounds: 5,
      reactionTimes: [],
      gameStarted: false,
      gameCompleted: false,
      sessionId: null,
      startTime: null,
      showMouse: false,
      mouseAppearTime: null,
      waitingForClick: false,
      averageReactionTime: 0
    })
    setShowInstructions(true)
    setShowFeedback(false)
  }

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
                <h1 className="text-xl font-bold text-mint-600">반응 속도 훈련</h1>
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
              <div className="text-2xl font-bold text-mint-600">{gameState.currentRound}</div>
              <div className="text-sm text-gray-600">라운드</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-success-600">{gameState.totalRounds}</div>
              <div className="text-sm text-gray-600">총 라운드</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warning-600">{gameState.reactionTimes.length}</div>
              <div className="text-sm text-gray-600">완료</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {gameState.reactionTimes.length > 0 
                  ? Math.round(gameState.reactionTimes.reduce((sum, time) => sum + time, 0) / gameState.reactionTimes.length)
                  : 0}ms
              </div>
              <div className="text-sm text-gray-600">평균 반응시간</div>
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
              <div className="text-6xl mb-4">🐭</div>
              <h2 className="text-3xl font-bold text-mint-600 mb-4">훈련 완료!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg">평균 반응 시간: <span className="font-bold text-mint-600">{gameState.averageReactionTime}ms</span></p>
                <p className="text-lg">총 라운드: <span className="font-bold text-success-600">{gameState.totalRounds}</span></p>
                <p className="text-lg">완료한 라운드: <span className="font-bold text-secondary-600">{gameState.reactionTimes.length}</span></p>
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
            {/* 게임 영역 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-mint-200 relative overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-700 mb-6">
                {gameState.waitingForClick ? '쥐가 나타나면 빠르게 클릭하세요!' : '쥐가 나타날 때까지 기다리세요...'}
              </h4>
              <div className="relative w-full h-[600px] bg-gray-50 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                {gameState.showMouse ? (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMouseClick}
                    className="text-8xl cursor-pointer"
                  >
                    🐭
                  </motion.button>
                ) : (
                  <div className="text-6xl text-gray-400">
                    ⏳
                  </div>
                )}
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
                <div className="text-4xl mb-4">🎉</div>
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
                  <div className="text-6xl mb-6">🐭</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    반응 속도 훈련
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>화면에 쥐가 나타날 때까지 기다리세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>쥐가 나타나면 <span className="text-red-600 font-bold">빠르게 클릭</span>하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>총 5번 반복하여 평균 반응 속도를 측정합니다</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>빠를수록 높은 점수를 획득합니다!</p>
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
                    🐭 게임 시작
                  </button>
                  <Link href="/basic-training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🐭</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  반응 속도 훈련을 통해 빠른 반응 능력을 향상시켜보세요!
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
