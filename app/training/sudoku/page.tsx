'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, CheckCircle, RefreshCw } from 'lucide-react'

interface SudokuCell {
  value: number | null
  isOriginal: boolean
  isError: boolean
  isHint: boolean
}

interface GameState {
  grid: SudokuCell[][]
  difficulty: number
  hintsUsed: number
  isComplete: boolean
  startTime: number
  endTime: number | null
}

const SUDOKU_SIZE = 9
const BOX_SIZE = 3
const MAX_HINTS = 5

export default function SudokuGame() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    difficulty: 1,
    hintsUsed: 0,
    isComplete: false,
    startTime: Date.now(),
    endTime: null
  })
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)

  // 스도쿠 그리드 초기화
  const initializeGrid = () => {
    const grid: SudokuCell[][] = []
    for (let i = 0; i < SUDOKU_SIZE; i++) {
      grid[i] = []
      for (let j = 0; j < SUDOKU_SIZE; j++) {
        grid[i][j] = {
          value: null,
          isOriginal: false,
          isError: false,
          isHint: false
        }
      }
    }
    return grid
  }

  // 유효한 스도쿠 그리드 생성
  const generateValidGrid = (): number[][] => {
    const grid: number[][] = Array(SUDOKU_SIZE).fill(null).map(() => Array(SUDOKU_SIZE).fill(0))
    
    // 대각선 박스들을 먼저 채우기 (더 쉬운 해결책 보장)
    for (let box = 0; box < SUDOKU_SIZE; box += BOX_SIZE) {
      fillBox(grid, box, box)
    }
    
    // 나머지 셀들 채우기
    solveSudoku(grid)
    
    return grid
  }

  // 박스 채우기
  const fillBox = (grid: number[][], row: number, col: number) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    shuffleArray(numbers)
    
    let index = 0
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        grid[row + i][col + j] = numbers[index++]
      }
    }
  }

  // 배열 섞기
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 스도쿠 해결 알고리즘
  const solveSudoku = (grid: number[][]): boolean => {
    for (let row = 0; row < SUDOKU_SIZE; row++) {
      for (let col = 0; col < SUDOKU_SIZE; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= SUDOKU_SIZE; num++) {
            if (isValidMove(grid, row, col, num)) {
              grid[row][col] = num
              if (solveSudoku(grid)) {
                return true
              }
              grid[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  // 유효한 수인지 확인
  const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
    // 행 확인
    for (let x = 0; x < SUDOKU_SIZE; x++) {
      if (grid[row][x] === num) return false
    }
    
    // 열 확인
    for (let x = 0; x < SUDOKU_SIZE; x++) {
      if (grid[x][col] === num) return false
    }
    
    // 박스 확인
    const startRow = row - row % BOX_SIZE
    const startCol = col - col % BOX_SIZE
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (grid[i + startRow][j + startCol] === num) return false
      }
    }
    
    return true
  }

  // 난이도별 힌트 개수 설정 (아동청소년 친화적)
  const getHintCount = (difficulty: number): number => {
    switch (difficulty) {
      case 1: return 70 // 매우 쉬움 - 많은 힌트
      case 2: return 60 // 쉬움 - 충분한 힌트
      case 3: return 50 // 보통 - 적당한 힌트
      case 4: return 40 // 조금 어려움
      case 5: return 35 // 어려움
      case 6: return 30 // 매우 어려움
      case 7: return 25 // 극도로 어려움
      case 8: return 20 // 전문가급
      case 9: return 17 // 마스터급
      case 10: return 15 // 최고급
      default: return 50
    }
  }

  // 난이도별 설명
  const getDifficultyDescription = (difficulty: number): string => {
    switch (difficulty) {
      case 1: return "매우 쉬움 - 많은 힌트로 시작해보세요!"
      case 2: return "쉬움 - 충분한 힌트가 있어요"
      case 3: return "보통 - 적당한 힌트로 도전해보세요"
      case 4: return "조금 어려움 - 논리적 사고가 필요해요"
      case 5: return "어려움 - 집중력이 필요해요"
      case 6: return "매우 어려움 - 고급 기술이 필요해요"
      case 7: return "극도로 어려움 - 전문가 수준이에요"
      case 8: return "전문가급 - 마스터만 도전하세요"
      case 9: return "마스터급 - 최고 수준이에요"
      case 10: return "최고급 - 거의 불가능한 수준이에요"
      default: return "적당한 난이도예요"
    }
  }

  // 게임 시작
  const startGame = (difficulty: number) => {
    const solution = generateValidGrid()
    const grid = initializeGrid()
    
    // 난이도에 따른 힌트 개수 설정
    const hintCount = getHintCount(difficulty)
    const cellsToRemove = 81 - hintCount
    
    const positions: {row: number, col: number}[] = []
    for (let i = 0; i < SUDOKU_SIZE; i++) {
      for (let j = 0; j < SUDOKU_SIZE; j++) {
        positions.push({row: i, col: j})
      }
    }
    
    const shuffledPositions = shuffleArray(positions)
    
    // 일부 셀만 보여주기
    for (let i = 0; i < cellsToRemove; i++) {
      const {row, col} = shuffledPositions[i]
      grid[row][col] = {
        value: null,
        isOriginal: false,
        isError: false,
        isHint: false
      }
    }
    
    // 나머지 셀은 원본으로 표시
    for (let i = cellsToRemove; i < shuffledPositions.length; i++) {
      const {row, col} = shuffledPositions[i]
      grid[row][col] = {
        value: solution[row][col],
        isOriginal: true,
        isError: false,
        isHint: false
      }
    }
    
    setGameState({
      grid,
      difficulty,
      hintsUsed: 0,
      isComplete: false,
      startTime: Date.now(),
      endTime: null
    })
    setShowInstructions(false)
  }

  // 셀 클릭
  const handleCellClick = (row: number, col: number) => {
    if (gameState.grid[row][col].isOriginal) return
    setSelectedCell({row, col})
  }

  // 숫자 입력
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return
    
    const {row, col} = selectedCell
    const newGrid = [...gameState.grid]
    newGrid[row] = [...newGrid[row]]
    newGrid[row][col] = {
      ...newGrid[row][col],
      value: num,
      isError: false
    }
    
    setGameState(prev => ({...prev, grid: newGrid}))
    checkForErrors(newGrid)
  }

  // 오류 체크
  const checkForErrors = (grid: SudokuCell[][]) => {
    const newGrid = grid.map(row => row.map(cell => ({...cell, isError: false})))
    
    for (let row = 0; row < SUDOKU_SIZE; row++) {
      for (let col = 0; col < SUDOKU_SIZE; col++) {
        const cell = newGrid[row][col]
        if (cell.value && !isValidMove(grid.map(r => r.map(c => c.value || 0)), row, col, cell.value)) {
          newGrid[row][col].isError = true
        }
      }
    }
    
    setGameState(prev => ({...prev, grid: newGrid}))
  }

  // 힌트 사용
  const useHint = () => {
    if (gameState.hintsUsed >= MAX_HINTS || !selectedCell) return
    
    const {row, col} = selectedCell
    const solution = generateValidGrid() // 실제로는 저장된 솔루션 사용해야 함
    
    const newGrid = [...gameState.grid]
    newGrid[row] = [...newGrid[row]]
    newGrid[row][col] = {
      ...newGrid[row][col],
      value: solution[row][col],
      isHint: true
    }
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      hintsUsed: prev.hintsUsed + 1
    }))
  }

  // 정답 체크
  const checkSolution = () => {
    const isComplete = gameState.grid.every(row => 
      row.every(cell => cell.value !== null && !cell.isError)
    )
    
    if (isComplete) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    } else {
      alert('아직 완성되지 않았습니다!')
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      grid: [],
      difficulty: 1,
      hintsUsed: 0,
      isComplete: false,
      startTime: Date.now(),
      endTime: null
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
            <div className="text-6xl mb-4">🧩</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">스도쿠</h1>
            <p className="text-lg text-gray-600">
              논리적 사고와 집중력을 향상시키는 숫자 퍼즐 게임
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-mint-50 p-4 rounded-lg">
              <h3 className="font-bold text-mint-800 mb-2">🎯 게임 목표</h3>
              <p className="text-mint-700">
                9×9 그리드를 1~9 숫자로 채우되, 각 행, 열, 3×3 박스에 중복 없이 모든 숫자가 들어가도록 하세요.
              </p>
            </div>

            <div className="bg-lavender-50 p-4 rounded-lg">
              <h3 className="font-bold text-lavender-800 mb-2">💡 게임 규칙</h3>
              <ul className="text-lavender-700 space-y-1">
                <li>• 각 행에 1~9 숫자가 한 번씩만 들어가야 합니다</li>
                <li>• 각 열에 1~9 숫자가 한 번씩만 들어가야 합니다</li>
                <li>• 각 3×3 박스에 1~9 숫자가 한 번씩만 들어가야 합니다</li>
                <li>• 힌트는 최대 5회까지 사용할 수 있습니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🎮 조작 방법</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• 빈 셀을 클릭하여 선택합니다</li>
                <li>• 숫자 버튼을 눌러 숫자를 입력합니다</li>
                <li>• 힌트 버튼으로 정답을 확인할 수 있습니다</li>
                <li>• 정답 체크 버튼으로 완성 여부를 확인합니다</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">난이도 선택</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => startGame(level)}
                  className={`p-4 rounded-lg transition-colors text-left ${
                    level <= 3 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white' 
                      : 'bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white'
                  }`}
                >
                  <div className="font-bold text-lg">{level}단계</div>
                  <div className="text-sm opacity-90">{getDifficultyDescription(level)}</div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[6, 7, 8, 9, 10].map(level => (
                <button
                  key={level}
                  onClick={() => startGame(level)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors"
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="text-green-600 font-semibold">🟢 1-3단계: 아동청소년 추천</p>
              <p className="text-blue-600 font-semibold">🔵 4-5단계: 일반인 도전</p>
              <p className="text-red-600 font-semibold">🔴 6-10단계: 전문가용</p>
            </div>
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
                <h1 className="text-2xl font-bold text-gray-900">스도쿠</h1>
                <p className="text-sm text-gray-600">
                  난이도 {gameState.difficulty}단계 - {getDifficultyDescription(gameState.difficulty)}
                </p>
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
                <div className="text-2xl font-bold text-mint-600">{gameState.difficulty}</div>
                <div className="text-sm text-gray-600">난이도</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lavender-600">{getHintCount(gameState.difficulty)}</div>
                <div className="text-sm text-gray-600">힌트 개수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{gameState.hintsUsed}</div>
                <div className="text-sm text-gray-600">힌트 사용</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getGameTime()}</div>
                <div className="text-sm text-gray-600">경과 시간</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={useHint}
                disabled={gameState.hintsUsed >= MAX_HINTS || !selectedCell}
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

        {/* 스도쿠 그리드 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-9 gap-1 max-w-md mx-auto">
            {gameState.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    aspect-square border-2 text-lg font-bold transition-all duration-200
                    ${cell.isOriginal 
                      ? 'bg-gray-100 text-gray-800 border-gray-300' 
                      : cell.isHint
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : cell.isError
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-mint-100 text-mint-800 border-mint-400'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    }
                    ${(rowIndex + 1) % 3 === 0 ? 'border-b-4 border-b-gray-400' : ''}
                    ${(colIndex + 1) % 3 === 0 ? 'border-r-4 border-r-gray-400' : ''}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cell.value || ''}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* 숫자 입력 패드 */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">숫자 입력</h3>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.button
                key={num}
                onClick={() => handleNumberInput(num)}
                disabled={!selectedCell}
                className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                whileHover={{ scale: selectedCell ? 1.05 : 1 }}
                whileTap={{ scale: selectedCell ? 0.95 : 1 }}
              >
                {num}
              </motion.button>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => selectedCell && handleNumberInput(null as unknown as number)}
              disabled={!selectedCell}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              지우기
            </button>
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
                스도쿠를 완성했습니다!
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
