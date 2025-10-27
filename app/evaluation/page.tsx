'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function EvaluationPage() {
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
                <p className="text-xs text-gray-500">표준화 평가</p>
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
              <Link href="/program" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
                프로그램
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                소개
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
              <span className="text-4xl font-bold text-gray-800">전문 평가 시스템</span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
              <span className="font-semibold text-gray-800">AI 기반</span> 전문적 평가를 통해 
              <span className="font-semibold text-mint-600"> IADL 참여</span>를 목표로 하는 
              <span className="font-semibold text-lavender-600"> 20회기 재활프로그램</span>의 
              <span className="font-semibold text-yellow-600"> 체계적 성과 측정</span>
            </p>
          </div>

          {/* 평가 체계 개요 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">AI 기반 평가 체계</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">평가 원칙</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문가 평가</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-mint-600">AI 시스템</span>의 전문적 평가를 통한 
                          <span className="font-semibold text-gray-800"> 정확한 성과</span> 측정
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문적 해석</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-lavender-600">머신러닝</span>의 전문적 해석을 통해 
                          <span className="font-semibold text-gray-800"> IADL 참여</span>를 목표로 하는 
                          <span className="font-semibold text-mint-600">실용적 평가</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">전문가 주도 추적</h4>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-yellow-600">실시간 모니터링</span>이 
                          <span className="font-semibold text-gray-800"> 단계별 변화</span>를 
                          <span className="font-semibold text-mint-600"> 전문적으로 추적</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">작업치료사 주도 평가 시점</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚀</span>
                      <div>
                        <p className="font-bold text-gray-900">작업치료사 사전 평가 (0회기)</p>
                        <p className="text-gray-700">전문가의 기초 능력 평가 및 개별화된 목표 설정</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">작업치료사 중간 평가 (10회기)</p>
                        <p className="text-gray-700">전문가의 진행 상황 평가 및 목표 조정</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="font-bold text-gray-900">작업치료사 사후 평가 (20회기)</p>
                        <p className="text-gray-700">전문가의 최종 성과 평가 및 목표 달성도</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="font-bold text-gray-900">작업치료사 추적 평가 (3개월 후)</p>
                        <p className="text-gray-700">전문가의 지속성 및 일반화 효과 평가</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 인지 기능 평가 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">인지 기능 평가</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 주의집중 평가 */}
                <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">주의집중 평가</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">선택적 주의</h4>
                      <p className="text-sm text-gray-700">• 정확도: 90% 이상</p>
                      <p className="text-sm text-gray-700">• 반응시간: 500ms 이하</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">지속적 주의</h4>
                      <p className="text-sm text-gray-700">• 집중 지속시간: 15분 이상</p>
                      <p className="text-sm text-gray-700">• 오류율: 5% 이하</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">분할 주의</h4>
                      <p className="text-sm text-gray-700">• 동시 과제 수행: 80% 이상</p>
                      <p className="text-sm text-gray-700">• 전환 능력: 3초 이내</p>
                    </div>
                  </div>
                </div>

                {/* 기억력 평가 */}
                <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-lavender-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">기억력 평가</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">단기 기억</h4>
                      <p className="text-sm text-gray-700">• 숫자 순서: 7자리 이상</p>
                      <p className="text-sm text-gray-700">• 단어 회상: 10개 이상</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">작업기억</h4>
                      <p className="text-sm text-gray-700">• 2-back 과제: 80% 이상</p>
                      <p className="text-sm text-gray-700">• 시공간 기억: 5개 이상</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">장기 기억</h4>
                      <p className="text-sm text-gray-700">• 지연 회상: 80% 이상</p>
                      <p className="text-sm text-gray-700">• 인식 정확도: 90% 이상</p>
                    </div>
                  </div>
                </div>

                {/* 추론 및 문제해결 평가 */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔧</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">추론 및 문제해결</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">논리적 추론</h4>
                      <p className="text-sm text-gray-700">• 패턴 인식: 85% 이상</p>
                      <p className="text-sm text-gray-700">• 규칙 발견: 80% 이상</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">문제해결</h4>
                      <p className="text-sm text-gray-700">• 전략 수립: 3단계 이상</p>
                      <p className="text-sm text-gray-700">• 해결 시간: 5분 이내</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">유연성</h4>
                      <p className="text-sm text-gray-700">• 전략 전환: 2회 이상</p>
                      <p className="text-sm text-gray-700">• 적응 능력: 75% 이상</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* IADL 수행 평가 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">IADL 수행 평가</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">IADL 영역별 평가</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🛒</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">쇼핑 및 금전 관리</h4>
                        <div className="text-gray-700 space-y-1">
                          <p>• <span className="font-semibold">독립성</span>: 도움 없이 수행 (100%)</p>
                          <p>• <span className="font-semibold">정확성</span>: 계산 오류 5% 이하</p>
                          <p>• <span className="font-semibold">효율성</span>: 30분 이내 완료</p>
                          <p>• <span className="font-semibold">안전성</span>: 금전 관리 실수 없음</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🚌</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">교통수단 이용</h4>
                        <div className="text-gray-700 space-y-1">
                          <p>• <span className="font-semibold">독립성</span>: 혼자서 이용 (100%)</p>
                          <p>• <span className="font-semibold">정확성</span>: 경로 선택 오류 없음</p>
                          <p>• <span className="font-semibold">효율성</span>: 적절한 시간 내 도착</p>
                          <p>• <span className="font-semibold">안전성</span>: 교통 규칙 준수</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">🏥</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">의료 서비스 이용</h4>
                        <div className="text-gray-700 space-y-1">
                          <p>• <span className="font-semibold">독립성</span>: 예약 및 접수 (100%)</p>
                          <p>• <span className="font-semibold">정확성</span>: 정보 전달 오류 없음</p>
                          <p>• <span className="font-semibold">효율성</span>: 적절한 절차 수행</p>
                          <p>• <span className="font-semibold">안전성</span>: 의료 정보 이해</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">평가 도구</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p className="font-bold text-gray-900">COPM (Canadian Occupational Performance Measure)</p>
                        <p className="text-gray-700">IADL 수행 만족도 평가</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-bold text-gray-900">GAS (Goal Attainment Scaling)</p>
                        <p className="text-gray-700">개별 목표 달성도 측정</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">Link IT IADL 체크리스트</p>
                        <p className="text-gray-700">프로그램 전용 평가 도구</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-bold text-gray-900">수행 시간 측정</p>
                        <p className="text-gray-700">효율성 및 독립성 평가</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 평가 기준 및 점수 체계 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">평가 기준 및 점수 체계</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* 점수 체계 */}
                <div className="bg-gradient-to-br from-mint-50 to-mint-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">점수 체계</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="font-semibold">5점 (우수)</span>
                      <span className="text-mint-600 font-bold">90-100%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="font-semibold">4점 (양호)</span>
                      <span className="text-lavender-600 font-bold">80-89%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="font-semibold">3점 (보통)</span>
                      <span className="text-yellow-600 font-bold">70-79%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="font-semibold">2점 (미흡)</span>
                      <span className="text-orange-600 font-bold">60-69%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="font-semibold">1점 (부족)</span>
                      <span className="text-red-600 font-bold">60% 미만</span>
                    </div>
                  </div>
                </div>

                {/* 통합 평가 기준 */}
                <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">통합 평가 기준</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">인지 기능 (40%)</h4>
                      <p className="text-sm text-gray-700">주의집중, 기억력, 추론능력 종합 점수</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">IADL 수행 (40%)</h4>
                      <p className="text-sm text-gray-700">실제 일상생활 활동 수행 능력</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">독립성 (20%)</h4>
                      <p className="text-sm text-gray-700">도움 없이 수행하는 정도</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 성과 보고서 템플릿 섹션 */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">성과 보고서 템플릿</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">보고서 구성</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">참여자 정보</h4>
                        <p className="text-sm text-gray-700">개인정보, 훈련 전 상태, 목표 설정</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">인지 기능 변화</h4>
                        <p className="text-sm text-gray-700">사전-사후 비교, 영역별 향상도</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">IADL 수행 변화</h4>
                        <p className="text-sm text-gray-700">실제 수행 능력 향상, 독립성 증대</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">목표 달성도</h4>
                        <p className="text-sm text-gray-700">GAS 점수, 개별 목표 달성 여부</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">5</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">향후 계획</h4>
                        <p className="text-sm text-gray-700">추가 훈련, 유지 방안, 가족 지원</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-mint-100 to-lavender-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">평가 결과 해석</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-bold text-gray-900">유의미한 향상</p>
                        <p className="text-gray-700">20% 이상 향상, 목표 달성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-bold text-gray-900">부분적 향상</p>
                        <p className="text-gray-700">10-19% 향상, 일부 목표 달성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="font-bold text-gray-900">유지</p>
                        <p className="text-gray-700">5-9% 향상, 유지 상태</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="font-bold text-gray-900">재평가 필요</p>
                        <p className="text-gray-700">5% 미만 향상, 접근법 재검토</p>
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
                표준화된 평가로 객관적 성과 측정
              </h2>
              <p className="text-xl text-mint-100 mb-8 font-light leading-relaxed">
                <span className="font-semibold text-white">Link IT 훈련프로그램</span>의 
                <span className="font-semibold text-yellow-200"> 표준화된 평가</span>를 통해 
                <span className="font-semibold text-white"> 객관적 성과</span>를 측정하고 
                <span className="font-semibold text-yellow-200"> IADL 참여</span> 목표 달성을 확인하세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/program"
                  className="bg-white text-mint-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
                >
                  프로그램 자세히 보기
                </Link>
                <Link 
                  href="/admin"
                  className="border-2 border-white text-white hover:bg-white hover:text-mint-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  관리자 페이지
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
                <h4 className="font-bold mb-4">평가</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>인지 기능 평가</li>
                  <li>IADL 수행 평가</li>
                  <li>표준화 기준</li>
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
