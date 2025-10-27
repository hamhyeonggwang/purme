'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 게임 데이터 - 구현된 게임만 표시
const games = [
  // 시지각 및 공간 처리
  {
    id: '3d-puzzle',
    name: '3D 퍼즐',
    category: '시지각 및 공간 처리',
    description: '3차원 공간 인지와 조작 능력을 향상시킵니다',
    icon: '🧩',
    difficulty: '초급',
    duration: '10-20분',
    color: 'mint',
    implemented: true
  }
]

// 개발 중인 게임들 (숨겨진 상태)
const upcomingGames = [
  // 시지각 및 공간 처리
  {
    id: 'chess',
    name: '체스 온라인',
    category: '시지각 및 공간 처리',
    description: '공간적 사고와 전략적 계획을 훈련합니다',
    icon: '♟️',
    difficulty: '중급',
    duration: '15-30분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'visual-crossword',
    name: '비주얼 크로스 워드',
    category: '시지각 및 공간 처리',
    description: '시각적 패턴 인식과 어휘력을 개발합니다',
    icon: '📝',
    difficulty: '중급',
    duration: '20-30분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'ant-escape',
    name: '개미 탈출',
    category: '시지각 및 공간 처리',
    description: '공간 경로 찾기와 문제해결 능력을 훈련합니다',
    icon: '🐜',
    difficulty: '초급',
    duration: '10-15분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'pet-finder',
    name: '애완동물 찾기',
    category: '시지각 및 공간 처리',
    description: '시각적 탐색과 주의력을 향상시킵니다',
    icon: '🐕',
    difficulty: '초급',
    duration: '5-10분',
    color: 'mint',
    implemented: false
  },

  // 주의집중 및 선택적 주의
  {
    id: 'fruit-frenzy',
    name: 'Fruit Frenzy',
    category: '주의집중 및 선택적 주의',
    description: '빠른 반응과 선택적 주의를 훈련합니다',
    icon: '🍎',
    difficulty: '초급',
    duration: '5-10분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'marble-race',
    name: '마블 레이스',
    category: '주의집중 및 선택적 주의',
    description: '지속적 주의와 반응 속도를 향상시킵니다',
    icon: '🔴',
    difficulty: '중급',
    duration: '10-15분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'melody-tennis',
    name: '멜로디 테니스',
    category: '주의집중 및 선택적 주의',
    description: '청각적 주의와 동기화 능력을 개발합니다',
    icon: '🎾',
    difficulty: '중급',
    duration: '15-20분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'neon-sign',
    name: '네온사인',
    category: '주의집중 및 선택적 주의',
    description: '시각적 주의와 추적 능력을 훈련합니다',
    icon: '💡',
    difficulty: '고급',
    duration: '10-20분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'drive-me-crazy',
    name: '나를 미치게해',
    category: '주의집중 및 선택적 주의',
    description: '복합적 주의 과제로 집중력을 향상시킵니다',
    icon: '🎯',
    difficulty: '고급',
    duration: '15-25분',
    color: 'lavender',
    implemented: false
  },

  // 기억력 및 작업기억
  {
    id: 'memory-match',
    name: '짝 맞추기',
    category: '기억력 및 작업기억',
    description: '기억력과 인식 능력을 훈련합니다',
    icon: '🧠',
    difficulty: '초급',
    duration: '10-15분',
    color: 'yellow',
    implemented: false
  },
  {
    id: 'memory-games',
    name: '기억력 게임',
    category: '기억력 및 작업기억',
    description: '다양한 기억 과제로 기억력을 향상시킵니다',
    icon: '🎮',
    difficulty: '중급',
    duration: '15-25분',
    color: 'yellow',
    implemented: false
  },
  {
    id: 'mini-crossword',
    name: '미니 크로스워드',
    category: '기억력 및 작업기억',
    description: '어휘 기억과 회상 능력을 개발합니다',
    icon: '📚',
    difficulty: '중급',
    duration: '20-30분',
    color: 'yellow',
    implemented: false
  },
  {
    id: 'scramble',
    name: '스크램블',
    category: '기억력 및 작업기억',
    description: '단어 조작과 기억력을 훈련합니다',
    icon: '🔤',
    difficulty: '중급',
    duration: '10-20분',
    color: 'yellow',
    implemented: false
  },
  {
    id: 'solitaire',
    name: '솔리테어',
    category: '기억력 및 작업기억',
    description: '시퀀스 기억과 계획 능력을 향상시킵니다',
    icon: '🃏',
    difficulty: '초급',
    duration: '15-30분',
    color: 'yellow',
    implemented: false
  },

  // 추론 및 문제해결
  {
    id: 'pipe-panic',
    name: 'Pipe Panic',
    category: '추론 및 문제해결',
    description: '논리적 연결과 문제해결 능력을 훈련합니다',
    icon: '🔧',
    difficulty: '중급',
    duration: '15-25분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'crystal-miner',
    name: 'Crystal Miner',
    category: '추론 및 문제해결',
    description: '전략적 사고와 계획 능력을 개발합니다',
    icon: '💎',
    difficulty: '고급',
    duration: '20-30분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'math-chaos',
    name: '수학적 혼돈',
    category: '추론 및 문제해결',
    description: '수리 추론과 계산 능력을 향상시킵니다',
    icon: '🔢',
    difficulty: '중급',
    duration: '15-20분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'reading-comprehension',
    name: '독해 이해',
    category: '추론 및 문제해결',
    description: '언어적 추론과 이해력을 훈련합니다',
    icon: '📖',
    difficulty: '중급',
    duration: '20-30분',
    color: 'mint',
    implemented: false
  },
  {
    id: 'brain-battle',
    name: '두뇌 전투',
    category: '추론 및 문제해결',
    description: '전략적 사고와 경쟁 능력을 개발합니다',
    icon: '⚔️',
    difficulty: '고급',
    duration: '15-25분',
    color: 'mint',
    implemented: false
  },

  // 집행기능 및 인지조절
  {
    id: 'robo-factory',
    name: 'Robo Factory',
    category: '집행기능 및 인지조절',
    description: '계획과 실행, 순서 조절 능력을 훈련합니다',
    icon: '🤖',
    difficulty: '중급',
    duration: '20-30분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'color-rush',
    name: '컬러러쉬',
    category: '집행기능 및 인지조절',
    description: '억제 통제와 반응 조절 능력을 향상시킵니다',
    icon: '🌈',
    difficulty: '초급',
    duration: '10-15분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'candy-line',
    name: '캔디 라인',
    category: '집행기능 및 인지조절',
    description: '전략적 계획과 조작 능력을 개발합니다',
    icon: '🍭',
    difficulty: '중급',
    duration: '15-25분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'penguin-explorer',
    name: '펭귄 탐험가',
    category: '집행기능 및 인지조절',
    description: '목표 지향적 행동과 계획 능력을 훈련합니다',
    icon: '🐧',
    difficulty: '초급',
    duration: '10-20분',
    color: 'lavender',
    implemented: false
  },
  {
    id: 'board-games',
    name: '보드 게임',
    category: '집행기능 및 인지조절',
    description: '전략적 사고와 의사결정 능력을 향상시킵니다',
    icon: '🎲',
    difficulty: '중급',
    duration: '20-40분',
    color: 'lavender',
    implemented: false
  }
]

const categories = [
  '전체',
  '시지각 및 공간 처리',
  '주의집중 및 선택적 주의',
  '기억력 및 작업기억',
  '추론 및 문제해결',
  '집행기능 및 인지조절'
]

const difficulties = ['전체', '초급', '중급', '고급']

export default function TrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체')
  const [searchTerm, setSearchTerm] = useState('')

  // 필터링된 게임 목록
  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === '전체' || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === '전체' || game.difficulty === selectedDifficulty
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mint':
        return 'bg-mint-50 border-mint-200 hover:border-mint-400'
      case 'lavender':
        return 'bg-lavender-50 border-lavender-200 hover:border-lavender-400'
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 hover:border-yellow-400'
      default:
        return 'bg-gray-50 border-gray-200 hover:border-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급':
        return 'bg-mint-100 text-mint-800'
      case '중급':
        return 'bg-lavender-100 text-lavender-800'
      case '고급':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-mint-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center space-x-3">
              <Image
                src="/images/link-it-logo-small.png"
                alt="Link IT 로고"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Link IT</h1>
                <p className="text-xs text-gray-500">인지훈련 게임</p>
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">
                홈
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-lavender-600 font-medium transition-colors flex items-center">
                  훈련
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/basic-training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-mint-50 hover:text-mint-600 transition-colors">
                      기초훈련
                    </Link>
                    <Link href="/training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lavender-50 hover:text-lavender-600 transition-colors">
                      인지훈련
                    </Link>
                    <Link href="/kiosk-training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                      키오스크훈련
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/program" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">
                프로그램
              </Link>
              <Link href="/evaluation" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
                평가
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">
                관리자
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">훈련 선택</h1>
            <p className="text-lg text-gray-600">전문가의 지도하에 진행하는 체계적 인지재활 프로그램</p>
          </div>

          {/* 필터 섹션 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              {/* 검색 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">게임 검색</label>
                <input
                  type="text"
                  placeholder="게임명 또는 설명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                />
              </div>

              {/* 카테고리 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">훈련 목표</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* 난이도 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              {/* 결과 수 */}
              <div className="flex items-end">
                <div className="w-full">
                  <p className="text-sm text-gray-600">검색 결과</p>
                  <p className="text-2xl font-bold text-mint-600">{filteredGames.length}개</p>
                </div>
              </div>
            </div>
          </div>

          {/* 구현된 게임 그리드 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              사용 가능한 게임
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${getColorClasses(game.color)}`}
                >
                  {/* 게임 아이콘과 제목 */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{game.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{game.name}</h3>
                      <p className="text-sm text-gray-600">{game.category}</p>
                    </div>
                  </div>

                  {/* 게임 설명 */}
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {game.description}
                  </p>

                  {/* 게임 정보 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                    <span className="text-sm text-gray-600">⏱️ {game.duration}</span>
                  </div>

                  {/* 시작 버튼 */}
                  <Link 
                    href={game.id === '3d-puzzle' ? '/training/3d-puzzle' : '#'}
                    className="w-full bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg block text-center"
                  >
                    게임 시작
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 개발 중인 게임 섹션 */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-yellow-500 mr-2">🚧</span>
              개발 중인 게임
              <span className="ml-3 text-sm font-normal text-gray-600 bg-yellow-100 px-3 py-1 rounded-full">
                {upcomingGames.length}개 예정
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingGames.slice(0, 8).map(game => (
                <div
                  key={game.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 opacity-75"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-xl opacity-50">{game.icon}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">{game.name}</h4>
                      <p className="text-xs text-gray-500">{game.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)} opacity-50`}>
                      {game.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">⏱️ {game.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                더 많은 게임이 곧 출시됩니다! 🎮
              </p>
            </div>
          </div>

          {/* 결과가 없을 때 */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 필터 조건을 시도해보세요</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}