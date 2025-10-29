'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Train, CreditCard, QrCode } from 'lucide-react'
import Link from 'next/link'

interface TrainQuery {
  from: string
  to: string
  date: string
  time: string
  pax: { adult: number; child: number }
  cls: 'general' | 'first'
}

interface TrainResult {
  id: string
  depart: string
  arrive: string
  duration: number
  price: number
  transfers: number
  seatsAvailable: number
}

interface SeatSelection {
  coach: number
  seat: string
  cls: 'general' | 'first'
}

interface TrainState {
  currentStep: 'search' | 'train-list' | 'seat-selection' | 'passenger-info' | 'payment' | 'ticket'
  query: TrainQuery
  trainResults: TrainResult[]
  selectedTrain: TrainResult | null
  selectedSeats: SeatSelection[]
  passengerInfo: {
    name: string
    birthDate: string
    phone: string
  }
  paymentMethod: 'card' | 'qr' | 'cash' | null
  isPaymentProcessing: boolean
  ticketQR: string
  gameCompleted: boolean
}

export default function TrainKiosk() {
  const [gameState, setGameState] = useState<TrainState>({
    currentStep: 'search',
    query: {
      from: '',
      to: '',
      date: '',
      time: '',
      pax: { adult: 1, child: 0 },
      cls: 'general'
    },
    trainResults: [],
    selectedTrain: null,
    selectedSeats: [],
    passengerInfo: {
      name: '',
      birthDate: '',
      phone: ''
    },
    paymentMethod: null,
    isPaymentProcessing: false,
    ticketQR: '',
    gameCompleted: false
  })

  const stations = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원', '고양', '용인',
    '성남', '부천', '안산', '안양', '평택', '제천', '천안', '전주', '목포', '여수',
    '진해', '구례', '순천', '밀양', '구미', '포항', '창원', '통영', '거제', '김해'
  ]

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [classType, setClassType] = useState<'general' | 'first'>('general')

  // 날짜 초기화
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    setDate(tomorrowStr)
    setTime('09:00')
  }, [])

  // 검색
  const searchTrains = () => {
    if (!gameState.query.from || !gameState.query.to || !date || !time) {
      alert('모든 정보를 입력해주세요.')
      return
    }

    if (gameState.query.from === gameState.query.to) {
      alert('출발지와 도착지가 같을 수 없습니다.')
      return
    }

    // 검색 시뮬레이션 - 실제로는 3-5개의 열차 결과 생성
    const mockResults: TrainResult[] = []
    const times = ['09:00', '09:30', '10:00', '11:00', '12:00']
    
    times.forEach((time, index) => {
      const departure = `${gameState.query.from}역 ${time}`
      const arrival = `${gameState.query.to}역 ${time}:${30 + index * 10}:00`
      const price = classType === 'first' ? 80000 : 50000
      
      mockResults.push({
        id: `train-${index}`,
        depart: departure,
        arrive: arrival,
        duration: 180 + index * 30,
        price: price,
        transfers: index % 2,
        seatsAvailable: Math.floor(Math.random() * 20) + 1
      })
    })

    setGameState(prev => ({
      ...prev,
      trainResults: mockResults,
      currentStep: 'train-list'
    }))
  }

  // 열차 선택
  const selectTrain = (train: TrainResult) => {
    setGameState(prev => ({
      ...prev,
      selectedTrain: train,
      currentStep: 'seat-selection'
    }))
  }

  // 좌석 선택
  const selectSeat = (coach: number, seat: string) => {
    setGameState(prev => {
      const existingSeat = prev.selectedSeats.find(s => s.coach === coach && s.seat === seat)
      if (existingSeat) {
        return {
          ...prev,
          selectedSeats: prev.selectedSeats.filter(s => !(s.coach === coach && s.seat === seat))
        }
      } else {
        if (prev.selectedSeats.length >= gameState.query.pax.adult + gameState.query.pax.child) {
          alert('모든 승객의 좌석을 선택하셨습니다.')
          return prev
        }
        return {
          ...prev,
          selectedSeats: [...prev.selectedSeats, { coach, seat, cls: classType }]
        }
      }
    })
  }

  // 승객 정보 입력 완료
  const setPassengerInfo = (info: { name: string; birthDate: string; phone: string }) => {
    setGameState(prev => ({
      ...prev,
      passengerInfo: info,
      currentStep: 'payment'
    }))
  }

  // 결제 처리
  const processPayment = async (method: 'card' | 'qr' | 'cash') => {
    setGameState(prev => ({
      ...prev,
      paymentMethod: method,
      isPaymentProcessing: true
    }))

    // 결제 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 티켓 QR 생성
    const ticketQR = `${gameState.query.from}-${gameState.query.to}-${Date.now()}`
    setGameState(prev => ({
      ...prev,
      isPaymentProcessing: false,
      ticketQR,
      currentStep: 'ticket'
    }))
  }

  // 총 금액 계산
  const getTotalAmount = () => {
    if (!gameState.selectedTrain) return 0
    return gameState.selectedTrain.price * (adultCount + childCount)
  }

  // 게임 완료
  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true
    }))

    // 게임 결과 저장
    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'train-kiosk',
        timestamp: new Date().toISOString(),
        from: gameState.query.from,
        to: gameState.query.to,
        date,
        trainCount: gameState.trainResults.length,
        totalAmount: getTotalAmount(),
        paymentMethod: gameState.paymentMethod
      })
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
    } catch (error) {
      console.log('게임 결과 저장 실패:', error)
    }
  }

  // 게임 리셋
  const resetGame = () => {
    setGameState({
      currentStep: 'search',
      query: {
        from: '',
        to: '',
        date: '',
        time: '',
        pax: { adult: 1, child: 0 },
        cls: 'general'
      },
      trainResults: [],
      selectedTrain: null,
      selectedSeats: [],
      passengerInfo: {
        name: '',
        birthDate: '',
        phone: ''
      },
      paymentMethod: null,
      isPaymentProcessing: false,
      ticketQR: '',
      gameCompleted: false
    })
    setDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])
    setTime('09:00')
    setAdultCount(1)
    setChildCount(0)
    setClassType('general')
  }

  // 좌석도 생성 (간단한 버전)
  const renderSeatMap = () => {
    const seats = []
    for (let row = 1; row <= 10; row++) {
      const rowSeats = []
      for (let col = 0; col < 2; col++) {
        const seat = String.fromCharCode(65 + col) + row
        const isSelected = gameState.selectedSeats.some(s => s.seat === seat)
        rowSeats.push(
          <button
            key={seat}
            onClick={() => selectSeat(1, seat)}
            className={`w-12 h-12 rounded border-2 ${
              isSelected
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {seat}
          </button>
        )
      }
      rowSeats.push(
        <div key={`aisle-${row}`} className="w-4"></div>
      )
      for (let col = 2; col < 4; col++) {
        const seat = String.fromCharCode(65 + col) + row
        const isSelected = gameState.selectedSeats.some(s => s.seat === seat)
        rowSeats.push(
          <button
            key={seat}
            onClick={() => selectSeat(1, seat)}
            className={`w-12 h-12 rounded border-2 ${
              isSelected
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {seat}
          </button>
        )
      }
      seats.push(<div key={row} className="flex items-center space-x-1">{rowSeats}</div>)
    }
    return seats
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-blue-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">기차표 예매</h1>
                <p className="text-sm text-gray-600">기차표 예매부터 승차권까지</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-blue-100 hover:bg-blue-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              다시 시작
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 진행 단계 표시 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-center space-x-4">
            {['search', 'train-list', 'seat-selection', 'passenger-info', 'payment', 'ticket'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  gameState.currentStep === step
                    ? 'bg-blue-500 text-white'
                    : ['search', 'train-list', 'seat-selection', 'passenger-info', 'payment', 'ticket'].indexOf(gameState.currentStep) > index
                    ? 'bg-blue-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {gameState.currentStep === 'search' && '출발지/도착지 선택'}
              {gameState.currentStep === 'train-list' && '열차 선택'}
              {gameState.currentStep === 'seat-selection' && '좌석 선택'}
              {gameState.currentStep === 'passenger-info' && '승객 정보'}
              {gameState.currentStep === 'payment' && '결제'}
              {gameState.currentStep === 'ticket' && '승차권'}
            </h2>
          </div>
        </div>

        {/* 검색 화면 */}
        {gameState.currentStep === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <Train className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">기차표 예매</h3>
                <p className="text-gray-600">출발지와 도착지를 선택해주세요</p>
              </div>

              <div className="space-y-6">
                {/* 출발지/도착지 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">출발지</label>
                    <select
                      value={gameState.query.from}
                      onChange={(e) => setGameState(prev => ({ ...prev, query: { ...prev.query, from: e.target.value } }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">선택하세요</option>
                      {stations.map(station => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">도착지</label>
                    <select
                      value={gameState.query.to}
                      onChange={(e) => setGameState(prev => ({ ...prev, query: { ...prev.query, to: e.target.value } }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">선택하세요</option>
                      {stations.map(station => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 날짜/시간 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 인원 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인원</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700">어른</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{adultCount}</span>
                        <button
                          onClick={() => setAdultCount(Math.min(9, adultCount + 1))}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700">어린이</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setChildCount(Math.max(0, childCount - 1))}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{childCount}</span>
                        <button
                          onClick={() => setChildCount(Math.min(9, childCount + 1))}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 좌석 등급 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">좌석 등급</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setClassType('general')}
                      className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                        classType === 'general'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      일반실
                    </button>
                    <button
                      onClick={() => setClassType('first')}
                      className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                        classType === 'first'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      특실
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      query: { ...prev.query, pax: { adult: adultCount, child: childCount }, cls: classType }
                    }))
                    searchTrains()
                  }}
                  className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-lg"
                >
                  열차 검색
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 열차 목록 화면 */}
        {gameState.currentStep === 'train-list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">열차 목록</h3>
              <div className="space-y-4">
                {gameState.trainResults.map(train => (
                  <button
                    key={train.id}
                    onClick={() => selectTrain(train)}
                    className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Train className="w-6 h-6 text-blue-600" />
                          <span className="font-semibold text-gray-900">{train.depart}</span>
                          <span className="text-gray-500">→</span>
                          <span className="font-semibold text-gray-900">{train.arrive}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          소요시간: {Math.floor(train.duration / 60)}시간 {train.duration % 60}분
                          {train.transfers > 0 && ` | 환승 ${train.transfers}회`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {train.price.toLocaleString()}원
                        </div>
                        <div className="text-sm text-gray-600">
                          잔여좌석: {train.seatsAvailable}석
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 좌석 선택 화면 */}
        {gameState.currentStep === 'seat-selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">좌석 선택</h3>
              <p className="text-gray-600 mb-6">
                {adultCount + childCount}개의 좌석을 선택해주세요 (선택: {gameState.selectedSeats.length}/{adultCount + childCount})
              </p>
              <div className="border-2 border-gray-300 rounded-lg p-6 overflow-auto max-h-96">
                {renderSeatMap()}
              </div>
              {gameState.selectedSeats.length === adultCount + childCount && (
                <button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'passenger-info' }))}
                  className="mt-6 w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                >
                  다음
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 승객 정보 화면 */}
        {gameState.currentStep === 'passenger-info' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">승객 정보 입력</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    value={gameState.passengerInfo.name}
                    onChange={(e) => setGameState(prev => ({ ...prev, passengerInfo: { ...prev.passengerInfo, name: e.target.value } }))}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                  <input
                    type="date"
                    value={gameState.passengerInfo.birthDate}
                    onChange={(e) => setGameState(prev => ({ ...prev, passengerInfo: { ...prev.passengerInfo, birthDate: e.target.value } }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input
                    type="tel"
                    value={gameState.passengerInfo.phone}
                    onChange={(e) => setGameState(prev => ({ ...prev, passengerInfo: { ...prev.passengerInfo, phone: e.target.value } }))}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setPassengerInfo(gameState.passengerInfo)}
                  disabled={!gameState.passengerInfo.name || !gameState.passengerInfo.birthDate || !gameState.passengerInfo.phone}
                  className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
                >
                  다음
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 결제 화면 */}
        {gameState.currentStep === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">결제 방법을 선택해주세요</h3>
                <p className="text-gray-600">총 금액: {getTotalAmount().toLocaleString()}원</p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                <button
                  onClick={() => processPayment('card')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-800">카드 결제</span>
                  </div>
                </button>
                <button
                  onClick={() => processPayment('qr')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <QrCode className="w-8 h-8 text-green-600" />
                    <span className="text-lg font-semibold text-green-800">QR 결제</span>
                  </div>
                </button>
                <button
                  onClick={() => processPayment('cash')}
                  disabled={gameState.isPaymentProcessing}
                  className="p-6 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">💵</span>
                    <span className="text-lg font-semibold text-yellow-800">현금 결제</span>
                  </div>
                </button>
              </div>

              {gameState.isPaymentProcessing && (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">결제 처리 중...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 승차권 화면 */}
        {gameState.currentStep === 'ticket' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">예매 완료!</h3>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="text-center mb-6">
                  <QrCode className="w-32 h-32 mx-auto mb-4" />
                  <p className="text-xs text-gray-600 mb-2">QR 코드</p>
                  <p className="text-sm font-mono text-gray-700">{gameState.ticketQR}</p>
                </div>
                <div className="bg-white rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">출발지</span>
                    <span className="font-semibold">{gameState.query.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">도착지</span>
                    <span className="font-semibold">{gameState.query.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">날짜</span>
                    <span className="font-semibold">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">인원</span>
                    <span className="font-semibold">어른 {adultCount}명, 어린이 {childCount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 금액</span>
                    <span className="font-bold text-blue-600">{getTotalAmount().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={completeGame}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                >
                  완료
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 게임 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-blue-200 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">기차표 예매 완료!</h2>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-gray-800 mb-2">{gameState.query.from} → {gameState.query.to}</p>
                <p className="text-gray-800 mb-2">인원: 어른 {adultCount}명, 어린이 {childCount}명</p>
                <p className="text-gray-800 mb-2">총 금액: {getTotalAmount().toLocaleString()}원</p>
                <p className="text-gray-800">결제 방법: {
                  gameState.paymentMethod === 'card' ? '카드 결제' :
                  gameState.paymentMethod === 'qr' ? 'QR 결제' : '현금 결제'
                }</p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  다시 하기
                </button>
                <Link href="/kiosk-training" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  목록으로
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
