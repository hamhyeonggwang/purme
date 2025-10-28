'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Lightbulb, CheckCircle, RotateCcw } from 'lucide-react'

interface GameState {
  grid: boolean[][]
  size: number
  isComplete: boolean
  startTime: number
  endTime: number | null
  moves: number
  hintsUsed: number
}

const GRID_SIZES = [3, 4, 5]
const MAX_HINTS = 3

export default function LightsOutGame() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    size: 3,
    isComplete: false,
    startTime: Date.now(),
    endTime: null,
    moves: 0,
    hintsUsed: 0
  })
  const [showInstructions, setShowInstructions] = useState(true)

  // 게임 초기화
  const initializeGame = (size: number) => {
    const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))
    
    // 랜덤하게 일부 셀을 켜기
    const numLights = Math.floor(Math.random() * (size * size * 0.6)) + 1
    for (let i = 0; i < numLights; i++) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      grid[row][col] = true
    }

    return grid
  }

  // 게임 시작
  const startGame = (size: number) => {
    const grid = initializeGame(size)
    
    setGameState({
      grid,
      size,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      moves: 0,
      hintsUsed: 0
    })
    setShowInstructions(false)
  }

  // 셀 토글
  const toggleCell = (row: number, col: number) => {
    if (gameState.isComplete) return

    const newGrid = [...gameState.grid]
    
    // 클릭한 셀과 인접한 셀들 토글
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // 상하좌우
    ]
    
    // 클릭한 셀 토글
    newGrid[row] = [...newGrid[row]]
    newGrid[row][col] = !newGrid[row][col]
    
    // 인접한 셀들 토글
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr
      const newCol = col + dc
      
      if (newRow >= 0 && newRow < gameState.size && 
          newCol >= 0 && newCol < gameState.size) {
        newGrid[newRow] = [...newGrid[newRow]]
        newGrid[newRow][newCol] = !newGrid[newRow][newCol]
      }
    })

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      moves: prev.moves + 1
    }))

    checkCompletion(newGrid)
  }

  // 완료 체크
  const checkCompletion = (grid: boolean[][]) => {
    const isComplete = grid.every(row => row.every(cell => !cell))
    
    if (isComplete) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    }
  }

  // 힌트 사용
  const useHint = () => {
    if (gameState.hintsUsed >= MAX_HINTS || gameState.isComplete) return

    // 가장 많은 불이 켜진 셀 찾기
    let maxLights = 0
    let bestCell = { row: 0, col: 0 }
    
    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        if (gameState.grid[i][j]) {
          const lightsAround = countLightsAround(i, j)
          if (lightsAround > maxLights) {
            maxLights = lightsAround
            bestCell = { row: i, col: j }
          }
        }
      }
    }

    // 힌트 셀 하이라이트 (시각적 효과)
    toggleCell(bestCell.row, bestCell.col)
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }))
  }

  // 주변 불 개수 세기
  const countLightsAround = (row: number, col: number): number => {
    let count = 0
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ]
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr
      const newCol = col + dc
      
      if (newRow >= 0 && newRow < gameState.size && 
          newCol >= 0 && newCol < gameState.size &&
          gameState.grid[newRow][newCol]) {
        count++
      }
    })
    
    return count
  }

  // 정답 체크
  const checkSolution = () => {
    const isComplete = gameState.grid.every(row => row.every(cell => !cell))
    
    if (isComplete) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    } else {
      alert('아직 모든 불을 끄지 못했습니다!')
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      grid: [],
      size: 3,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      moves: 0,
      hintsUsed: 0
    })
    setShowInstructions(true)
  }

  // 게임 시간 계산
  const getGameTime = () => {
    const endTime = gameState.endTime || Date.now()
    const timeDiff = endTime - gameState.startTime
    const minutes = Math.floor(timeDiff / 60000)
    const seconds = Math.floor((timeDiff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💡</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">라이트 아웃</h1>
            <p className="text-lg text-gray-600">
              모든 불을 끄는 전략적 퍼즐 게임
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-mint-50 p-4 rounded-lg">
              <h3 className="font-bold text-mint-800 mb-2">🎯 게임 목표</h3>
              <p className="text-mint-700">
                모든 불을 끄세요! 셀을 클릭하면 해당 셀과 인접한 셀들의 불이 토글됩니다.
              </p>
            </div>

            <div className="bg-lavender-50 p-4 rounded-lg">
              <h3 className="font-bold text-lavender-800 mb-2">💡 게임 규칙</h3>
              <ul className="text-lavender-700 space-y-1">
                <li>• 셀을 클릭하면 해당 셀과 상하좌우 인접한 셀들이 토글됩니다</li>
                <li>• 켜진 불은 꺼지고, 꺼진 불은 켜집니다</li>
                <li>• 모든 불을 끄면 게임이 완료됩니다</li>
                <li>• 힌트는 최대 3회까지 사용할 수 있습니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🎮 조작 방법</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• 셀을 클릭하여 불을 토글합니다</li>
                <li>• 힌트 버튼으로 유용한 셀을 추천받을 수 있습니다</li>
                <li>• 정답 체크 버튼으로 완성 여부를 확인합니다</li>
                <li>• 최소한의 움직임으로 완성하는 것이 목표입니다</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">크기 선택</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {GRID_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => startGame(size)}
                  className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {size}×{size}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">크기가 클수록 더 어려워집니다</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50 p-4">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-mint-200 sticky top-0 z-50 mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/training" className="text-gray-700 hover:text-mint-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">라이트 아웃</h1>
                <p className="text-sm text-gray-600">{gameState.size}×{gameState.size} 퍼즐</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">움직임:</span> {gameState.moves}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">시간:</span> {getGameTime()}
              </div>
              <button
                onClick={resetGame}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>리셋</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl">
        {/* 게임 상태 */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-mint-600">{gameState.size}×{gameState.size}</div>
                <div className="text-sm text-gray-600">퍼즐 크기</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lavender-600">{gameState.moves}</div>
                <div className="text-sm text-gray-600">움직임</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{getGameTime()}</div>
                <div className="text-sm text-gray-600">경과 시간</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={useHint}
                disabled={gameState.hintsUsed >= MAX_HINTS || gameState.isComplete}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>힌트</span>
              </button>
              <button
                onClick={checkSolution}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>정답 체크</span>
              </button>
            </div>
          </div>
        </div>

        {/* 라이트 아웃 그리드 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-center">
            <div 
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gameState.size}, 1fr)` }}
            >
              {gameState.grid.map((row, rowIndex) =>
                row.map((isOn, colIndex) => (
                  <motion.button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    className={`
                      w-16 h-16 rounded-lg border-2 transition-all duration-200
                      ${isOn
                        ? 'bg-yellow-400 border-yellow-500 shadow-lg shadow-yellow-200'
                        : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isOn && (
                      <div className="text-2xl">💡</div>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 완료 메시지 */}
        {gameState.isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">축하합니다!</h2>
              <p className="text-lg text-gray-600 mb-6">
                모든 불을 성공적으로 껐습니다!
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-mint-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-mint-600">{getGameTime()}</div>
                  <div className="text-sm text-gray-600">완성 시간</div>
                </div>
                <div className="bg-lavender-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-lavender-600">{gameState.moves}</div>
                  <div className="text-sm text-gray-600">움직임</div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex-1"
                >
                  다시 하기
                </button>
                <Link
                  href="/training"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex-1 text-center"
                >
                  목록으로
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
