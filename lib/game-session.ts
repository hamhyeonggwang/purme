import { trainingAPI } from '@/lib/api'

// 게임 세션 관리 클래스
export class GameSessionManager {
  private sessionId: string | null = null
  private startTime: number = 0
  private gameData: any = {}

  // 게임 세션 시작
  async startSession(gameType: string, module: string, difficulty: string = 'easy', level: number = 1) {
    try {
      const response = await trainingAPI.startSession({
        training_type: gameType,
        module,
        difficulty,
        level,
        sessionData: {}
      })

      this.sessionId = response.session.id
      this.startTime = Date.now()
      this.gameData = {
        score: 0,
        accuracy: 0,
        attempts: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        timeSpent: 0
      }

      console.log(`🎮 게임 세션 시작: ${gameType}/${module}`)
      return response.session
    } catch (error) {
      console.error('게임 세션 시작 실패:', error)
      throw error
    }
  }

  // 게임 데이터 업데이트
  async updateGameData(updates: {
    score?: number
    accuracy?: number
    attempts?: number
    correctAnswers?: number
    totalAnswers?: number
    timeSpent?: number
    sessionData?: any
  }) {
    if (!this.sessionId) return

    try {
      Object.assign(this.gameData, updates)
      
      // 실시간 업데이트는 필요에 따라 구현 (예: 일정 시간마다 또는 특정 이벤트 발생 시)
      // 현재는 세션 완료 시점에 모든 데이터를 전송하는 방식으로 가정

      console.log(`📊 게임 데이터 업데이트:`, updates)
    } catch (error) {
      console.error('게임 데이터 업데이트 실패:', error)
    }
  }

  // 정답 처리
  async recordAnswer(isCorrect: boolean, points: number = 0) {
    if (!this.sessionId) return

    this.gameData.attempts += 1
    this.gameData.totalAnswers += 1
    
    if (isCorrect) {
      this.gameData.correctAnswers += 1
      this.gameData.score += points
    }

    // 정확도 계산
    this.gameData.accuracy = Math.round(
      (this.gameData.correctAnswers / this.gameData.totalAnswers) * 100
    )

    await this.updateGameData({
      score: this.gameData.score,
      accuracy: this.gameData.accuracy,
      attempts: this.gameData.attempts,
      correctAnswers: this.gameData.correctAnswers,
      totalAnswers: this.gameData.totalAnswers
    })

    return {
      score: this.gameData.score,
      accuracy: this.gameData.accuracy,
      isCorrect
    }
  }

  // 게임 완료
  async completeGame(levelCompleted: boolean = false, feedback?: any) {
    if (!this.sessionId) return null

    try {
      const endTime = Date.now()
      const timeSpent = Math.round((endTime - this.startTime) / 1000) // 초 단위

      const response = await trainingAPI.completeSession(this.sessionId, {
        score: this.gameData.score,
        accuracy: this.gameData.accuracy,
        time_spent: timeSpent,
        attempts: this.gameData.attempts,
        correctAnswers: this.gameData.correctAnswers,
        totalAnswers: this.gameData.totalAnswers,
        levelCompleted,
        feedback
      })

      console.log(`🎉 게임 완료: 점수 ${this.gameData.score}, 정확도 ${this.gameData.accuracy}%`)
      
      // 세션 초기화
      this.sessionId = null
      this.startTime = 0
      this.gameData = {}

      return response
    } catch (error) {
      console.error('게임 완료 처리 실패:', error)
      throw error
    }
  }

  // 현재 게임 데이터 조회
  getCurrentData() {
    return { ...this.gameData }
  }

  // 세션 ID 조회
  getSessionId() {
    return this.sessionId
  }
}

// 게임별 설정
export const GAME_CONFIGS = {
  'color-matching': {
    trainingType: 'basic',
    module: 'color_matching',
    maxScore: 1000,
    timeLimit: 60
  },
  'focus-training': {
    trainingType: 'basic',
    module: 'focus_training',
    maxScore: 800,
    timeLimit: 90
  },
  'pattern-recognition': {
    trainingType: 'basic',
    module: 'pattern_recognition',
    maxScore: 1200,
    timeLimit: 120
  },
  'reaction-speed': {
    trainingType: 'basic',
    module: 'reaction_speed',
    maxScore: 600,
    timeLimit: 30
  },
  'shape-recognition': {
    trainingType: 'basic',
    module: 'shape_recognition',
    maxScore: 1000,
    timeLimit: 60
  },
  'size-comparison': {
    trainingType: 'basic',
    module: 'size_comparison',
    maxScore: 800,
    timeLimit: 60
  },
  'spatial-relationship': {
    trainingType: 'basic',
    module: 'spatial_relationship',
    maxScore: 1500,
    timeLimit: 180
  },
  'visual-search': {
    trainingType: 'basic',
    module: 'visual_search',
    maxScore: 1000,
    timeLimit: 90
  },
  'visual-tracking': {
    trainingType: 'basic',
    module: 'visual_tracking',
    maxScore: 1200,
    timeLimit: 120
  }
}

// 게임 결과 저장 함수
export const saveGameResult = async (
  gameType: string,
  result: {
    score: number
    accuracy: number
    timeSpent: number
    levelCompleted?: boolean
    feedback?: any
  }
) => {
  try {
    const config = GAME_CONFIGS[gameType as keyof typeof GAME_CONFIGS]
    if (!config) {
      throw new Error(`Unknown game type: ${gameType}`)
    }

    const sessionManager = new GameSessionManager()
    await sessionManager.startSession(
      config.trainingType,
      config.module,
      'easy',
      1
    )

    await sessionManager.updateGameData({
      score: result.score,
      accuracy: result.accuracy,
      timeSpent: result.timeSpent
    })

    const response = await sessionManager.completeGame(
      result.levelCompleted,
      result.feedback
    )

    return response
  } catch (error) {
    console.error('게임 결과 저장 실패:', error)
    throw error
  }
}

// 사용자 통계 조회
export const getUserGameStats = async () => {
  try {
    const stats = await trainingAPI.getStats()
    return stats
  } catch (error) {
    console.error('사용자 통계 조회 실패:', error)
    return null
  }
}

// 최근 게임 기록 조회
export const getRecentGameSessions = async (limit: number = 10) => {
  try {
    const sessions = await trainingAPI.getRecentSessions()
    return sessions.sessions
  } catch (error) {
    console.error('최근 게임 기록 조회 실패:', error)
    return []
  }
}
