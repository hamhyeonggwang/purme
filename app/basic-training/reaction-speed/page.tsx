'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Mouse } from 'lucide-react'
import Link from 'next/link'

interface GameState {
  currentRound: number
  totalRounds: number
  reactionTimes: number[]
  gameStarted: boolean
  gameCompleted: boolean
  startTime: number | null
  showMouse: boolean
  mouseAppearTime: number | null
  waitingForClick: boolean
  averageReactionTime: number
}

export default function ReactionSpeedPage() {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 5,
    reactionTimes: [],
    gameStarted: false,
    gameCompleted: false,
    startTime: null,
    showMouse: false,
    mouseAppearTime: null,
    waitingForClick: false,
    averageReactionTime: 0
  })

  // 게임 시작
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      gameCompleted: false,
      currentRound: 1,
      reactionTimes: [],
      startTime: Date.now()
    }))
    startRound()
  }, [])

  // 라운드 시작
  const startRound = useCallback(() => {
    if (gameState.currentRound > gameState.totalRounds) {
      completeGame()
      return
    }

    setGameState(prev => ({
      ...prev,
      showMouse: false,
      waitingForClick: false
    }))

    // 1-3초 후 마우스 표시
    const delay = Math.random() * 2000 + 1000
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showMouse: true,
        mouseAppearTime: Date.now(),
        waitingForClick: true
      }))
    }, delay)
  }, [gameState.currentRound, gameState.totalRounds])

  // 마우스 클릭 처리
  const handleMouseClick = useCallback(() => {
    if (!gameState.waitingForClick || !gameState.mouseAppearTime) return

    const reactionTime = Date.now() - gameState.mouseAppearTime
    
    setGameState(prev => ({
      ...prev,
      reactionTimes: [...prev.reactionTimes, reactionTime],
      showMouse: false,
      waitingForClick: false,
      currentRound: prev.currentRound + 1
    }))

    // 다음 라운드로
    setTimeout(() => {
      startRound()
    }, 1000)
  }, [gameState.waitingForClick, gameState.mouseAppearTime, startRound])

  // 게임 완료
  const completeGame = useCallback(() => {
    const average = gameState.reactionTimes.reduce((sum, time) => sum + time, 0) / gameState.reactionTimes.length
    
    setGameState(prev => ({
      ...prev,
      gameCompleted: true,
      gameStarted: false,
      averageReactionTime: Math.round(average)
    }))

    // 게임 결과를 로컬 스토리지에 저장
    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'reaction-speed',
        timestamp: new Date().toISOString(),
        averageReactionTime: Math.round(average),
        reactionTimes: gameState.reactionTimes,
        rounds: gameState.totalRounds
      })
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
    } catch (error) {
      console.log('게임 결과 저장 실패:', error)
    }
  }, [gameState.reactionTimes, gameState.totalRounds])

  // 게임 재시작
  const restartGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentRound: 1,
      reactionTimes: [],
      gameStarted: false,
      gameCompleted: false,
      showMouse: false,
      waitingForClick: false
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/basic-training"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              라운드: {gameState.currentRound} / {gameState.totalRounds}
            </div>
            {gameState.reactionTimes.length > 0 && (
              <div className="text-sm text-gray-600">
                평균 반응시간: {Math.round(gameState.reactionTimes.reduce((sum, time) => sum + time, 0) / gameState.reactionTimes.length)}ms
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">반응 속도 훈련</h1>
          <p className="text-lg text-gray-600">아이콘이 나타나면 빠르게 클릭하세요!</p>
        </div>

        {!gameState.gameStarted && !gameState.gameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-3xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">게임 설명</h2>
                <p className="text-gray-600">
                  화면에 아이콘이 나타나면 빠르게 클릭하세요!<br/>
                  반응 속도를 측정하여 집중력을 향상시킵니다.
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                게임 시작하기
              </button>
            </div>
          </motion.div>
        )}

        {gameState.gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">준비하세요!</h3>
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                  <AnimatePresence>
                    {gameState.showMouse && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-16 h-16 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors flex items-center justify-center"
                        onClick={handleMouseClick}
                      >
                        <Mouse className="w-8 h-8 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!gameState.showMouse && (
                <div className="text-gray-600">
                  아이콘이 나타날 때까지 기다리세요...
                </div>
              )}

              {gameState.showMouse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 font-semibold text-lg"
                >
                  클릭하세요! 🖱️
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {gameState.gameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">게임 완료!</h2>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">평균 반응시간:</span>
                    <span className="font-bold text-green-600">{gameState.averageReactionTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">최고 기록:</span>
                    <span className="font-bold text-blue-600">{Math.min(...gameState.reactionTimes)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 라운드:</span>
                    <span className="font-bold text-purple-600">{gameState.totalRounds}라운드</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={restartGame}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시하기</span>
                </button>
                <Link
                  href="/basic-training"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-center"
                >
                  다른 게임
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}