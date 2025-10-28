import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionLog {
  scenario: string
  step: string
  start: number
  end?: number
  actions: Array<{
    timestamp: number
    type: string
    payload?: any
  }>
  errors?: Array<{
    timestamp: number
    code: string
    message: string
  }>
  assists?: number
}

export interface UserSession {
  id: string
  scenario: string
  currentStep: string
  startTime: number
  endTime?: number
  isComplete: boolean
  isPaused: boolean
  logs: SessionLog[]
  data: any
}

interface SessionState {
  currentSession: UserSession | null
  sessions: UserSession[]
  isEasyMode: boolean
  language: 'ko' | 'en'
  isDarkMode: boolean
  
  // Actions
  startSession: (scenario: string) => void
  updateSession: (data: any) => void
  nextStep: (step: string) => void
  previousStep: () => void
  pauseSession: () => void
  resumeSession: () => void
  completeSession: () => void
  logAction: (type: string, payload?: any) => void
  logError: (code: string, message: string) => void
  useAssist: () => void
  toggleEasyMode: () => void
  setLanguage: (lang: 'ko' | 'en') => void
  toggleDarkMode: () => void
  clearSessions: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      isEasyMode: false,
      language: 'ko',
      isDarkMode: false,

      startSession: (scenario: string) => {
        const sessionId = `session_${Date.now()}`
        const newSession: UserSession = {
          id: sessionId,
          scenario,
          currentStep: 'menu',
          startTime: Date.now(),
          isComplete: false,
          isPaused: false,
          logs: [],
          data: {}
        }
        
        set({
          currentSession: newSession,
          sessions: [...get().sessions, newSession]
        })
      },

      updateSession: (data: any) => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            data: { ...currentSession.data, ...data }
          }
          set({ currentSession: updatedSession })
        }
      },

      nextStep: (step: string) => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            currentStep: step
          }
          set({ currentSession: updatedSession })
        }
      },

      previousStep: () => {
        const { currentSession } = get()
        if (currentSession) {
          // 이전 단계 로직 (시나리오별로 다를 수 있음)
          const stepOrder = ['menu', 'options', 'cart', 'name', 'payment', 'receipt']
          const currentIndex = stepOrder.indexOf(currentSession.currentStep)
          if (currentIndex > 0) {
            const updatedSession = {
              ...currentSession,
              currentStep: stepOrder[currentIndex - 1]
            }
            set({ currentSession: updatedSession })
          }
        }
      },

      pauseSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            isPaused: true
          }
          set({ currentSession: updatedSession })
        }
      },

      resumeSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            isPaused: false
          }
          set({ currentSession: updatedSession })
        }
      },

      completeSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            isComplete: true,
            endTime: Date.now()
          }
          set({ currentSession: updatedSession })
        }
      },

      logAction: (type: string, payload?: any) => {
        const { currentSession } = get()
        if (currentSession) {
          const logEntry = {
            timestamp: Date.now(),
            type,
            payload
          }
          
          const updatedSession = {
            ...currentSession,
            logs: currentSession.logs.map(log => 
              log.step === currentSession.currentStep 
                ? { ...log, actions: [...log.actions, logEntry] }
                : log
            )
          }
          set({ currentSession: updatedSession })
        }
      },

      logError: (code: string, message: string) => {
        const { currentSession } = get()
        if (currentSession) {
          const errorEntry = {
            timestamp: Date.now(),
            code,
            message
          }
          
          const updatedSession = {
            ...currentSession,
            logs: currentSession.logs.map(log => 
              log.step === currentSession.currentStep 
                ? { 
                    ...log, 
                    errors: [...(log.errors || []), errorEntry] 
                  }
                : log
            )
          }
          set({ currentSession: updatedSession })
        }
      },

      useAssist: () => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            logs: currentSession.logs.map(log => 
              log.step === currentSession.currentStep 
                ? { ...log, assists: (log.assists || 0) + 1 }
                : log
            )
          }
          set({ currentSession: updatedSession })
        }
      },

      toggleEasyMode: () => {
        set({ isEasyMode: !get().isEasyMode })
      },

      setLanguage: (lang: 'ko' | 'en') => {
        set({ language: lang })
      },

      toggleDarkMode: () => {
        set({ isDarkMode: !get().isDarkMode })
      },

      clearSessions: () => {
        set({ sessions: [], currentSession: null })
      }
    }),
    {
      name: 'kiosk-session-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        isEasyMode: state.isEasyMode,
        language: state.language,
        isDarkMode: state.isDarkMode
      })
    }
  )
)
