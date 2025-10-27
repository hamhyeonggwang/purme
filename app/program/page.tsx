'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ProgramPage() {
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
                <p className="text-xs text-gray-500">훈련프로그램</p>
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
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                소개
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
              <span className="text-3xl font-light text-mint-600 block mb-2">Link IT</span>
              <span className="text-4xl font-bold text-gray-800">훈련프로그램</span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
              <span className="font-semibold text-gray-800">AI 기반</span> 개인화 프로그램과 함께하는 
              <span className="font-semibold text-mint-600"> 20회기 체계적 재활</span>을 통해 
              <span className="font-semibold text-lavender-600"> IADL 참여</span>를 목표로 하는 
              <span className="font-semibold text-yellow-600"> 전문가 주도 인지재활</span>
            </p>
          </div>

          {/* 프로그램 개요 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">AI 기반 프로그램 개요</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Link IT의 특별함</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">AI 기반 전문적 지도</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">AI 시스템</span>의 전문적 지도하에 
                          <span className="font-semibold text-gray-800"> 일상생활 활동</span> 참여를 목표로 하는 
                          <span className="font-semibold text-lavender-600">체계적 재활</span> 프로그램
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">👩‍⚕️</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문가 주도 개입</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">머신러닝</span>이 
                          <span className="font-semibold text-gray-800"> 전문적 평가와 개별화된 지도</span>를 통해 
                          <span className="font-semibold text-mint-600">체계적 재활</span>을 제공
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">📅</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문가 주도 20회기 커리큘럼</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-yellow-600">AI 시스템</span>의 전문적 지도하에 
                          <span className="font-semibold text-gray-800">단계별 재활</span>로 
                          <span className="font-semibold text-mint-600">체계적 능력 향상</span>을 도모
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">프로그램 구조</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">총 훈련 기간</p>
                        <p className="text-gray-700">20회기 (10주, 주 2회)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-bold text-gray-900">회기당 시간</p>
                        <p className="text-gray-700">45분 (인지훈련 30분 + 코칭 15분)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👥</span>
                      <div>
                        <p className="font-bold text-gray-900">참여 인원</p>
                        <p className="text-gray-700">개별 훈련 (1:1 AI 시스템)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-bold text-gray-900">최종 목표</p>
                        <p className="text-gray-700">IADL 독립적 참여</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 20회기 커리큘럼 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">20회기 훈련 커리큘럼</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1-5회기: 기초 인지 기능 */}
                <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1-5회기</h3>
                  <h4 className="text-lg font-semibold text-mint-600 mb-3">기초 인지 기능</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 주의집중 기초 훈련</li>
                    <li>• 단기 기억력 강화</li>
                    <li>• 시지각 기본 기능</li>
                    <li>• 반응 속도 향상</li>
                    <li>• <span className="font-semibold text-mint-600">목표</span>: 기본 인지 기능 안정화</li>
                  </ul>
                </div>

                {/* 6-10회기: 통합 인지 기능 */}
                <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">6-10회기</h3>
                  <h4 className="text-lg font-semibold text-lavender-600 mb-3">통합 인지 기능</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 복합 주의 과제</li>
                    <li>• 작업기억 통합</li>
                    <li>• 추론 및 문제해결</li>
                    <li>• 집행기능 훈련</li>
                    <li>• <span className="font-semibold text-lavender-600">목표</span>: 인지 기능 통합</li>
                  </ul>
                </div>

                {/* 11-15회기: IADL 준비 */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">11-15회기</h3>
                  <h4 className="text-lg font-semibold text-yellow-600 mb-3">IADL 준비</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 키오스크 시뮬레이션</li>
                    <li>• 금전 관리 훈련</li>
                    <li>• 교통수단 이용</li>
                    <li>• 쇼핑 및 결제</li>
                    <li>• <span className="font-semibold text-yellow-600">목표</span>: IADL 기능 습득</li>
                  </ul>
                </div>

                {/* 16-20회기: IADL 적용 */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">16-20회기</h3>
                  <h4 className="text-lg font-semibold text-gray-600 mb-3">IADL 적용</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 실제 환경 연습</li>
                    <li>• 독립적 수행</li>
                    <li>• 문제상황 대처</li>
                    <li>• 지속성 확보</li>
                    <li>• <span className="font-semibold text-gray-600">목표</span>: IADL 독립 참여</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 작업치료사 개입 방향 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">AI 기반 개입 방향</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">개입 목표</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">IADL 독립성 달성</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">일상생활 활동</span>에서 
                          <span className="font-semibold text-gray-800"> 독립적 참여</span>할 수 있도록 지원
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🧠</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">인지 기능 최적화</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">개별 맞춤형</span> 인지훈련으로 
                          <span className="font-semibold text-gray-800"> 최적의 인지 기능</span> 발달 지원
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🔄</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전이 및 일반화</h4>
                        <p className="text-gray-700 leading-relaxed">
                          훈련된 기능을 <span className="font-semibold text-yellow-600">실제 일상 환경</span>에서 
                          <span className="font-semibold text-gray-800"> 적용</span>할 수 있도록 지도
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">개입 원칙</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="font-bold text-gray-900">개별화 접근</p>
                        <p className="text-gray-700">아동의 특성과 요구에 맞는 맞춤형 개입</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎮</span>
                      <div>
                        <p className="font-bold text-gray-900">게임화 학습</p>
                        <p className="text-gray-700">흥미로운 게임을 통한 자연스러운 학습</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-bold text-gray-900">점진적 도전</p>
                        <p className="text-gray-700">능력에 맞는 단계적 난이도 조절</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <p className="font-bold text-gray-900">협력적 관계</p>
                        <p className="text-gray-700">아동과의 신뢰 관계 구축</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 구체적인 코칭 방법 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">구체적인 코칭 방법</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 사전 평가 및 계획 */}
                <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">사전 평가 및 계획</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 인지 기능 기초 평가</li>
                    <li>• IADL 수행 능력 측정</li>
                    <li>• 개별 목표 설정</li>
                    <li>• 훈련 계획 수립</li>
                    <li>• 가족 참여 계획</li>
                  </ul>
                </div>

                {/* 실시간 코칭 */}
                <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-lavender-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 코칭</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 게임 수행 중 즉시 피드백</li>
                    <li>• 전략적 접근법 안내</li>
                    <li>• 동기 부여 및 격려</li>
                    <li>• 어려움 해결 지원</li>
                    <li>• 성취감 경험 제공</li>
                  </ul>
                </div>

                {/* 전이 및 일반화 */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">전이 및 일반화</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 실제 환경 연습</li>
                    <li>• IADL 과제 적용</li>
                    <li>• 문제상황 대처 훈련</li>
                    <li>• 독립적 수행 연습</li>
                    <li>• 지속성 확보 방안</li>
                  </ul>
                </div>

                {/* 진행 모니터링 */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">진행 모니터링</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 회기별 성과 기록</li>
                    <li>• 인지 기능 변화 추적</li>
                    <li>• IADL 수행도 측정</li>
                    <li>• 목표 달성도 평가</li>
                    <li>• 계획 수정 및 조정</li>
                  </ul>
                </div>

                {/* 가족 참여 */}
                <div className="bg-gradient-to-br from-mint-50 to-lavender-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">가족 참여</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 가족 교육 및 상담</li>
                    <li>• 가정 연습 과제 제공</li>
                    <li>• 일상 적용 방법 안내</li>
                    <li>• 진전 상황 공유</li>
                    <li>• 지속적 지원 방안</li>
                  </ul>
                </div>

                {/* 최종 평가 */}
                <div className="bg-gradient-to-br from-lavender-50 to-yellow-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-lavender-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">최종 평가</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• IADL 독립성 평가</li>
                    <li>• 인지 기능 향상 측정</li>
                    <li>• 목표 달성도 확인</li>
                    <li>• 향후 계획 수립</li>
                    <li>• 성과 보고서 작성</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* IADL 참여 목표 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">IADL 참여 최종 목표</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">IADL 영역별 목표</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🛒</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">쇼핑 및 금전 관리</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">독립적 쇼핑</span>, 
                          <span className="font-semibold text-gray-800"> 금전 계산</span>, 
                          <span className="font-semibold text-mint-600"> 결제 처리</span> 능력 향상
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🚌</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">교통수단 이용</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">대중교통 이용</span>, 
                          <span className="font-semibold text-gray-800"> 교통카드 사용</span>, 
                          <span className="font-semibold text-lavender-600"> 경로 계획</span> 능력 향상
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🏥</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">의료 서비스 이용</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-yellow-600">병원 예약</span>, 
                          <span className="font-semibold text-gray-800"> 진료 접수</span>, 
                          <span className="font-semibold text-yellow-600"> 처방전 관리</span> 능력 향상
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">성공 지표</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-bold text-gray-900">독립적 수행</p>
                        <p className="text-gray-700">IADL 과제를 도움 없이 수행</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-bold text-gray-900">정확성 향상</p>
                        <p className="text-gray-700">과제 수행의 정확도 90% 이상</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-bold text-gray-900">효율성 증대</p>
                        <p className="text-gray-700">적절한 시간 내 과제 완료</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="font-bold text-gray-900">지속성 확보</p>
                        <p className="text-gray-700">일상생활에서 지속적 활용</p>
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
                Link IT 훈련프로그램 시작하기
              </h2>
              <p className="text-xl text-mint-100 mb-8 font-light leading-relaxed">
                <span className="font-semibold text-white">20회기 체계적 훈련</span>으로 
                <span className="font-semibold text-yellow-200"> IADL 참여</span>를 목표로 하는 
                <span className="font-semibold text-white"> AI 중심</span>의 
                <span className="font-semibold text-yellow-200"> 맞춤형 인지재활</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/training"
                  className="bg-white text-mint-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
                >
                  훈련 시작하기
                </Link>
                <Link 
                  href="/about"
                  className="border-2 border-white text-white hover:bg-white hover:text-mint-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  프로그램 자세히 보기
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
                  <li>20회기 훈련</li>
                  <li>IADL 참여</li>
                  <li>AI 시스템 개입</li>
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
