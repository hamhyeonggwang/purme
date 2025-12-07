'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function VisualPerceptionTrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체')

  // 기초 시지각 훈련 데이터
  const basicTrainings = [
    // 시각적 차별화
    {
      id: 'color-matching',
      name: '색깔 맞추기',
      category: '시각적 차별화',
      description: '기본 색상을 인식하고 구분하는 능력을 훈련합니다',
      icon: '🎨',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['색상 인식', '시각적 구분', '기본 지각']
    },
    {
      id: 'shape-recognition',
      name: '모양 찾기',
      category: '시각적 차별화',
      description: '기본 도형을 인식하고 구분하는 능력을 개발합니다',
      icon: '🔺',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['도형 인식', '시각적 구분', '기본 지각']
    },
    {
      id: 'size-comparison',
      name: '크기 비교',
      category: '시각적 차별화',
      description: '크고 작음을 구분하는 기본 능력을 훈련합니다',
      icon: '📏',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['크기 구분', '비교 능력', '기본 지각']
    },

    // 시각적 주의
    {
      id: 'visual-tracking',
      name: '시선 추적',
      category: '시각적 주의',
      description: '움직이는 물체를 눈으로 따라가는 능력을 훈련합니다',
      icon: '👁️',
      difficulty: '초급',
      duration: '5-10분',
      color: 'lavender',
      skills: ['시선 추적', '주의 집중', '기본 주의']
    },
    {
      id: 'focus-training',
      name: '집중 훈련',
      category: '시각적 주의',
      description: '특정 물체에 집중하는 기본 능력을 개발합니다',
      icon: '🎯',
      difficulty: '초급',
      duration: '5-10분',
      color: 'lavender',
      skills: ['집중력', '주의 지속', '기본 주의']
    },
    {
      id: 'visual-search',
      name: '찾기 게임',
      category: '시각적 주의',
      description: '숨겨진 물체를 찾는 탐색 능력을 훈련합니다',
      icon: '🔍',
      difficulty: '초급',
      duration: '5-10분',
      color: 'lavender',
      skills: ['시각적 탐색', '주의 분산', '기본 주의']
    },

    // 반응 속도 및 인지 처리
    {
      id: 'reaction-speed',
      name: '반응 속도 훈련',
      category: '반응 속도 및 인지 처리',
      description: '시각적 자극에 대한 빠른 반응 능력을 측정하고 훈련합니다',
      icon: '🐭',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['반응 속도', '주의 집중', '인지 처리']
    },
    {
      id: 'pattern-recognition',
      name: '색상 구분',
      category: '반응 속도 및 인지 처리',
      description: '제시된 색상을 기억하고 같은 색상을 찾는 색상 인식 게임',
      icon: '🎨',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['색상 인식', '기억력', '시각적 구분']
    },
    {
      id: 'spatial-relationship',
      name: '공간관계 인식',
      category: '반응 속도 및 인지 처리',
      description: '공간에서의 위치 관계를 인식하고 기억하는 능력을 훈련합니다',
      icon: '🔲',
      difficulty: '초급',
      duration: '5-10분',
      color: 'mint',
      skills: ['공간 기억', '위치 인식', '시각적 처리']
    },

  ]

  const categories = [
    '전체',
    '시각적 차별화',
    '시각적 주의',
    '반응 속도 및 인지 처리'
  ]

  const difficulties = ['전체', '초급']

  // 필터링된 훈련 목록
  const filteredTrainings = basicTrainings.filter(training => {
    const matchesCategory = selectedCategory === '전체' || training.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === '전체' || training.difficulty === selectedDifficulty
    
    return matchesCategory && matchesDifficulty
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
                <p className="text-xs text-gray-500">시지각 훈련</p>
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
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">시지각 훈련</h1>
          </div>

          {/* 필터 섹션 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {/* 카테고리 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">훈련 영역</label>
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
                  <p className="text-sm text-gray-600">훈련 프로그램</p>
                  <p className="text-2xl font-bold text-mint-600">{filteredTrainings.length}개</p>
                </div>
              </div>
            </div>
          </div>

          {/* 훈련 프로그램 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map(training => (
              <div
                key={training.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${getColorClasses(training.color)}`}
              >
                {/* 훈련 아이콘과 제목 */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{training.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{training.name}</h3>
                    <p className="text-sm text-gray-600">{training.category}</p>
                  </div>
                </div>

                {/* 훈련 설명 */}
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {training.description}
                </p>

                {/* 훈련 정보 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-mint-100 text-mint-800">
                    {training.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">⏱️ {training.duration}</span>
                </div>

                {/* 훈련 스킬 */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">훈련 스킬:</p>
                  <div className="flex flex-wrap gap-1">
                    {training.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 시작 버튼 */}
                <Link href={`/basic-training/${training.id}`}>
                  <button className="w-full bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg">
                    훈련 시작
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* 결과가 없을 때 */}
          {filteredTrainings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 필터 조건을 시도해보세요</p>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-mint-800 to-lavender-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/images/link-it-logo-small.png"
                    alt="Link IT 로고"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <h3 className="text-xl font-bold">Link IT</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  전산화 인지재활로 세상과 연결되다
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">시지각 훈련</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>시각적 차별화</li>
                  <li>시각적 주의</li>
                  <li>반응 속도 및 인지 처리</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">지원</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>도움말</li>
                  <li>문의하기</li>
                  <li>FAQ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">연구 및 개발</h4>
                <p className="text-sm text-gray-400">
                  푸르메재단 넥슨어린이재활병원<br />
                  학령기치료팀
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 Link IT. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}