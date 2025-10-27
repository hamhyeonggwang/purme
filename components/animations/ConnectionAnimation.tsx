'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Doty } from '../characters/Doty'

interface ConnectionAnimationProps {
  className?: string
  onComplete?: () => void
}

export function ConnectionAnimation({ className = '', onComplete }: ConnectionAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dots, setDots] = useState([
    { id: 1, x: 50, y: 200, connected: false, color: '#A4E4E0' },
    { id: 2, x: 200, y: 150, connected: false, color: '#C7B9FF' },
    { id: 3, x: 350, y: 200, connected: false, color: '#FFF8B5' }
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < dots.length) {
        setDots(prev => prev.map((dot, index) => 
          index <= currentStep ? { ...dot, connected: true } : dot
        ))
        setCurrentStep(prev => prev + 1)
      } else if (onComplete) {
        onComplete()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentStep, dots.length, onComplete])

  return (
    <div className={`relative ${className}`}>
      {/* 연결선들 */}
      {currentStep > 0 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* 첫 번째 연결선 */}
          {currentStep >= 1 && (
            <motion.div
              className="absolute h-0.5 bg-gradient-to-r from-mint-300 to-lavender-300"
              style={{
                left: `${dots[0].x + 16}px`,
                top: `${dots[0].y + 16}px`,
                width: `${dots[1].x - dots[0].x - 16}px`,
                transform: 'rotate(-15deg)'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
          
          {/* 두 번째 연결선 */}
          {currentStep >= 2 && (
            <motion.div
              className="absolute h-0.5 bg-gradient-to-r from-lavender-300 to-yellow-300"
              style={{
                left: `${dots[1].x + 16}px`,
                top: `${dots[1].y + 16}px`,
                width: `${dots[2].x - dots[1].x - 16}px`,
                transform: 'rotate(15deg)'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}

      {/* 도티들 */}
      {dots.map((dot, index) => (
        <motion.div
          key={dot.id}
          className="absolute"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: dot.connected ? [-2, 2, -2] : 0
          }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.3,
            y: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Doty
            size="medium"
            animated={true}
            connected={dot.connected}
            color={dot.color}
          />
        </motion.div>
      ))}

      {/* "IT" 텍스트가 나타나는 애니메이션 */}
      {currentStep >= 3 && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            IT
          </div>
        </motion.div>
      )}
    </div>
  )
}

