'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Lightbulb, CheckCircle } from 'lucide-react'

interface Disk {
  size: number
  color: string
}

interface Tower {
  disks: Disk[]
}

interface GameState {
  towers: Tower[]
  selectedTower: number | null
  moves: number
  minMoves: number
  isComplete: boolean
  startTime: number
  endTime: number | null
  hintsUsed: number
  difficulty: number
  difficultyName: string
}

const DISK_COLORS = [
  'bg-red-500',
  'bg-orange-500', 
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500'
]

const MAX_HINTS = 3

export default function HanoiTowerGame() {
  const [gameState, setGameState] = useState<GameState>({
    towers: [],
    selectedTower: null,
    moves: 0,
    minMoves: 0,
    isComplete: false,
    startTime: Date.now(),
    endTime: null,
    hintsUsed: 0,
    difficulty: 0,
    difficultyName: ''
  })
  const [showInstructions, setShowInstructions] = useState(true)
  const [numDisks, setNumDisks] = useState(3)

  // 게임 초기화
  const initializeGame = (disks: number) => {
    const towers: Tower[] = [
      { disks: [] },
      { disks: [] },
      { disks: [] }
    ]

    // 첫 번째 타워에 디스크들 배치
    for (let i = disks; i >= 1; i--) {
      towers[0].disks.push({
        size: i,
        color: DISK_COLORS[(i - 1) % DISK_COLORS.length]
      })
    }

    // 최소 이동 횟수 계산 (2^n - 1)
    const minMoves = Math.pow(2, disks) - 1

    return { towers, minMoves }
  }

  // 게임 시작
  const startGame = (disks: number) => {
    const { towers, minMoves } = initializeGame(disks)
    
    // 난이도 정보 설정
    const difficultyInfo = [
      { level: 1, name: '초급' },
      { level: 2, name: '중급' },
      { level: 3, name: '고급' },
      { level: 4, name: '전문가' },
      { level: 5, name: '마스터' }
    ].find(info => {
      const diskMapping = [3, 4, 5, 6, 7]
      return diskMapping[info.level - 1] === disks
    })
    
    setGameState({
      towers,
      selectedTower: null,
      moves: 0,
      minMoves,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      hintsUsed: 0,
      difficulty: difficultyInfo?.level || 1,
      difficultyName: difficultyInfo?.name || '초급'
    })
    setNumDisks(disks)
    setShowInstructions(false)
  }

  // 타워 클릭 처리
  const handleTowerClick = (towerIndex: number) => {
    if (gameState.isComplete) return

    if (gameState.selectedTower === null) {
      // 디스크 선택
      if (gameState.towers[towerIndex].disks.length > 0) {
        setGameState(prev => ({
          ...prev,
          selectedTower: towerIndex
        }))
      }
    } else {
      // 디스크 이동
      const sourceTower = gameState.towers[gameState.selectedTower]
      const targetTower = gameState.towers[towerIndex]
      
      if (gameState.selectedTower !== towerIndex && sourceTower.disks.length > 0) {
        const sourceDisk = sourceTower.disks[sourceTower.disks.length - 1]
        
        // 이동 가능한지 확인 (작은 디스크 위에 큰 디스크 올릴 수 없음)
        if (targetTower.disks.length === 0 || 
            targetTower.disks[targetTower.disks.length - 1].size > sourceDisk.size) {
          
          const newTowers = [...gameState.towers]
          newTowers[gameState.selectedTower] = {
            disks: [...sourceTower.disks.slice(0, -1)]
          }
          newTowers[towerIndex] = {
            disks: [...targetTower.disks, sourceDisk]
          }

          setGameState(prev => ({
            ...prev,
            towers: newTowers,
            selectedTower: null,
            moves: prev.moves + 1
          }))

          checkCompletion(newTowers)
        } else {
          // 잘못된 이동 - 선택 해제
          setGameState(prev => ({
            ...prev,
            selectedTower: null
          }))
        }
      } else {
        // 같은 타워 클릭 또는 선택 해제
        setGameState(prev => ({
          ...prev,
          selectedTower: null
        }))
      }
    }
  }

  // 완료 체크
  const checkCompletion = (towers: Tower[]) => {
    const isComplete = towers[2].disks.length === numDisks
    
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

    // 간단한 힌트: 가장 작은 디스크를 찾아서 이동 가능한 위치 제안
    let smallestDiskTower = -1
    let smallestDiskSize = Infinity

    for (let i = 0; i < 3; i++) {
      const tower = gameState.towers[i]
      if (tower.disks.length > 0) {
        const topDisk = tower.disks[tower.disks.length - 1]
        if (topDisk.size < smallestDiskSize) {
          smallestDiskSize = topDisk.size
          smallestDiskTower = i
        }
      }
    }

    if (smallestDiskTower !== -1) {
      // 가장 작은 디스크를 다른 타워로 이동 가능한지 확인
      const sourceTower = gameState.towers[smallestDiskTower]
      const sourceDisk = sourceTower.disks[sourceTower.disks.length - 1]
      
      for (let i = 0; i < 3; i++) {
        if (i !== smallestDiskTower) {
          const targetTower = gameState.towers[i]
          if (targetTower.disks.length === 0 || 
              targetTower.disks[targetTower.disks.length - 1].size > sourceDisk.size) {
            // 이동 가능한 위치 발견
            setGameState(prev => ({
              ...prev,
              selectedTower: smallestDiskTower,
              hintsUsed: prev.hintsUsed + 1
            }))
            return
          }
        }
      }
    }
  }

  // 정답 체크
  const checkSolution = () => {
    const isComplete = gameState.towers[2].disks.length === numDisks
    
    if (isComplete) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now()
      }))
    } else {
      alert('아직 모든 디스크를 오른쪽 타워로 이동하지 못했습니다!')
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      towers: [],
      selectedTower: null,
      moves: 0,
      minMoves: 0,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      hintsUsed: 0,
      difficulty: 1,
      difficultyName: '초급'
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
            <div className="text-6xl mb-4">🗼</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">하노이 타워</h1>
            <p className="text-lg text-gray-600">
              모든 디스크를 오른쪽 타워로 이동하는 전략적 퍼즐
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-mint-50 p-4 rounded-lg">
              <h3 className="font-bold text-mint-800 mb-2">🎯 게임 목표</h3>
              <p className="text-mint-700">
                모든 디스크를 왼쪽 타워에서 오른쪽 타워로 이동시키세요.
              </p>
            </div>

            <div className="bg-lavender-50 p-4 rounded-lg">
              <h3 className="font-bold text-lavender-800 mb-2">💡 게임 규칙</h3>
              <ul className="text-lavender-700 space-y-1">
                <li>• 한 번에 하나의 디스크만 이동할 수 있습니다</li>
                <li>• 큰 디스크 위에 작은 디스크를 올릴 수 없습니다</li>
                <li>• 빈 타워에는 어떤 디스크든 올릴 수 있습니다</li>
                <li>• 최소한의 이동으로 완성하는 것이 목표입니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🎮 조작 방법</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• 디스크가 있는 타워를 클릭하여 디스크를 선택합니다</li>
                <li>• 이동할 타워를 클릭하여 디스크를 이동합니다</li>
                <li>• 힌트 버튼으로 다음 이동을 추천받을 수 있습니다</li>
                <li>• 정답 체크 버튼으로 완성 여부를 확인합니다</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">난이도 선택</h3>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[
                { disks: 3, level: 1, name: '초급' },
                { disks: 4, level: 2, name: '중급' },
                { disks: 5, level: 3, name: '고급' },
                { disks: 6, level: 4, name: '전문가' },
                { disks: 7, level: 5, name: '마스터' }
              ].map(({ disks, level, name }) => (
                <button
                  key={disks}
                  onClick={() => startGame(disks)}
                  className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
                >
                  <div className="text-lg font-bold">{level}단계</div>
                  <div className="text-xs opacity-90">{name}</div>
                  <div className="text-xs opacity-75">{disks}개</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">디스크가 많을수록 더 어려워집니다</p>
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
                <h1 className="text-2xl font-bold text-gray-900">하노이 타워</h1>
                <p className="text-sm text-gray-600">{numDisks}개 디스크</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">이동:</span> {gameState.moves}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">최소:</span> {gameState.minMoves}
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
                <div className="text-2xl font-bold text-mint-600">{numDisks}</div>
                <div className="text-sm text-gray-600">디스크 개수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lavender-600">{gameState.moves}</div>
                <div className="text-sm text-gray-600">이동 횟수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{gameState.minMoves}</div>
                <div className="text-sm text-gray-600">최소 이동</div>
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

        {/* 하노이 타워 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-center space-x-8">
            {gameState.towers.map((tower, towerIndex) => (
              <div key={towerIndex} className="flex flex-col items-center">
                {/* 타워 기둥 */}
                <div className="relative">
                  <div className="w-4 h-64 bg-gray-400 rounded-full"></div>
                  
                  {/* 디스크들 */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center space-y-1">
                    {tower.disks.map((disk, diskIndex) => (
                      <motion.div
                        key={diskIndex}
                        className={`${disk.color} rounded-lg border-2 border-gray-600 shadow-lg`}
                        style={{
                          width: `${20 + disk.size * 8}px`,
                          height: '20px'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: diskIndex * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* 타워 클릭 영역 */}
                <motion.button
                  onClick={() => handleTowerClick(towerIndex)}
                  className={`
                    w-32 h-16 mt-4 rounded-lg border-2 transition-all duration-200
                    ${gameState.selectedTower === towerIndex
                      ? 'border-mint-500 bg-mint-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-bold text-gray-700">
                    타워 {towerIndex + 1}
                  </div>
                </motion.button>
              </div>
            ))}
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
                하노이 타워를 완성했습니다!
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-mint-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-mint-600">{getGameTime()}</div>
                  <div className="text-sm text-gray-600">완성 시간</div>
                </div>
                <div className="bg-lavender-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-lavender-600">{gameState.moves}</div>
                  <div className="text-sm text-gray-600">이동 횟수</div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="text-lg font-bold text-yellow-600">
                  {gameState.moves === gameState.minMoves ? '최적해!' : `최소 이동: ${gameState.minMoves}`}
                </div>
                <div className="text-sm text-gray-600">효율성</div>
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
