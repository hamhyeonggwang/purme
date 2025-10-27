'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface LinkyProps {
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  thinking?: boolean
  className?: string
}

export function Linky({ size = 'medium', animated = true, thinking = false, className = '' }: LinkyProps) {
  // const [isGlowing, setIsGlowing] = useState(false) // 사용하지 않음

  useEffect(() => {
    if (thinking) {
      const interval = setInterval(() => {
        // setIsGlowing(prev => !prev) // 사용하지 않음
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [thinking])

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={animated ? {
        y: [0, -5, 0],
        rotate: [0, 2, -2, 0]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 링키의 몸체 */}
      <div className="relative w-full h-full">
        {/* 머리 (전구) */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-3/4 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-4 border-yellow-400"
          animate={thinking ? {
            boxShadow: [
              '0 0 10px #FCD34D',
              '0 0 20px #F59E0B',
              '0 0 10px #FCD34D'
            ]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* 전구 내부 빛 */}
          <div className="absolute inset-2 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full opacity-80" />
          
          {/* 눈 */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full" />
          
          {/* 미소 */}
          <motion.div
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-600 rounded-full"
            animate={thinking ? {
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* 몸체 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-to-b from-mint-300 to-mint-400 rounded-full border-2 border-mint-500">
          {/* 팔 */}
          <motion.div
            className="absolute top-1/2 left-0 w-1 h-4 bg-mint-500 rounded-full"
            animate={animated ? {
              rotate: [0, 15, -15, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 right-0 w-1 h-4 bg-mint-500 rounded-full"
            animate={animated ? {
              rotate: [0, -15, 15, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>

        {/* 다리 */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-2 bg-mint-500 rounded-full" />

        {/* 생각 말풍선 */}
        {thinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-white rounded-full px-3 py-1 border-2 border-yellow-300 shadow-lg">
              <div className="flex space-x-1">
                <motion.div
                  className="w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.div
                  className="w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

