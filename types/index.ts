// 사용자 관련 타입
export interface User {
  id: string
  name: string
  age: number
  grade: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// 치료사 관련 타입
export interface Therapist {
  id: string
  name: string
  email: string
  license: string
  specialization: string[]
  createdAt: Date
}

// 훈련 세션 관련 타입
export interface TrainingSession {
  id: string
  userId: string
  therapistId: string
  type: TrainingType
  module: string
  difficulty: DifficultyLevel
  startTime: Date
  endTime?: Date
  score?: number
  accuracy?: number
  timeSpent?: number
  completed: boolean
}

// 훈련 타입
export type TrainingType = 'visual' | 'cognitive' | 'kiosk' | 'adaptive'

// 난이도 레벨
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

// 시지각 훈련 관련 타입
export interface VisualTraining {
  id: string
  type: VisualTrainingType
  stimuli: VisualStimulus[]
  correctAnswer: number
  userAnswer?: number
  responseTime?: number
  accuracy: boolean
}

export type VisualTrainingType = 
  | 'shape_perception'      // 형태 지각
  | 'spatial_perception'    // 공간 지각
  | 'visual_memory'         // 시각 기억
  | 'visual_motor_coordination' // 시각 운동 협응

export interface VisualStimulus {
  id: string
  type: 'shape' | 'color' | 'pattern' | 'position'
  data: any
  position: { x: number; y: number }
  size: { width: number; height: number }
}

// 인지 훈련관련 타입
export interface CognitiveTraining {
  id: string
  type: CognitiveTrainingType
  task: CognitiveTask
  userResponse?: any
  responseTime?: number
  accuracy: boolean
}

export type CognitiveTrainingType = 
  | 'attention'           // 주의 집중
  | 'working_memory'      // 작업 기억
  | 'problem_solving'     // 문제 해결
  | 'planning'            // 계획 수립

export interface CognitiveTask {
  id: string
  instructions: string
  stimuli: any[]
  correctAnswer: any
  timeLimit?: number
}

// 키오스크 훈련 관련 타입
export interface KioskTraining {
  id: string
  scenario: KioskScenario
  steps: KioskStep[]
  currentStep: number
  completed: boolean
  totalTime?: number
}

export type KioskScenario = 
  | 'convenience_store'    // 편의점
  | 'library'             // 도서관
  | 'transportation'      // 교통카드
  | 'hospital'            // 병원
  | 'bank'                // 은행

export interface KioskStep {
  id: string
  title: string
  description: string
  action: KioskAction
  completed: boolean
  timeSpent?: number
  attempts?: number
}

export interface KioskAction {
  type: 'touch' | 'swipe' | 'type' | 'select'
  target: string
  value?: any
}

// 성과 분석 관련 타입
export interface PerformanceData {
  userId: string
  sessionId: string
  trainingType: TrainingType
  metrics: PerformanceMetrics
  timestamp: Date
}

export interface PerformanceMetrics {
  accuracy: number
  responseTime: number
  completionRate: number
  difficultyLevel: DifficultyLevel
  improvements: ImprovementArea[]
}

export interface ImprovementArea {
  area: string
  improvement: number
  trend: 'up' | 'down' | 'stable'
}

// AI 적응형 훈련 관련 타입
export interface AdaptiveTraining {
  id: string
  userId: string
  currentLevel: DifficultyLevel
  performanceHistory: PerformanceData[]
  nextRecommendation: TrainingRecommendation
}

export interface TrainingRecommendation {
  type: TrainingType
  module: string
  difficulty: DifficultyLevel
  estimatedDuration: number
  reason: string
}

// 알림 및 피드백 관련 타입
export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'reminder' | 'progress' | 'encouragement'
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export interface Feedback {
  id: string
  sessionId: string
  type: 'positive' | 'constructive' | 'encouragement'
  message: string
  visual: string
  sound?: string
}

// 설정 관련 타입
export interface UserSettings {
  userId: string
  theme: 'child' | 'kiosk' | 'standard'
  soundEnabled: boolean
  vibrationEnabled: boolean
  fontSize: 'small' | 'medium' | 'large'
  language: 'ko' | 'en'
  accessibility: AccessibilitySettings
}

export interface AccessibilitySettings {
  highContrast: boolean
  largeButtons: boolean
  voiceGuidance: boolean
  simplifiedUI: boolean
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 통계 및 대시보드 타입
export interface DashboardData {
  totalSessions: number
  averageScore: number
  improvementRate: number
  weeklyProgress: WeeklyProgress[]
  skillBreakdown: SkillBreakdown[]
  recentActivities: RecentActivity[]
}

export interface WeeklyProgress {
  week: string
  sessions: number
  averageScore: number
  improvement: number
}

export interface SkillBreakdown {
  skill: string
  level: number
  progress: number
  trend: 'up' | 'down' | 'stable'
}

export interface RecentActivity {
  id: string
  type: TrainingType
  title: string
  score: number
  timestamp: Date
  improvement: number
}

