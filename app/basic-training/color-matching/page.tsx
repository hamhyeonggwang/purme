'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface GameState {
  currentRound: number
  totalRounds: number
  score: number
  correctAnswers: number
  totalAnswers: number
  isPlaying: boolean
  isGameOver: boolean
  currentColor: string
  colorOptions: string[]
  selectedColor: string | null
  showFeedback: boolean
  feedbackMessage: string
  isCorrect: boolean | null
}

const colors = [
  { name: '빨간색', value: '#ef4444', english: 'red' },
  { name: '파란색', value: '#3b82f6', english: 'blue' },
  { name: '초록색', value: '#22c55e', english: 'green' },
  { name: '노란색', value: '#eab308', english: 'yellow' },
  { name: '보라색', value: '#a855f7', english: 'purple' },
  { name: '주황색', value: '#f97316', english: 'orange' },
  { name: '분홍색', value: '#ec4899', english: 'pink' },
  { name: '갈색', value: '#a3a3a3', english: 'brown' }
]

export default function ColorMatchingGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 10,
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    isPlaying: false,
    isGameOver: false,
    currentColor: '',
    colorOptions: [],
    selectedColor: null,
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: null
  })

  // 새 라운드 생성
  const generateNewRound = useCallback(() => {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5)
    const correctColor = shuffledColors[0]
    const options = shuffledColors.slice(0, 4)
    
    setGameState(prev => ({
      ...prev,
      currentColor: correctColor.value,
      colorOptions: options.map(color => color.value),
      selectedColor: null,
      showFeedback: false
    }))
  }, [])

  // 게임 시작
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isGameOver: false,
      currentRound: 1,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0
    }))
    generateNewRound()
  }, [generateNewRound])

  // 색상 선택
  const selectColor = useCallback((selectedValue: string) => {
    if (gameState.showFeedback) return

    const isCorrect = selectedValue === gameState.currentColor
    const correctColorName = colors.find(c => c.value === gameState.currentColor)?.name || ''
    
    setGameState(prev => ({
      ...prev,
      selectedColor: selectedValue,
      showFeedback: true,
      isCorrect,
      feedbackMessage: isCorrect ? '정답입니다! 🎉' : `틀렸습니다. 정답은 ${correctColorName}입니다.`,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      score: prev.score + (isCorrect ? 10 : 0)
    }))

    // 2초 후 다음 라운드 또는 게임 종료
    setTimeout(() => {
      if (gameState.currentRound >= gameState.totalRounds) {
        setGameState(prev => ({
          ...prev,
          isGameOver: true,
          isPlaying: false
        }))
      } else {
        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1
        }))
        generateNewRound()
      }
    }, 2000)
  }, [gameState.currentColor, gameState.currentRound, gameState.totalRounds, gameState.showFeedback, generateNewRound])

  // 게임 재시작
  const restartGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentRound: 1,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      isPlaying: false,
      isGameOver: false,
      showFeedback: false
    }))
  }, [])

  // 게임 결과를 로컬 스토리지에 저장
  useEffect(() => {
    if (gameState.isGameOver) {
      try {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
        gameHistory.push({
          game: 'color-matching',
          timestamp: new Date().toISOString(),
          score: gameState.score,
          accuracy: Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100),
          rounds: gameState.totalRounds
        })
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50))) // 최근 50개만 저장
      } catch (error) {
        // 게임 결과 저장 실패 (무시)
      }
    }
  }, [gameState.isGameOver, gameState.score, gameState.correctAnswers, gameState.totalAnswers, gameState.totalRounds])

  const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <div className="text-sm text-gray-600">
              점수: {gameState.score}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">색깔 맞추기</h1>
          <p className="text-lg text-gray-600">제시된 색깔과 같은 색깔을 찾아보세요!</p>
        </div>

        {!gameState.isPlaying && !gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">게임 설명</h2>
                <p className="text-gray-600">
                  화면에 나타나는 색깔과 같은 색깔을 아래 옵션에서 찾아 클릭하세요!
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                게임 시작하기
              </button>
            </div>
          </motion.div>
        )}

        {gameState.isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* 현재 색깔 표시 */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">아래 색깔을 찾아주세요!</h3>
              <div 
                className="w-32 h-32 mx-auto rounded-2xl shadow-lg border-4 border-white"
                style={{ backgroundColor: gameState.currentColor }}
              ></div>
            </div>

            {/* 색깔 옵션들 */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {gameState.colorOptions.map((color, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectColor(color)}
                    disabled={gameState.showFeedback}
                    className={`w-20 h-20 rounded-xl shadow-lg border-4 transition-all duration-200 ${
                      gameState.selectedColor === color
                        ? gameState.isCorrect
                          ? 'border-green-500 scale-110'
                          : 'border-red-500 scale-110'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: gameState.showFeedback ? 1 : 1.05 }}
                    whileTap={{ scale: gameState.showFeedback ? 1 : 0.95 }}
                  />
                ))}
              </div>
            </div>

            {/* 피드백 */}
            <AnimatePresence>
              {gameState.showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl font-semibold text-lg ${
                    gameState.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {gameState.feedbackMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState.isGameOver && (
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
                    <span className="text-gray-600">최종 점수:</span>
                    <span className="font-bold text-blue-600">{gameState.score}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">정답률:</span>
                    <span className="font-bold text-green-600">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">맞힌 문제:</span>
                    <span className="font-bold text-purple-600">{gameState.correctAnswers}개</span>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center"
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