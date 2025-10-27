import Image from 'next/image'

export default function AdminPage() {
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
                <p className="text-xs text-gray-500">관리자 콘솔</p>
              </div>
            </div>

            {/* 사용자 정보 */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">푸르메재단</p>
              </div>
              <button className="bg-mint-500 hover:bg-mint-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">관리자 대시보드</h1>
            <p className="text-lg text-gray-600">Link IT 프로그램 운영 현황 및 관리</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* 총 사용자 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-mint-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 사용자</p>
                  <p className="text-3xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-mint-600">+12% 이번 달</p>
                </div>
                <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                  <span className="text-mint-600 text-xl">👥</span>
                </div>
              </div>
            </div>

            {/* 활성 세션 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-lavender-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">활성 세션</p>
                  <p className="text-3xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-lavender-600">현재 온라인</p>
                </div>
                <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-lavender-600 text-xl">🟢</span>
                </div>
              </div>
            </div>

            {/* 완료된 훈련 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">완료된 훈련</p>
                  <p className="text-3xl font-bold text-gray-900">3,456</p>
                  <p className="text-sm text-yellow-600">이번 주</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">✅</span>
                </div>
              </div>
            </div>

            {/* 평균 점수 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-mint-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">평균 점수</p>
                  <p className="text-3xl font-bold text-gray-900">87.3</p>
                  <p className="text-sm text-mint-600">+5.2% 향상</p>
                </div>
                <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                  <span className="text-mint-600 text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 그리드 */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 사용자 관리 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
                  <button className="bg-mint-500 hover:bg-mint-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    새 사용자 추가
                  </button>
                </div>
                
                {/* 사용자 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">이름</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">나이</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">진행률</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">상태</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center">
                              <span className="text-mint-600 text-sm font-bold">김</span>
                            </div>
                            <span className="font-medium text-gray-900">김민수</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">8세</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-mint-500 h-2 rounded-full w-4/5"></div>
                            </div>
                            <span className="text-sm text-gray-600">80%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-lavender-100 text-lavender-800 px-2 py-1 rounded-full text-xs font-medium">
                            활성
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-mint-600 hover:text-mint-700 text-sm font-medium">
                            상세보기
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                              <span className="text-lavender-600 text-sm font-bold">이</span>
                            </div>
                            <span className="font-medium text-gray-900">이지은</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">10세</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-lavender-500 h-2 rounded-full w-3/5"></div>
                            </div>
                            <span className="text-sm text-gray-600">60%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            진행중
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-mint-600 hover:text-mint-700 text-sm font-medium">
                            상세보기
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm font-bold">박</span>
                            </div>
                            <span className="font-medium text-gray-900">박준호</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">12세</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full w-full"></div>
                            </div>
                            <span className="text-sm text-gray-600">100%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-mint-100 text-mint-800 px-2 py-1 rounded-full text-xs font-medium">
                            완료
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-mint-600 hover:text-mint-700 text-sm font-medium">
                            상세보기
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 빠른 액션 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 액션</h3>
                <div className="space-y-3">
                  <button className="w-full bg-mint-500 hover:bg-mint-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    새 훈련 프로그램 추가
                  </button>
                  <button className="w-full bg-lavender-500 hover:bg-lavender-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    데이터 내보내기
                  </button>
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    시스템 설정
                  </button>
                </div>
              </div>

              {/* 최근 활동 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-mint-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">김민수가 시지각 훈련을 완료했습니다</p>
                      <p className="text-xs text-gray-500">2시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">새로운 사용자 3명이 등록되었습니다</p>
                      <p className="text-xs text-gray-500">4시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">시스템 업데이트가 완료되었습니다</p>
                      <p className="text-xs text-gray-500">1일 전</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 성과 요약 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">이번 주 성과</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">평균 훈련 시간</span>
                    <span className="font-semibold text-gray-900">45분</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">완료율</span>
                    <span className="font-semibold text-mint-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">만족도</span>
                    <span className="font-semibold text-lavender-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">개선도</span>
                    <span className="font-semibold text-yellow-600">+15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

