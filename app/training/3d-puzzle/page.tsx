'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { trainingAPI } from '@/lib/api'
import toast from 'react-hot-toast'

// 3D 퍼즐 블록 타입
interface PuzzleBlock {
  id: string
  x: number
  y: number
  z: number
  color: string
  isPlaced: boolean
  targetPosition: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
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
  blocks: PuzzleBlock[]
  targetPattern: PuzzleBlock[]
  isDragging: boolean
  draggedBlock: PuzzleBlock | null
  cameraPosition: { x: number; y: number; z: number }
  cameraRotation: { x: number; y: number; z: number }
  completedBlocks: number
  totalBlocks: number
  streak: number
  maxStreak: number
}

export default function Puzzle3DPage() {
  // const router = useRouter() // 사용하지 않음
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, isDown: false })
  
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: 120,
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    sessionId: null,
    startTime: null,
    blocks: [],
    targetPattern: [],
    isDragging: false,
    draggedBlock: null,
    cameraPosition: { x: 0, y: 5, z: 10 },
    cameraRotation: { x: -0.3, y: 0, z: 0 },
    completedBlocks: 0,
    totalBlocks: 0,
    streak: 0,
    maxStreak: 0
  })

  const [showInstructions, setShowInstructions] = useState(true)
  // const [, setShowFeedback] = useState(false) // 사용하지 않음
  // const [, setFeedbackMessage] = useState('') // 사용하지 않음
  const [particles, setParticles] = useState<Array<{id: string, x: number, y: number, vx: number, vy: number, life: number}>>([])

  // Canvas 2D 컨텍스트

  // 색상 팔레트
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FFB347', '#87CEEB', '#98FB98', '#F0E68C', '#FF69B4', '#20B2AA'
  ]

  // 레벨별 퍼즐 생성
  const generatePuzzle = (level: number): { blocks: PuzzleBlock[], targetPattern: PuzzleBlock[] } => {
    const blockCount = Math.min(3 + level, 6)
    const blocks: PuzzleBlock[] = []
    const targetPattern: PuzzleBlock[] = []

    // 타겟 패턴 생성 (정답)
    for (let i = 0; i < blockCount; i++) {
      const x = (i % 3) - 1
      const y = Math.floor(i / 3) - 1
      
      targetPattern.push({
        id: `target-${i}`,
        x,
        y,
        z: 0,
        color: colors[i % colors.length],
        isPlaced: true,
        targetPosition: { x, y, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      })
    }

    // 플레이어 블록 생성 (랜덤 위치)
    for (let i = 0; i < blockCount; i++) {
      const x = (Math.random() - 0.5) * 4
      const y = (Math.random() - 0.5) * 4
      
      blocks.push({
        id: `block-${i}`,
        x,
        y,
        z: 0,
        color: colors[i % colors.length],
        isPlaced: false,
        targetPosition: targetPattern[i].targetPosition,
        rotation: { x: 0, y: 0, z: 0 }
      })
    }

    return { blocks, targetPattern }
  }

  // Canvas 2D 초기화
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Canvas 2D not supported')
      return
    }

    // Canvas 설정
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

  }, [])


  // 2D 블록 렌더링
  const renderBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isTarget: boolean = false) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const blockSize = 60
    const spacing = 80

    // 화면 좌표 계산
    const screenX = centerX + (x * spacing) - blockSize / 2
    const screenY = centerY + (y * spacing) - blockSize / 2

    // 색상 설정
    const colorObj = hexToRgb(color)
    
    if (isTarget) {
      // 타겟 블록 (반투명)
      ctx.fillStyle = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.3)`
      ctx.strokeStyle = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.6)`
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
    } else {
      // 일반 블록
      ctx.fillStyle = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`
      ctx.strokeStyle = `rgb(${Math.floor(colorObj.r * 0.7)}, ${Math.floor(colorObj.g * 0.7)}, ${Math.floor(colorObj.b * 0.7)})`
      ctx.lineWidth = 2
      ctx.setLineDash([])
    }

    // 블록 그리기
    ctx.fillRect(screenX, screenY, blockSize, blockSize)
    ctx.strokeRect(screenX, screenY, blockSize, blockSize)

    // 그림자 효과
    if (!isTarget) {
      ctx.fillStyle = `rgba(0, 0, 0, 0.2)`
      ctx.fillRect(screenX + 3, screenY + 3, blockSize, blockSize)
    }
  }


  // 헥스 색상을 RGB로 변환
  const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  // 게임 루프
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 화면 지우기
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 그리드 배경 그리기
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // 타겟 패턴 렌더링 (반투명)
    gameState.targetPattern.forEach(target => {
      const colorWithAlpha = gameState.blocks.find(b => b.id === `block-${target.id.split('-')[1]}`)?.color || target.color
      renderBlock(ctx, target.x, target.y, colorWithAlpha, true)
    })

    // 블록들 렌더링
    gameState.blocks.forEach(block => {
      if (!block.isPlaced) {
        renderBlock(ctx, block.x, block.y, block.color, false)
      }
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState])

  // 마우스 이벤트 처리
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY, isDown: true }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return

    const deltaX = e.clientX - mouseRef.current.x
    const deltaY = e.clientY - mouseRef.current.y

    setGameState(prev => ({
      ...prev,
      cameraRotation: {
        x: prev.cameraRotation.x - deltaY * 0.01,
        y: prev.cameraRotation.y - deltaX * 0.01,
        z: prev.cameraRotation.z
      }
    }))

    mouseRef.current = { x: e.clientX, y: e.clientY, isDown: true }
  }

  const handleMouseUp = () => {
    mouseRef.current.isDown = false
  }

  // 블록 클릭 처리 (사용하지 않음)
  /*
  const handleBlockClick = (blockId: string) => {
    const block = gameState.blocks.find(b => b.id === blockId)
    if (!block || block.isPlaced) return

    setGameState(prev => ({
      ...prev,
      isDragging: true,
      draggedBlock: block
    }))
  }
  */

  // 블록 드롭 처리 (사용하지 않음)
  /*
  const handleBlockDrop = (targetX: number, targetY: number, targetZ: number) => {
    if (!gameState.draggedBlock) return

    const block = gameState.draggedBlock
    const target = gameState.targetPattern.find(t => 
      Math.abs(t.x - targetX) < 0.5 && 
      Math.abs(t.y - targetY) < 0.5 && 
      Math.abs(t.z - targetZ) < 0.5
    )

    if (target && block.color === target.color) {
      // 정답!
      setGameState(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => 
          b.id === block.id 
            ? { ...b, x: target.x, y: target.y, z: target.z, isPlaced: true }
            : b
        ),
        completedBlocks: prev.completedBlocks + 1,
        score: prev.score + 100 * (prev.streak + 1),
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
      }))

      // 파티클 효과
      createParticleEffect(target.x, target.y, target.z)
      
      setFeedbackMessage('완벽해요! 🎉')
      setShowFeedback(true)
      
      setTimeout(() => setShowFeedback(false), 1000)
    } else {
      // 오답
      setGameState(prev => ({
        ...prev,
        streak: 0
      }))
      
      setFeedbackMessage('다시 시도해보세요! 😊')
      setShowFeedback(true)
      
      setTimeout(() => setShowFeedback(false), 1000)
    }

    setGameState(prev => ({
      ...prev,
      isDragging: false,
      draggedBlock: null
    }))
  }
  */

  // 파티클 효과 생성 (사용하지 않음)
  /*
  const createParticleEffect = (x: number, y: number, z: number) => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: x + (Math.random() - 0.5) * 2,
      y: y + (Math.random() - 0.5) * 2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      life: 1.0
    }))
    
    setParticles(prev => [...prev, ...newParticles])
  }
  */

  // 파티클 업데이트
  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      )
    }, 16)

    return () => clearInterval(particleInterval)
  }, [])

  // 게임 시작
  const startGame = async () => {
    try {
      const sessionResponse = await trainingAPI.startSession({
        training_type: 'basic',
        module: '3d_puzzle',
        difficulty: 'beginner'
      })

      const { blocks, targetPattern } = generatePuzzle(gameState.currentLevel)

      setGameState(prev => ({
        ...prev,
        blocks,
        targetPattern,
        gameStarted: true,
        timeLeft: 120,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        sessionId: sessionResponse.session_id.toString(),
        startTime: Date.now(),
        completedBlocks: 0,
        totalBlocks: blocks.length,
        streak: 0,
        maxStreak: 0
      }))
      setShowInstructions(false)

      toast.success('3D 퍼즐 게임이 시작되었습니다!')
    } catch (error) {
      console.error('Failed to start training session:', error)
      toast.error('훈련 세션 시작에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 다음 레벨
  const nextLevel = () => {
    const { blocks, targetPattern } = generatePuzzle(gameState.currentLevel + 1)

    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      blocks,
      targetPattern,
      completedBlocks: 0,
      totalBlocks: blocks.length,
      streak: 0
    }))
  }

  // 게임 완료 체크
  useEffect(() => {
    if (gameState.completedBlocks === gameState.totalBlocks && gameState.totalBlocks > 0) {
      setTimeout(() => {
        nextLevel()
      }, 2000)
    }
  }, [gameState.completedBlocks, gameState.totalBlocks])

  // Canvas 초기화
  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  // 게임 루프 시작
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameCompleted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.gameStarted, gameState.gameCompleted, gameLoop])

  // 시간 관리
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
    }
    return () => clearTimeout(timer)
  }, [gameState.timeLeft, gameState.gameStarted, gameState.gameCompleted])

  // const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0 // 사용하지 않음

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-lavender-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg border-b-4 border-mint-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/training" className="text-mint-500 hover:text-mint-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-mint-600">3D 퍼즐</h1>
                <p className="text-sm text-gray-600">고품질 3D 공간 훈련</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
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
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
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
              <div className="text-2xl font-bold text-secondary-600">{gameState.completedBlocks}/{gameState.totalBlocks}</div>
              <div className="text-sm text-gray-600">완료</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
              <div className="text-sm text-gray-600">연속</div>
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
            {/* 3D 캔버스 */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-mint-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                블록을 올바른 위치로 드래그하세요! (마우스로 화면 회전 가능)
              </h3>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-300 rounded-lg cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {/* 게임 컨트롤 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-mint-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">게임 조작법</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-mint-100 rounded-lg flex items-center justify-center">
                    <span className="text-mint-600">🖱️</span>
                  </div>
                  <span>마우스 드래그로 화면 회전</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-lavender-100 rounded-lg flex items-center justify-center">
                    <span className="text-lavender-600">👆</span>
                  </div>
                  <span>블록 클릭으로 선택</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600">🎯</span>
                  </div>
                  <span>같은 색상 위치에 드롭</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">⚡</span>
                  </div>
                  <span>연속 성공으로 보너스 점수</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 파티클 효과 */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: particle.life }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed pointer-events-none z-50"
              style={{
                left: particle.x * 40 + 400,
                top: particle.y * 40 + 300,
                width: 8,
                height: 8,
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                boxShadow: '0 0 10px #FFD700'
              }}
            />
          ))}
        </AnimatePresence>

        {/* 피드백 섹션 제거됨 */}

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
                  <div className="text-6xl mb-6">🧩</div>
                  <h2 className="text-3xl font-bold text-mint-600 mb-6">
                    3D 퍼즐 게임
                  </h2>
                  <div className="text-left space-y-4 text-lg text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">1</span>
                      </div>
                      <p>3D 공간에서 색깔 블록들을 올바른 위치로 이동시키세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">2</span>
                      </div>
                      <p>마우스로 화면을 회전하여 <span className="text-red-600 font-bold">3D 공간</span>을 탐색하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">3</span>
                      </div>
                      <p>블록을 클릭하고 <span className="text-blue-600 font-bold">같은 색상의 목표 위치</span>에 드롭하세요</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-mint-600 font-bold text-sm">4</span>
                      </div>
                      <p>연속으로 성공하면 <span className="text-purple-600 font-bold">보너스 점수</span>를 획득합니다!</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-blue-700 text-sm">
                      🎮 Unity 수준의 고품질 3D 게임을 경험해보세요!
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={startGame}
                    className="game-button"
                  >
                    🧩 게임 시작
                  </button>
                  <Link href="/training" className="btn-secondary">
                    뒤로 가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🧩</div>
                <h2 className="text-3xl font-bold text-mint-600 mb-6">
                  준비되셨나요?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  3D 퍼즐 게임을 통해 공간 인지 능력을 향상시켜보세요!
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
