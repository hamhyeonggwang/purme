'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DotyProps {
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  connected?: boolean
  color?: string
  className?: string
}

export function Doty({ 
  size = 'medium', 
  animated = true, 
  connected = false, 
  color = '#A4E4E0',
  className = '' 
}: DotyProps) {
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        setIsPulsing(prev => !prev)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [connected])

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={animated ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 도티의 점 */}
      <motion.div
        className="w-full h-full rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: color }}
        animate={connected ? {
          boxShadow: [
            `0 0 0 0 ${color}40`,
            `0 0 0 8px ${color}40`,
            `0 0 0 0 ${color}40`
          ]
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeOut"
        }}
      >
        {/* 내부 하이라이트 */}
        <div 
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-60"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
        />
      </motion.div>

      {/* 연결선 (다른 도티와 연결될 때) */}
      {connected && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* 펄스 효과 */}
      {isPulsing && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  )
}

