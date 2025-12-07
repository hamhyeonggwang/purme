'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
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
                <p className="text-xs text-gray-500">인지재활 플랫폼</p>
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
        <div className="max-w-6xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              <span className="text-3xl font-light text-mint-600 block mb-2">AI 기반</span>
              <span className="text-4xl font-bold text-gray-800">디지털 인지재활</span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
              <span className="font-semibold text-gray-800">과학적 근거</span> 기반의 
              <span className="font-semibold text-mint-600"> 개인화된 인지재활</span>을 통해 
              <span className="font-semibold text-lavender-600"> 학령기 아동</span>이 
              <span className="font-semibold text-yellow-600"> 디지털 사회에 성공적으로 적응</span>할 수 있도록 돕습니다
            </p>
          </div>

          {/* 인지훈련의 필요성 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">AI 기반 개인화 인지재활</h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">인지 기능의 중요성</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🧠</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">AI 기반 개인화 평가</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">머신러닝</span> 알고리즘이 
                          <span className="font-semibold text-lavender-600"> 주의집중, 기억력, 추론능력</span>을 
                          정확히 분석하여 개별화된 재활 계획을 수립합니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">📚</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">체계적 재활 프로그램</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">AI 시스템</span>이 
                          <span className="font-semibold text-mint-600"> 개별 아동의 발달 수준</span>에 맞춘 
                          <span className="font-semibold text-gray-800">체계적 재활 프로그램</span>을 제공합니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🤝</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문가와의 협력</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-yellow-600">실시간 모니터링</span>과 함께 
                          <span className="font-semibold text-mint-600"> 개별화된 훈련</span>을 통해 
                          <span className="font-semibold text-gray-800">성인기 전환</span>을 위한 실용적 능력을 구축합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">AI 기반 전문성</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎯</span>
                      <p className="text-gray-800 font-medium">
                        AI 시스템은 인지재활 전문 알고리즘으로 개별 아동의 발달 수준을 정확히 분석합니다
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧠</span>
                      <p className="text-gray-800 font-medium">
                        전문적 지도하에 체계적인 인지재활을 통해 성인기 전환을 위한 실용적 능력을 구축합니다
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📈</span>
                      <p className="text-gray-800 font-medium">
                        개인별 맞춤형 훈련으로 성인기 전환에 필요한 인지 기능을 강화합니다
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Link IT가 다루는 영역 섹션 */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-6">성인기 준비를 위한 인지 영역</h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                <span className="font-semibold text-gray-800">6가지 핵심 인지 영역</span>을 통해 
                <span className="font-semibold text-mint-600"> 성인기 전환</span>에 필요한 
                <span className="font-semibold text-lavender-600"> 종합적 능력</span>을 개발합니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 시지각 및 공간 처리 */}
              <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">👁️</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">시지각 및 공간 처리</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-mint-600">시각적 정보 처리</span>와 
                  <span className="font-semibold text-gray-800"> 공간 인지 능력</span>으로 
                  성인기의 <span className="font-semibold text-mint-600">직업적 성공</span>을 준비합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 시각적 도형 찾기</li>
                  <li>• 공간 방향 변별</li>
                  <li>• 3D 퍼즐 해결</li>
                  <li>• 시각-운동 협응</li>
                </ul>
              </div>

              {/* 주의집중 및 선택적 주의 */}
              <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-lavender-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">주의집중 및 선택적 주의</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-lavender-600">집중력과 주의 분산</span>을 통해 
                  성인기의 <span className="font-semibold text-gray-800">업무 효율성</span>을 향상시킵니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 선택적 주의 과제</li>
                  <li>• 지속적 주의 훈련</li>
                  <li>• 분할 주의 능력</li>
                  <li>• 반응 억제 훈련</li>
                </ul>
              </div>

              {/* 기억력 및 작업기억 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🧠</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">기억력 및 작업기억</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-yellow-600">단기 및 작업기억</span>을 통해 
                  성인기의 <span className="font-semibold text-gray-800">훈련능력</span>과 
                  <span className="font-semibold text-yellow-600">정보 처리</span>를 강화합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 짝 맞추기 게임</li>
                  <li>• 순서 기억 훈련</li>
                  <li>• 어휘 기억 강화</li>
                  <li>• 시퀀스 기억</li>
                </ul>
              </div>

              {/* 추론 및 문제해결 */}
              <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🔧</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">추론 및 문제해결</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-mint-600">논리적 사고</span>와 
                  <span className="font-semibold text-gray-800"> 문제해결 전략</span>으로 
                  성인기의 <span className="font-semibold text-mint-600">직업적 역량</span>을 개발합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 파이프 연결 퍼즐</li>
                  <li>• 수학적 추론</li>
                  <li>• 전략 게임</li>
                  <li>• 논리적 연결</li>
                </ul>
              </div>

              {/* 집행기능 및 인지조절 */}
              <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-lavender-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">⚙️</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">집행기능 및 인지조절</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-lavender-600">계획과 실행</span>, 
                  <span className="font-semibold text-gray-800"> 인지 조절 능력</span>으로 
                  성인기의 <span className="font-semibold text-lavender-600">자립적 생활</span>을 준비합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 계획 수립 훈련</li>
                  <li>• 목표 지향 행동</li>
                  <li>• 인지 유연성</li>
                  <li>• 자기 조절</li>
                </ul>
              </div>

              {/* 키오스크 응용 훈련 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🖥️</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">키오스크 응용 훈련</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <span className="font-semibold text-yellow-600">실제 일상 환경</span>에서 
                  성인기의 <span className="font-semibold text-gray-800">디지털 사회 적응</span>을 준비합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 무인결제 시뮬레이션</li>
                  <li>• 도서관 키오스크</li>
                  <li>• 교통카드 사용</li>
                  <li>• 일상 참여 연습</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 훈련 효과 및 기대결과 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">성인기 전환을 위한 훈련 효과</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">성인기 준비 효과</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">성인기 자립 능력 향상</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">주의집중, 기억력, 추론능력</span>이 
                          향상되어 성인기의 <span className="font-semibold text-gray-800">독립적 생활</span>을 위한 기초가 마련됩니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🎓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">고등교육 준비</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">집중력과 훈련능력</span>이 향상되어 
                          대학 진학과 <span className="font-semibold text-gray-800">전문 분야 학습</span>을 위한 
                          기초가 마련됩니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🤝</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">직업적 성공 기반</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-yellow-600">문제해결 능력</span>과 
                          <span className="font-semibold text-gray-800"> 팀워크 능력</span>이 향상되어 
                          성인기의 <span className="font-semibold text-yellow-600">직업적 성공</span>을 위한 기초가 마련됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">성인기 전환을 위한 훈련</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-bold text-gray-900">훈련 시간</p>
                        <p className="text-gray-700">회당 10-15분, 주 2-3회 (성인기 전환을 위한 체계적 훈련)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-bold text-gray-900">훈련 주기</p>
                        <p className="text-gray-700">연속되지 않는 날에 훈련 (지속적인 성인기 준비)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-bold text-gray-900">훈련 구성</p>
                        <p className="text-gray-700">2개 게임 + 1개 평가 과제 (성인기 전환 능력 측정)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">진행 추적</p>
                        <p className="text-gray-700">자동 난이도 조절 및 성인기 전환 준비도 모니터링</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA 섹션 */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-mint-500 to-lavender-500 rounded-2xl p-12 shadow-lg">
              <h2 className="text-4xl font-black text-white mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-mint-100 mb-8 font-light leading-relaxed">
                <span className="font-semibold text-white">Link IT</span>로 
                <span className="font-semibold text-yellow-200"> 성인기 전환을 위한 인지훈련</span>을 
                시작해보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/training"
                  className="bg-white text-mint-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
                >
                  훈련 시작하기
                </Link>
                <Link 
                  href="/"
                  className="border-2 border-white text-white hover:bg-white hover:text-mint-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </section>
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
                <h4 className="font-bold mb-4">프로그램</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>시지각 훈련</li>
                  <li>인지 학습</li>
                  <li>키오스크 응용</li>
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
