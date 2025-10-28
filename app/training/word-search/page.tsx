'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Lightbulb, CheckCircle, RotateCcw } from 'lucide-react'

interface WordPosition {
  word: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  found: boolean
}

interface GameState {
  grid: string[][]
  words: WordPosition[]
  foundWords: string[]
  selectedCells: {row: number, col: number}[]
  isComplete: boolean
  startTime: number
  endTime: number | null
  hintsUsed: number
}

const WORD_LISTS = {
  easy: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BIRD', 'FISH'],
  medium: ['APPLE', 'HOUSE', 'OCEAN', 'MOUNTAIN', 'FLOWER', 'BUTTERFLY', 'ELEPHANT', 'RAINBOW'],
  hard: ['ADVENTURE', 'BEAUTIFUL', 'CHALLENGE', 'DISCOVERY', 'EVERLASTING', 'FANTASTIC', 'GORGEOUS', 'HAPPINESS']
}

const GRID_SIZES = [8, 10, 12]
const MAX_HINTS = 3

export default function WordSearchGame() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    words: [],
    foundWords: [],
    selectedCells: [],
    isComplete: false,
    startTime: Date.now(),
    endTime: null,
    hintsUsed: 0
  })
  const [showInstructions, setShowInstructions] = useState(true)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [gridSize, setGridSize] = useState(8)

  // 그리드 생성
  const generateGrid = (size: number, words: string[]): {grid: string[][], wordPositions: WordPosition[]} => {
    const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''))
    const wordPositions: WordPosition[] = []
    
    // 랜덤 문자로 그리드 채우기
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
      }
    }

    // 단어 배치
    words.forEach(word => {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],  // 대각선, 위, 대각선
        [0, -1], [0, 1],               // 왼쪽, 오른쪽
        [1, -1], [1, 0], [1, 1]       // 대각선, 아래, 대각선
      ]

      let placed = false
      let attempts = 0
      
      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * size)
        const col = Math.floor(Math.random() * size)
        const direction = directions[Math.floor(Math.random() * directions.length)]
        
        const endRow = row + direction[0] * (word.length - 1)
        const endCol = col + direction[1] * (word.length - 1)
        
        // 경계 확인
        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          // 충돌 확인
          let canPlace = true
          for (let i = 0; i < word.length; i++) {
            const checkRow = row + direction[0] * i
            const checkCol = col + direction[1] * i
            if (grid[checkRow][checkCol] !== '' && grid[checkRow][checkCol] !== word[i]) {
              canPlace = false
              break
            }
          }
          
          if (canPlace) {
            // 단어 배치
            for (let i = 0; i < word.length; i++) {
              const placeRow = row + direction[0] * i
              const placeCol = col + direction[1] * i
              grid[placeRow][placeCol] = word[i]
            }
            
            wordPositions.push({
              word,
              startRow: row,
              startCol: col,
              endRow,
              endCol,
              found: false
            })
            
            placed = true
          }
        }
        
        attempts++
      }
    })

    return { grid, wordPositions }
  }

  // 게임 시작
  const startGame = (size: number, diff: 'easy' | 'medium' | 'hard') => {
    const words = WORD_LISTS[diff].slice(0, Math.min(6, WORD_LISTS[diff].length))
    const { grid, wordPositions } = generateGrid(size, words)
    
    setGameState({
      grid,
      words: wordPositions,
      foundWords: [],
      selectedCells: [],
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      hintsUsed: 0
    })
    setGridSize(size)
    setDifficulty(diff)
    setShowInstructions(false)
  }

  // 셀 클릭 처리
  const handleCellClick = (row: number, col: number) => {
    if (gameState.isComplete) return

    const newSelectedCells = [...gameState.selectedCells]
    const cellIndex = newSelectedCells.findIndex(cell => cell.row === row && cell.col === col)
    
    if (cellIndex === -1) {
      newSelectedCells.push({ row, col })
    } else {
      newSelectedCells.splice(cellIndex, 1)
    }

    setGameState(prev => ({
      ...prev,
      selectedCells: newSelectedCells
    }))

    // 단어 확인
    if (newSelectedCells.length >= 3) {
      checkWord(newSelectedCells)
    }
  }

  // 단어 확인
  const checkWord = (selectedCells: {row: number, col: number}[]) => {
    if (selectedCells.length < 3) return

    // 선택된 셀들로부터 문자열 생성
    const sortedCells = [...selectedCells].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row
      return a.col - b.col
    })

    const word = sortedCells.map(cell => gameState.grid[cell.row][cell.col]).join('')
    const reverseWord = word.split('').reverse().join('')

    // 단어 목록에서 찾기
    const foundWord = gameState.words.find(w => 
      !w.found && (w.word === word || w.word === reverseWord)
    )

    if (foundWord) {
      const newWords = gameState.words.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      )
      const newFoundWords = [...gameState.foundWords, foundWord.word]

      setGameState(prev => ({
        ...prev,
        words: newWords,
        foundWords: newFoundWords,
        selectedCells: []
      }))

      checkCompletion(newWords)
    } else {
      // 잘못된 선택 - 선택 해제
      setGameState(prev => ({
        ...prev,
        selectedCells: []
      }))
    }
  }

  // 완료 체크
  const checkCompletion = (words: WordPosition[]) => {
    const isComplete = words.every(w => w.found)
    
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

    const unfoundWords = gameState.words.filter(w => !w.found)
    if (unfoundWords.length > 0) {
      const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)]
      
      // 힌트로 첫 글자 하이라이트
      const hintCells = []
      const direction = [
        randomWord.endRow - randomWord.startRow,
        randomWord.endCol - randomWord.startCol
      ]
      
      for (let i = 0; i < Math.min(3, randomWord.word.length); i++) {
        const row = randomWord.startRow + direction[0] * i
        const col = randomWord.startCol + direction[1] * i
        hintCells.push({ row, col })
      }

      setGameState(prev => ({
        ...prev,
        selectedCells: hintCells,
        hintsUsed: prev.hintsUsed + 1
      }))
    }
  }

  // 정답 체크
  const checkSolution = () => {
    const isComplete = gameState.words.every(w => w.found)
    
    if (isComplete) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    } else {
      alert('아직 모든 단어를 찾지 못했습니다!')
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      grid: [],
      words: [],
      foundWords: [],
      selectedCells: [],
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
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
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">워드 서치</h1>
            <p className="text-lg text-gray-600">
              격자에서 단어를 찾는 시지각 퍼즐 게임
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-mint-50 p-4 rounded-lg">
              <h3 className="font-bold text-mint-800 mb-2">🎯 게임 목표</h3>
              <p className="text-mint-700">
                주어진 단어들을 격자에서 찾아서 선택하세요. 단어는 가로, 세로, 대각선 방향으로 배치되어 있습니다.
              </p>
            </div>

            <div className="bg-lavender-50 p-4 rounded-lg">
              <h3 className="font-bold text-lavender-800 mb-2">💡 게임 규칙</h3>
              <ul className="text-lavender-700 space-y-1">
                <li>• 단어는 가로, 세로, 대각선 방향으로 배치됩니다</li>
                <li>• 단어는 앞뒤로 읽을 수 있습니다</li>
                <li>• 연속된 셀들을 클릭하여 단어를 선택합니다</li>
                <li>• 힌트는 최대 3회까지 사용할 수 있습니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🎮 조작 방법</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• 셀을 클릭하여 단어의 시작점을 선택합니다</li>
                <li>• 연속된 셀들을 클릭하여 단어를 완성합니다</li>
                <li>• 힌트 버튼으로 단어의 일부를 하이라이트할 수 있습니다</li>
                <li>• 정답 체크 버튼으로 완성 여부를 확인합니다</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">난이도 및 크기 선택</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {GRID_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => startGame(size, difficulty)}
                  className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {size}×{size}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => startGame(gridSize, diff)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    difficulty === diff
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {diff === 'easy' ? '쉬움' : diff === 'medium' ? '보통' : '어려움'}
                </button>
              ))}
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
                <h1 className="text-2xl font-bold text-gray-900">워드 서치</h1>
                <p className="text-sm text-gray-600">{gridSize}×{gridSize} 격자</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">찾은 단어:</span> {gameState.foundWords.length}/{gameState.words.length}
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

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 게임 상태 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">게임 상태</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint-600">{gameState.foundWords.length}</div>
                  <div className="text-sm text-gray-600">찾은 단어</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lavender-600">{gameState.words.length}</div>
                  <div className="text-sm text-gray-600">전체 단어</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{getGameTime()}</div>
                  <div className="text-sm text-gray-600">경과 시간</div>
                </div>
              </div>
            </div>

            {/* 단어 목록 */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">찾을 단어</h3>
              <div className="space-y-2">
                {gameState.words.map((word, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg text-sm font-medium ${
                      word.found
                        ? 'bg-green-100 text-green-800 line-through'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {word.word}
                  </div>
                ))}
              </div>
            </div>

            {/* 컨트롤 */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex space-x-2">
                <button
                  onClick={useHint}
                  disabled={gameState.hintsUsed >= MAX_HINTS || gameState.isComplete}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 flex-1"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>힌트</span>
                </button>
                <button
                  onClick={checkSolution}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 flex-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>체크</span>
                </button>
              </div>
            </div>
          </div>

          {/* 워드 서치 그리드 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-center">
                <div 
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                >
                  {gameState.grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => {
                      const isSelected = gameState.selectedCells.some(
                        cell => cell.row === rowIndex && cell.col === colIndex
                      )
                      const isFound = gameState.words.some(word => 
                        word.found && 
                        rowIndex >= Math.min(word.startRow, word.endRow) &&
                        rowIndex <= Math.max(word.startRow, word.endRow) &&
                        colIndex >= Math.min(word.startCol, word.endCol) &&
                        colIndex <= Math.max(word.startCol, word.endCol)
                      )

                      return (
                        <motion.button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={`
                            w-8 h-8 border border-gray-300 transition-all duration-200 text-sm font-bold
                            ${isFound
                              ? 'bg-green-200 text-green-800'
                              : isSelected
                              ? 'bg-mint-200 text-mint-800'
                              : 'bg-white text-gray-800 hover:bg-gray-50'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {letter}
                        </motion.button>
                      )
                    })
                  )}
                </div>
              </div>
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
                모든 단어를 찾았습니다!
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
