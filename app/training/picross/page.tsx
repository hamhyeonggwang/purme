'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Lightbulb, CheckCircle, RotateCcw } from 'lucide-react'

interface PicrossCell {
  isFilled: boolean
  isMarked: boolean
  isCorrect: boolean
}

interface GameState {
  grid: PicrossCell[][]
  rowHints: number[][]
  colHints: number[][]
  solution: boolean[][]
  size: number
  isComplete: boolean
  startTime: number
  endTime: number | null
  hintsUsed: number
}

const GRID_SIZES = [5, 8, 10]
const MAX_HINTS = 3

export default function PicrossGame() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    rowHints: [],
    colHints: [],
    solution: [],
    size: 5,
    isComplete: false,
    startTime: Date.now(),
    endTime: null,
    hintsUsed: 0
  })
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentTool, setCurrentTool] = useState<'fill' | 'mark'>('fill')

  // 노노그램 힌트 생성
  const generateHints = (solution: boolean[][]): {rowHints: number[][], colHints: number[][]} => {
    const size = solution.length
    const rowHints: number[][] = []
    const colHints: number[][] = []

    // 행 힌트 생성
    for (let i = 0; i < size; i++) {
      const hints: number[] = []
      let count = 0
      for (let j = 0; j < size; j++) {
        if (solution[i][j]) {
          count++
        } else if (count > 0) {
          hints.push(count)
          count = 0
        }
      }
      if (count > 0) {
        hints.push(count)
      }
      rowHints.push(hints.length > 0 ? hints : [0])
    }

    // 열 힌트 생성
    for (let j = 0; j < size; j++) {
      const hints: number[] = []
      let count = 0
      for (let i = 0; i < size; i++) {
        if (solution[i][j]) {
          count++
        } else if (count > 0) {
          hints.push(count)
          count = 0
        }
      }
      if (count > 0) {
        hints.push(count)
      }
      colHints.push(hints.length > 0 ? hints : [0])
    }

    return { rowHints, colHints }
  }

  // 간단한 패턴 생성
  const generatePattern = (size: number): boolean[][] => {
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))
    
    // 간단한 패턴들 생성
    const patterns = [
      // 십자가
      () => {
        const center = Math.floor(size / 2)
        for (let i = 0; i < size; i++) {
          pattern[center][i] = true
          pattern[i][center] = true
        }
      },
      // 사각형 테두리
      () => {
        for (let i = 0; i < size; i++) {
          pattern[0][i] = true
          pattern[size - 1][i] = true
          pattern[i][0] = true
          pattern[i][size - 1] = true
        }
      },
      // 대각선
      () => {
        for (let i = 0; i < size; i++) {
          pattern[i][i] = true
          pattern[i][size - 1 - i] = true
        }
      },
      // 체크보드
      () => {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if ((i + j) % 2 === 0) {
              pattern[i][j] = true
            }
          }
        }
      }
    ]

    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
    randomPattern()
    
    return pattern
  }

  // 게임 시작
  const startGame = (size: number) => {
    const solution = generatePattern(size)
    const { rowHints, colHints } = generateHints(solution)
    
    const grid: PicrossCell[][] = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({
        isFilled: false,
        isMarked: false,
        isCorrect: false
      }))
    )

    setGameState({
      grid,
      rowHints,
      colHints,
      solution,
      size,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      hintsUsed: 0
    })
    setShowInstructions(false)
  }

  // 셀 클릭 처리
  const handleCellClick = (row: number, col: number) => {
    if (gameState.isComplete) return

    const newGrid = [...gameState.grid]
    newGrid[row] = [...newGrid[row]]
    
    if (currentTool === 'fill') {
      newGrid[row][col] = {
        ...newGrid[row][col],
        isFilled: !newGrid[row][col].isFilled,
        isMarked: false
      }
    } else {
      newGrid[row][col] = {
        ...newGrid[row][col],
        isMarked: !newGrid[row][col].isMarked,
        isFilled: false
      }
    }

    setGameState(prev => ({ ...prev, grid: newGrid }))
    checkCompletion(newGrid)
  }

  // 완료 체크
  const checkCompletion = (grid: PicrossCell[][]) => {
    const isComplete = grid.every((row, i) =>
      row.every((cell, j) => {
        if (gameState.solution[i][j]) {
          return cell.isFilled
        } else {
          return !cell.isFilled
        }
      })
    )

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

    const newGrid = [...gameState.grid]
    const emptyCells: {row: number, col: number}[] = []

    // 빈 셀들 찾기
    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        if (!newGrid[i][j].isFilled && !newGrid[i][j].isMarked) {
          emptyCells.push({row: i, col: j})
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const {row, col} = randomCell
      
      newGrid[row] = [...newGrid[row]]
      if (gameState.solution[row][col]) {
        newGrid[row][col] = {
          ...newGrid[row][col],
          isFilled: true,
          isCorrect: true
        }
      } else {
        newGrid[row][col] = {
          ...newGrid[row][col],
          isMarked: true,
          isCorrect: true
        }
      }

      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        hintsUsed: prev.hintsUsed + 1
      }))
    }
  }

  // 정답 체크
  const checkSolution = () => {
    const newGrid = [...gameState.grid]
    let hasErrors = false

    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        const cell = newGrid[i][j]
        const shouldBeFilled = gameState.solution[i][j]
        
        if (shouldBeFilled && !cell.isFilled) {
          newGrid[i] = [...newGrid[i]]
          newGrid[i][j] = { ...cell, isCorrect: false }
          hasErrors = true
        } else if (!shouldBeFilled && cell.isFilled) {
          newGrid[i] = [...newGrid[i]]
          newGrid[i][j] = { ...cell, isCorrect: false }
          hasErrors = true
        }
      }
    }

    setGameState(prev => ({ ...prev, grid: newGrid }))
    
    if (!hasErrors) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      grid: [],
      rowHints: [],
      colHints: [],
      solution: [],
      size: 5,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      hintsUsed: 0
    })
    setSelectedCell(null)
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
            <div className="text-6xl mb-4">🎨</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">노노그램</h1>
            <p className="text-lg text-gray-600">
              힌트 숫자를 보고 그림을 완성하는 퍼즐 게임
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-mint-50 p-4 rounded-lg">
              <h3 className="font-bold text-mint-800 mb-2">🎯 게임 목표</h3>
              <p className="text-mint-700">
                행과 열의 힌트 숫자를 보고 올바른 셀을 채워서 숨겨진 그림을 완성하세요.
              </p>
            </div>

            <div className="bg-lavender-50 p-4 rounded-lg">
              <h3 className="font-bold text-lavender-800 mb-2">💡 게임 규칙</h3>
              <ul className="text-lavender-700 space-y-1">
                <li>• 행과 열의 숫자는 연속된 채워진 셀의 개수를 나타냅니다</li>
                <li>• 숫자 3은 연속된 3개의 셀이 채워져야 함을 의미합니다</li>
                <li>• 숫자들 사이에는 최소 1개의 빈 셀이 있어야 합니다</li>
                <li>• 힌트는 최대 3회까지 사용할 수 있습니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🎮 조작 방법</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• 채우기 도구: 셀을 클릭하여 채웁니다</li>
                <li>• 표시 도구: 확실히 비어있는 셀을 표시합니다</li>
                <li>• 힌트 버튼으로 정답을 확인할 수 있습니다</li>
                <li>• 정답 체크 버튼으로 완성 여부를 확인합니다</li>
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
                <h1 className="text-2xl font-bold text-gray-900">노노그램</h1>
                <p className="text-sm text-gray-600">{gameState.size}×{gameState.size} 퍼즐</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">힌트:</span> {gameState.hintsUsed}/{MAX_HINTS}
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
                <div className="text-2xl font-bold text-lavender-600">{gameState.hintsUsed}</div>
                <div className="text-sm text-gray-600">힌트 사용</div>
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

        {/* 도구 선택 */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">도구 선택</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentTool('fill')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentTool === 'fill'
                  ? 'bg-mint-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              채우기
            </button>
            <button
              onClick={() => setCurrentTool('mark')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentTool === 'mark'
                  ? 'bg-lavender-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              표시
            </button>
          </div>
        </div>

        {/* 노노그램 그리드 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-center">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gameState.size + 1}, 1fr)` }}>
              {/* 빈 셀 (왼쪽 위) */}
              <div className="w-8 h-8"></div>
              
              {/* 열 힌트 */}
              {gameState.colHints.map((hints, colIndex) => (
                <div key={colIndex} className="w-8 h-8 flex flex-col justify-center items-center text-xs font-bold text-gray-700">
                  {hints.map((hint, index) => (
                    <div key={index}>{hint}</div>
                  ))}
                </div>
              ))}
              
              {/* 행 힌트와 그리드 */}
              {gameState.grid.map((row, rowIndex) => (
                <>
                  {/* 행 힌트 */}
                  <div key={`hint-${rowIndex}`} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-700">
                    {gameState.rowHints[rowIndex].map((hint, index) => (
                      <span key={index}>{hint} </span>
                    ))}
                  </div>
                  
                  {/* 그리드 셀들 */}
                  {row.map((cell, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        w-8 h-8 border border-gray-300 transition-all duration-200
                        ${cell.isFilled
                          ? 'bg-black'
                          : cell.isMarked
                          ? 'bg-gray-300'
                          : 'bg-white hover:bg-gray-50'
                        }
                        ${cell.isCorrect ? 'ring-2 ring-green-500' : ''}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </>
              ))}
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
                노노그램을 완성했습니다!
              </p>
              <div className="bg-mint-50 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-mint-600">{getGameTime()}</div>
                <div className="text-sm text-gray-600">완성 시간</div>
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
