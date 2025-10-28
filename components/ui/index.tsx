import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  isEasyMode?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  isEasyMode = false
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300'
  }
  
  const sizeClasses = {
    sm: isEasyMode ? 'px-4 py-3 text-lg' : 'px-3 py-2 text-base',
    md: isEasyMode ? 'px-6 py-4 text-xl' : 'px-4 py-3 text-lg',
    lg: isEasyMode ? 'px-8 py-6 text-2xl' : 'px-6 py-4 text-xl'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

interface StepperProps {
  steps: Array<{ key: string; title: string }>
  currentStep: string
  isEasyMode?: boolean
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, isEasyMode = false }) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep)
  
  return (
    <div className={`flex items-center justify-center ${isEasyMode ? 'py-6' : 'py-4'}`}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full flex items-center justify-center ${
                index <= currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              } ${isEasyMode ? 'w-12 h-12 text-lg' : 'w-8 h-8 text-sm'}`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-center ${isEasyMode ? 'text-lg' : 'text-sm'} ${
              index <= currentIndex ? 'text-blue-600 font-semibold' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-4 ${isEasyMode ? 'w-16' : 'w-12'} h-0.5 ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  isEasyMode?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  isEasyMode = false
}) => {
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} ${
          isEasyMode ? 'p-8' : 'p-6'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold text-gray-900 ${isEasyMode ? 'text-3xl' : 'text-2xl'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-600 transition-colors ${
              isEasyMode ? 'text-3xl' : 'text-2xl'
            }`}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

interface KeypadProps {
  onInput: (value: string) => void
  onDelete: () => void
  onConfirm: () => void
  isEasyMode?: boolean
  randomize?: boolean
}

export const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onDelete,
  onConfirm,
  isEasyMode = false,
  randomize = false
}) => {
  const numbers = randomize 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
    : [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  return (
    <div className={`grid grid-cols-3 gap-4 ${isEasyMode ? 'p-6' : 'p-4'}`}>
      {numbers.map((num) => (
        <Button
          key={num}
          onClick={() => onInput(num.toString())}
          size={isEasyMode ? 'lg' : 'md'}
          className={isEasyMode ? 'h-20' : 'h-16'}
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={onDelete}
        variant="secondary"
        size={isEasyMode ? 'lg' : 'md'}
        className={isEasyMode ? 'h-20' : 'h-16'}
      >
        삭제
      </Button>
      <Button
        onClick={() => onInput('0')}
        size={isEasyMode ? 'lg' : 'md'}
        className={isEasyMode ? 'h-20' : 'h-16'}
      >
        0
      </Button>
      <Button
        onClick={onConfirm}
        variant="success"
        size={isEasyMode ? 'lg' : 'md'}
        className={isEasyMode ? 'h-20' : 'h-16'}
      >
        확인
      </Button>
    </div>
  )
}

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
  isEasyMode?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isEasyMode = false
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 ${typeClasses[type]} rounded-lg shadow-lg ${
        isEasyMode ? 'px-6 py-4 text-xl' : 'px-4 py-3 text-lg'
      } z-50`}
    >
      {message}
    </motion.div>
  )
}
