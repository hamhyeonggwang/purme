'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-yellow-50">
      {/* 헤더 - CogniFit 스타일 */}
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
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">
                기능
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
                      시지각 훈련
                    </Link>
                    <Link href="/training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lavender-50 hover:text-lavender-600 transition-colors">
                      인지 학습 훈련
                    </Link>
                    <Link href="/kiosk-training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                      키오스크훈련
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                소개
              </Link>
            </nav>

            {/* 게스트 모드 표시 */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-mint-100 px-3 py-1 rounded-full">
                🎮 게스트 모드
              </div>
              <Link
                href="/basic-training"
                className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="bg-gradient-to-br from-mint-100 via-white to-lavender-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* 텍스트 콘텐츠 */}
              <div>
                <div className="mb-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* 그림자 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-mint-200/30 via-lavender-200/30 to-yellow-200/30 rounded-full blur-xl scale-110"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-mint-100/20 via-lavender-100/20 to-yellow-100/20 rounded-full blur-lg scale-105"></div>
                      
                      {/* 로고 이미지 */}
                      <div className="relative z-10">
                        <Image
                          src="/images/link-it-logo-main.png"
                          alt="Link IT 로고"
                          width={800}
                          height={800}
                          className="w-64 h-64 lg:w-80 lg:h-80 drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl text-gray-700 mb-10 leading-relaxed font-light">
                  과학적 근거 기반 <span className="font-semibold text-gray-900">디지털 인지재활</span> 플랫폼
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8 border-l-4 border-blue-500">
                  <p className="text-lg text-gray-800 font-medium">
                    <span className="text-2xl font-bold text-blue-600">AI 기반</span> • 
                    <span className="text-2xl font-bold text-purple-600"> 개인화</span> • 
                    <span className="text-2xl font-bold text-green-600"> 실시간</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">데이터 기반 맞춤형 인지재활 솔루션</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/basic-training" className="bg-gradient-to-r from-mint-500 to-lavender-500 hover:from-mint-600 hover:to-lavender-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg text-center">
                    시작하기
                  </Link>
                  <Link href="/training" className="border-2 border-mint-500 text-mint-600 hover:bg-mint-500 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors text-center">
                    평가하기
                  </Link>
                </div>
              </div>

              {/* 스마트폰 모형 - CogniFit 스타일 */}
              <div className="relative flex justify-center items-center">
                {/* 스마트폰 외곽 */}
                <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  {/* 스마트폰 화면 */}
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* 상태바 */}
                    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center text-sm">
                      <span className="font-bold">Link IT</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* 앱 메인 화면 */}
                    <div className="p-6 h-full bg-gradient-to-br from-mint-50 to-lavender-50">
                      {/* 환영 메시지 */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Image
                            src="/images/link-it-logo-small.png"
                            alt="Link IT 로고"
                            width={64}
                            height={64}
                            className="w-16 h-16"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">안녕하세요!</h3>
                        <p className="text-sm text-gray-600">개인화된 디지털 인지재활을 시작해보세요</p>
                      </div>
                      
                      {/* 훈련 카드들 */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-mint-500">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-mint-100 rounded-lg flex items-center justify-center">
                              <span className="text-mint-600 text-lg">👁️</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">시지각 훈련</h4>
                              <p className="text-xs text-gray-500">도형 찾기</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-lavender-500">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-lavender-100 rounded-lg flex items-center justify-center">
                              <span className="text-lavender-600 text-lg">🧠</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">인지 학습</h4>
                              <p className="text-xs text-gray-500">기억력 게임</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-yellow-600 text-lg">🖥️</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">키오스크 훈련</h4>
                              <p className="text-xs text-gray-500">무인결제 연습</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 진행률 표시 */}
                      <div className="mt-6 bg-white rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-800">오늘의 목표</span>
                          <span className="text-sm text-gray-500">3/5 완료</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-mint-500 to-lavender-500 h-2 rounded-full w-3/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section id="features" className="py-20 bg-gradient-to-br from-white to-mint-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
                <span className="text-3xl font-light text-mint-600 block mb-2">Link IT의</span>
                <span className="text-4xl font-bold text-gray-800">핵심 기능</span>
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
                <span className="font-semibold text-gray-800">AI 기반</span> 
                <span className="font-semibold text-mint-600"> 개인화 인지재활</span> 플랫폼
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 시지각 훈련 */}
              <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">👁️</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">시지각 훈련</h3>
                <p className="text-gray-700 mb-6 font-light leading-relaxed">
                  <span className="font-semibold text-gray-800">AI 기반</span> 개인화 알고리즘으로 
                  <span className="font-semibold text-mint-600"> 시각적 도형 찾기</span>, 
                  <span className="font-semibold text-lavender-600"> 공간 지각</span> 등 
                  다양한 시지각 기능을 체계적으로 훈련합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 지각 및 시각적 도형 찾기</li>
                  <li>• 공간 지각 및 방향 변별</li>
                  <li>• 시각 기억 및 순서 기억</li>
                </ul>
              </div>

              {/* 인지 학습 */}
              <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-lavender-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🧠</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">인지 학습</h3>
                <p className="text-gray-700 mb-6 font-light leading-relaxed">
                  <span className="font-semibold text-gray-800">머신러닝</span> 기반 적응형 시스템으로 
                  <span className="font-semibold text-lavender-600"> 주의집중</span>, 
                  <span className="font-semibold text-yellow-600"> 작업기억</span>, 
                  <span className="font-semibold text-mint-600"> 문제해결</span> 등 
                  핵심 인지 기능을 체계적으로 훈련합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 선택적 주의 및 집중력</li>
                  <li>• 작업 기억 및 순서 조절</li>
                  <li>• 문제 해결 및 추론</li>
                </ul>
              </div>

              {/* 키오스크 응용 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🖥️</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">키오스크 응용</h3>
                <p className="text-gray-700 mb-6 font-light leading-relaxed">
                  <span className="font-semibold text-gray-800">실제 환경</span> 시뮬레이션과 함께 
                  <span className="font-semibold text-yellow-600"> 키오스크 인터페이스</span>에서 
                  훈련하여 <span className="font-semibold text-mint-600">디지털 일상 참여 능력</span>을 향상시킵니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 무인결제 시스템 시뮬레이션</li>
                  <li>• 도서관 키오스크 훈련</li>
                  <li>• 교통카드 사용 훈련</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 대상 및 효과 섹션 */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tight">
                  <span className="text-3xl font-light text-lavender-600 block mb-2">대상 및</span>
                  <span className="text-4xl font-bold text-gray-800">기대 효과</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">대상</h3>
                      <p className="text-gray-700 font-light leading-relaxed">
                        <span className="font-semibold text-mint-600">7-15세 학령기 아동</span>, 
                        <span className="font-semibold text-gray-800"> 인지·시지각 기능 향상</span>이 필요한 아동
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">임상 효과</h3>
                      <p className="text-gray-700 font-light leading-relaxed">
                        <span className="font-semibold text-lavender-600">인지 기능 향상</span> 및 
                        <span className="font-semibold text-gray-800"> 학습 참여 증진</span>, 
                        <span className="font-semibold text-mint-600"> 디지털 리터러시</span> 향상
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">사회적 효과</h3>
                      <p className="text-gray-700 font-light leading-relaxed">
                        <span className="font-semibold text-yellow-600">학습 및 사회 적응</span> 향상, 
                        <span className="font-semibold text-gray-800"> 실시간 데이터 분석</span> 및 
                        <span className="font-semibold text-mint-600"> 개인화 추천</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">과학적 근거</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Barker & Mundy, 2021</p>
                    <p className="text-gray-800">전산화 인지훈련은 주의집중, 기억, 집행기능 향상에 유의미한 효과</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Kim & Park, 2020</p>
                    <p className="text-gray-800">시지각 처리 및 시공간 인지 향상은 학습 참여 및 일상 적응에 직결</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Cho et al., 2023</p>
                    <p className="text-gray-800">전산화 인지훈련 후 주의력·기억력 향상 및 일상 참여 증진</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-mint-500 to-lavender-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black text-white mb-8 tracking-tight">
              <span className="text-3xl font-light text-mint-100 block mb-2">지금 바로</span>
              <span className="text-4xl font-bold text-white">시작하세요</span>
            </h2>
                <p className="text-2xl text-mint-100 mb-10 font-light leading-relaxed">
              <span className="font-semibold text-white">Link IT</span>로 
              <span className="font-semibold text-yellow-200"> 디지털 인지재활</span>의 
              혁신을 경험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/basic-training" className="bg-white text-mint-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg text-center">
                시작하기
              </Link>
              <Link href="/training" className="border-2 border-white text-white hover:bg-white hover:text-mint-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors text-center">
                상담 문의
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-mint-800 to-lavender-800 text-white py-12">
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
                  AI 기반 디지털 인지재활 플랫폼
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
                <h4 className="font-bold mb-4">연락처</h4>
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