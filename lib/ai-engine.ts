// AI Engine - Link IT의 핵심 AI 기능들
export interface UserPerformance {
  userId: string
  sessionId: string
  gameType: string
  accuracy: number
  reactionTime: number
  attempts: number
  timestamp: number
  emotionalState?: 'frustrated' | 'engaged' | 'bored' | 'confident'
}

export interface AdaptiveDifficulty {
  level: number
  speed: number
  complexity: number
  colorSimilarity: number
  patternComplexity: number
}

export interface PersonalizedRecommendation {
  recommendedGames: string[]
  weakAreas: string[]
  strengths: string[]
  nextSessionPlan: string[]
  estimatedProgress: number
}

export interface LearningPrediction {
  currentLevel: number
  predictedLevel: number
  estimatedWeeksToGoal: number
  confidence: number
  recommendations: string[]
}

export interface EmotionalAnalysis {
  state: 'frustrated' | 'engaged' | 'bored' | 'confident'
  confidence: number
  suggestedActions: string[]
  motivationalMessage: string
}

export interface EyeTrackingData {
  gazePoints: { x: number; y: number; timestamp: number }[]
  attentionAreas: { area: string; duration: number; percentage: number }[]
  focusPattern: 'scattered' | 'focused' | 'distracted'
}

export interface PatternAnalysis {
  userPatterns: {
    preferredColors: string[]
    preferredSpeeds: number[]
    preferredComplexity: number[]
    commonMistakes: string[]
  }
  gamePatterns: {
    optimalDifficulty: number
    bestTimeOfDay: string
    sessionLength: number
  }
}

class AIEngine {
  private userData: Map<string, UserPerformance[]> = new Map()
  private learningModels: Map<string, any> = new Map()

  // 1. 적응형 난이도 조절
  calculateAdaptiveDifficulty(userId: string, gameType: string): AdaptiveDifficulty {
    const userHistory = this.userData.get(userId) || []
    const recentSessions = userHistory
      .filter(session => session.gameType === gameType)
      .slice(-10) // 최근 10세션

    if (recentSessions.length === 0) {
      return {
        level: 1,
        speed: 1.0,
        complexity: 1.0,
        colorSimilarity: 0.3,
        patternComplexity: 1.0
      }
    }

    const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
    const avgReactionTime = recentSessions.reduce((sum, s) => sum + s.reactionTime, 0) / recentSessions.length
    const recentTrend = this.calculateTrend(recentSessions)

    // AI 알고리즘으로 난이도 조절
    let level = 1
    let speed = 1.0
    let complexity = 1.0
    let colorSimilarity = 0.3
    let patternComplexity = 1.0

    if (avgAccuracy > 0.85 && avgReactionTime < 1000 && recentTrend > 0) {
      // 성과가 좋고 개선 중 - 난이도 증가
      level = Math.min(10, Math.floor(avgAccuracy * 10))
      speed = Math.min(2.0, 1.0 + (avgAccuracy - 0.8) * 2)
      complexity = Math.min(3.0, 1.0 + (avgAccuracy - 0.8) * 3)
      colorSimilarity = Math.min(0.8, 0.3 + (avgAccuracy - 0.8) * 0.5)
      patternComplexity = Math.min(3.0, 1.0 + (avgAccuracy - 0.8) * 3)
    } else if (avgAccuracy < 0.6 || avgReactionTime > 2000) {
      // 성과가 낮음 - 난이도 감소
      level = Math.max(1, Math.floor(avgAccuracy * 5))
      speed = Math.max(0.5, 1.0 - (0.6 - avgAccuracy) * 2)
      complexity = Math.max(0.5, 1.0 - (0.6 - avgAccuracy) * 2)
      colorSimilarity = Math.max(0.1, 0.3 - (0.6 - avgAccuracy) * 0.2)
      patternComplexity = Math.max(0.5, 1.0 - (0.6 - avgAccuracy) * 2)
    }

    return {
      level,
      speed,
      complexity,
      colorSimilarity,
      patternComplexity
    }
  }

  // 2. 개인화된 훈련 추천
  generatePersonalizedRecommendation(userId: string): PersonalizedRecommendation {
    const userHistory = this.userData.get(userId) || []
    const gameStats = this.analyzeGamePerformance(userHistory)
    
    const weakAreas: string[] = []
    const strengths: string[] = []
    const recommendedGames: string[] = []

    // 약한 영역 분석
    if (gameStats.visual.accuracy < 0.7) weakAreas.push('visual')
    if (gameStats.memory.accuracy < 0.7) weakAreas.push('memory')
    if (gameStats.attention.accuracy < 0.7) weakAreas.push('attention')
    if (gameStats.spatial.accuracy < 0.7) weakAreas.push('spatial')

    // 강한 영역 분석
    if (gameStats.visual.accuracy > 0.8) strengths.push('visual')
    if (gameStats.memory.accuracy > 0.8) strengths.push('memory')
    if (gameStats.attention.accuracy > 0.8) strengths.push('attention')
    if (gameStats.spatial.accuracy > 0.8) strengths.push('spatial')

    // 추천 게임 생성
    if (weakAreas.includes('visual')) {
      recommendedGames.push('color-matching', 'shape-recognition', 'visual-tracking')
    }
    if (weakAreas.includes('memory')) {
      recommendedGames.push('focus-training', 'pattern-recognition')
    }
    if (weakAreas.includes('attention')) {
      recommendedGames.push('visual-search', 'reaction-speed')
    }
    if (weakAreas.includes('spatial')) {
      recommendedGames.push('spatial-relationship', 'size-comparison')
    }

    // 다음 세션 계획
    const nextSessionPlan = this.generateNextSessionPlan(weakAreas, strengths)

    return {
      recommendedGames: Array.from(new Set(recommendedGames)),
      weakAreas,
      strengths,
      nextSessionPlan,
      estimatedProgress: this.calculateProgressEstimate(userHistory)
    }
  }

  // 3. 실시간 성과 분석 및 피드백
  generateRealtimeFeedback(sessionData: UserPerformance): string {
    const improvements = []
    const encouragements = []

    if (sessionData.accuracy > 0.8) {
      improvements.push('정확도가 뛰어납니다!')
    }
    if (sessionData.reactionTime < 1000) {
      improvements.push('반응속도가 빠릅니다!')
    }
    if (sessionData.attempts < 5) {
      improvements.push('집중력이 좋습니다!')
    }

    // 감정 상태별 격려 메시지
    switch (sessionData.emotionalState) {
      case 'frustrated':
        encouragements.push('조금씩 천천히 해보세요. 실패는 성공의 어머니예요! 🌟')
        break
      case 'engaged':
        encouragements.push('훌륭한 집중력이에요! 계속 이렇게 해보세요! 🎯')
        break
      case 'bored':
        encouragements.push('새로운 도전을 준비했어요! 조금 더 어려운 게임을 해볼까요? 🚀')
        break
      case 'confident':
        encouragements.push('자신감이 넘치네요! 더 높은 목표에 도전해보세요! 🏆')
        break
    }

    return `${improvements.join(' ')} ${encouragements.join(' ')}`
  }

  // 4. 감정 상태 인식 및 조절
  analyzeEmotionalState(userId: string, recentSessions: UserPerformance[]): EmotionalAnalysis {
    if (recentSessions.length === 0) {
      return {
        state: 'engaged',
        confidence: 0.5,
        suggestedActions: ['start_training'],
        motivationalMessage: '새로운 훈련을 시작해보세요!'
      }
    }

    const recentSession = recentSessions[recentSessions.length - 1]
    const trend = this.calculateTrend(recentSessions.slice(-5))

    let state: 'frustrated' | 'engaged' | 'bored' | 'confident' = 'engaged'
    const confidence = 0.7
    let suggestedActions: string[] = []
    let motivationalMessage = ''

    // 감정 상태 판단 로직
    if (recentSession.accuracy < 0.5 && recentSession.reactionTime > 2000) {
      state = 'frustrated'
      suggestedActions = ['reduce_difficulty', 'show_encouragement', 'break_session']
      motivationalMessage = '괜찮아요! 쉬운 것부터 다시 시작해보세요. 🌱'
    } else if (recentSession.accuracy > 0.9 && recentSession.reactionTime < 800) {
      state = 'confident'
      suggestedActions = ['increase_difficulty', 'challenge_mode', 'celebrate']
      motivationalMessage = '와! 정말 잘하고 있어요! 더 어려운 도전을 해볼까요? 🎉'
    } else if (trend < -0.1) {
      state = 'bored'
      suggestedActions = ['new_game_type', 'increase_variety', 'add_challenge']
      motivationalMessage = '새로운 게임을 준비했어요! 더 재미있을 거예요! 🎮'
    } else {
      state = 'engaged'
      suggestedActions = ['maintain_difficulty', 'positive_feedback']
      motivationalMessage = '좋은 페이스예요! 계속 이렇게 해보세요! ⭐'
    }

    return {
      state,
      confidence,
      suggestedActions,
      motivationalMessage
    }
  }

  // 5. 예측적 학습 분석
  predictLearningProgress(userId: string): LearningPrediction {
    const userHistory = this.userData.get(userId) || []
    const recentSessions = userHistory.slice(-20)

    if (recentSessions.length < 5) {
      return {
        currentLevel: 1,
        predictedLevel: 2,
        estimatedWeeksToGoal: 4,
        confidence: 0.3,
        recommendations: ['continue_basic_training']
      }
    }

    const currentLevel = this.calculateCurrentLevel(recentSessions)
    const learningRate = this.calculateLearningRate(recentSessions)
    const predictedLevel = Math.min(10, currentLevel + learningRate * 4) // 4주 예측
    const estimatedWeeksToGoal = Math.max(1, Math.ceil((10 - currentLevel) / learningRate))

    const recommendations = this.generateProgressRecommendations(recentSessions, learningRate)

    return {
      currentLevel,
      predictedLevel,
      estimatedWeeksToGoal,
      confidence: Math.min(0.9, 0.5 + recentSessions.length * 0.02),
      recommendations
    }
  }

  // 6. 패턴 인식 및 예측
  analyzeUserPatterns(userId: string): PatternAnalysis {
    const userHistory = this.userData.get(userId) || []
    
    const preferredColors = this.extractPreferredColors(userHistory)
    const preferredSpeeds = this.extractPreferredSpeeds(userHistory)
    const preferredComplexity = this.extractPreferredComplexity(userHistory)
    const commonMistakes = this.extractCommonMistakes(userHistory)

    const optimalDifficulty = this.calculateOptimalDifficulty(userHistory)
    const bestTimeOfDay = this.calculateBestTimeOfDay(userHistory)
    const sessionLength = this.calculateOptimalSessionLength(userHistory)

    return {
      userPatterns: {
        preferredColors,
        preferredSpeeds,
        preferredComplexity,
        commonMistakes
      },
      gamePatterns: {
        optimalDifficulty,
        bestTimeOfDay,
        sessionLength
      }
    }
  }

  // 사용자 데이터 저장
  recordUserPerformance(performance: UserPerformance): void {
    const userId = performance.userId
    if (!this.userData.has(userId)) {
      this.userData.set(userId, [])
    }
    this.userData.get(userId)!.push(performance)
  }

  // 헬퍼 메서드들
  private calculateTrend(sessions: UserPerformance[]): number {
    if (sessions.length < 2) return 0
    const first = sessions[0].accuracy
    const last = sessions[sessions.length - 1].accuracy
    return last - first
  }

  private analyzeGamePerformance(history: UserPerformance[]) {
    const gameStats = {
      visual: { accuracy: 0, count: 0 },
      memory: { accuracy: 0, count: 0 },
      attention: { accuracy: 0, count: 0 },
      spatial: { accuracy: 0, count: 0 }
    }

    history.forEach(session => {
      const category = this.categorizeGame(session.gameType)
      gameStats[category].accuracy += session.accuracy
      gameStats[category].count += 1
    })

    // 평균 계산
    Object.keys(gameStats).forEach(key => {
      const stats = gameStats[key as keyof typeof gameStats]
      if (stats.count > 0) {
        stats.accuracy = stats.accuracy / stats.count
      }
    })

    return gameStats
  }

  private categorizeGame(gameType: string): 'visual' | 'memory' | 'attention' | 'spatial' {
    const visualGames = ['color-matching', 'shape-recognition', 'visual-tracking', 'visual-search']
    const memoryGames = ['focus-training', 'pattern-recognition']
    const attentionGames = ['reaction-speed', 'visual-search']
    const spatialGames = ['spatial-relationship', 'size-comparison']

    if (visualGames.includes(gameType)) return 'visual'
    if (memoryGames.includes(gameType)) return 'memory'
    if (attentionGames.includes(gameType)) return 'attention'
    if (spatialGames.includes(gameType)) return 'spatial'
    return 'visual' // 기본값
  }

  private generateNextSessionPlan(weakAreas: string[], strengths: string[]): string[] {
    const plan = []
    if (weakAreas.length > 0) {
      plan.push(`${weakAreas[0]} 영역 집중 훈련`)
    }
    if (strengths.length > 0) {
      plan.push(`${strengths[0]} 영역 도전 모드`)
    }
    plan.push('전체 영역 균형 훈련')
    return plan
  }

  private calculateProgressEstimate(history: UserPerformance[]): number {
    if (history.length === 0) return 0
    const recentAccuracy = history.slice(-5).reduce((sum, s) => sum + s.accuracy, 0) / 5
    return Math.min(100, recentAccuracy * 100)
  }

  private calculateCurrentLevel(sessions: UserPerformance[]): number {
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    return Math.min(10, Math.floor(avgAccuracy * 10))
  }

  private calculateLearningRate(sessions: UserPerformance[]): number {
    if (sessions.length < 3) return 0.1
    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2))
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length
    
    return Math.max(0, secondAvg - firstAvg)
  }

  private generateProgressRecommendations(sessions: UserPerformance[], learningRate: number): string[] {
    const recommendations = []
    
    if (learningRate > 0.1) {
      recommendations.push('빠른 학습 속도! 더 어려운 도전을 해보세요')
    } else if (learningRate < 0.05) {
      recommendations.push('꾸준한 연습이 필요해요. 매일 조금씩 해보세요')
    }
    
    recommendations.push('규칙적인 훈련으로 더 큰 효과를 얻을 수 있어요')
    
    return recommendations
  }

  private extractPreferredColors(_history: UserPerformance[]): string[] {
    // 색상 선호도 분석 로직 (실제로는 더 복잡한 분석 필요)
    return ['#FF6B6B', '#4ECDC4', '#45B7D1']
  }

  private extractPreferredSpeeds(_history: UserPerformance[]): number[] {
    const speeds = _history.map(s => s.reactionTime).filter(s => s > 0)
    if (speeds.length === 0) return [1000]
    const avg = speeds.reduce((sum, s) => sum + s, 0) / speeds.length
    return [avg * 0.8, avg, avg * 1.2] // 느림, 보통, 빠름
  }

  private extractPreferredComplexity(_history: UserPerformance[]): number[] {
    // 복잡도 선호도 분석
    return [1, 2, 3]
  }

  private extractCommonMistakes(_history: UserPerformance[]): string[] {
    // 일반적인 실패 패턴 분석
    return ['색상 구분', '반응 속도', '집중력']
  }

  private calculateOptimalDifficulty(_history: UserPerformance[]): number {
    const recentSessions = _history.slice(-10)
    if (recentSessions.length === 0) return 1
    
    const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
    return Math.min(10, Math.floor(avgAccuracy * 10))
  }

  private calculateBestTimeOfDay(_history: UserPerformance[]): string {
    // 시간대별 성과 분석 (실제로는 timestamp 기반 분석 필요)
    return '오전 10시'
  }

  private calculateOptimalSessionLength(_history: UserPerformance[]): number {
    // 세션 길이별 성과 분석
    return 15 // 15분
  }
}

// 싱글톤 인스턴스
export const aiEngine = new AIEngine()

// AI 기능을 위한 React Hook
export const useAI = () => {
  const getAdaptiveDifficulty = (userId: string, gameType: string) => {
    return aiEngine.calculateAdaptiveDifficulty(userId, gameType)
  }

  const getPersonalizedRecommendation = (userId: string) => {
    return aiEngine.generatePersonalizedRecommendation(userId)
  }

  const getRealtimeFeedback = (sessionData: UserPerformance) => {
    return aiEngine.generateRealtimeFeedback(sessionData)
  }

  const analyzeEmotionalState = (userId: string, recentSessions: UserPerformance[]) => {
    return aiEngine.analyzeEmotionalState(userId, recentSessions)
  }

  const predictLearningProgress = (userId: string) => {
    return aiEngine.predictLearningProgress(userId)
  }

  const analyzeUserPatterns = (userId: string) => {
    return aiEngine.analyzeUserPatterns(userId)
  }

  const recordPerformance = (performance: UserPerformance) => {
    aiEngine.recordUserPerformance(performance)
  }

  return {
    getAdaptiveDifficulty,
    getPersonalizedRecommendation,
    getRealtimeFeedback,
    analyzeEmotionalState,
    predictLearningProgress,
    analyzeUserPatterns,
    recordPerformance
  }
}
