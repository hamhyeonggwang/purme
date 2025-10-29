'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, ShoppingCart, CreditCard, Package } from 'lucide-react'
import Link from 'next/link'

interface Address {
  id: string
  label: string
  addr1: string
  geo?: { lat: number; lng: number }
}

interface Store {
  id: string
  name: string
  distance: number
  eta: number
  rating: number
  minOrder: number
}

interface CartItem {
  menuId: string
  qty: number
  unitPrice: number
  subTotal: number
}

interface DeliveryState {
  currentStep: 'address' | 'store-list' | 'menu' | 'cart' | 'payment' | 'tracking'
  address: Address | null
  recentAddresses: Address[]
  stores: Store[]
  selectedStore: Store | null
  cart: CartItem[]
  deliveryNotes: string
  paymentMethod: 'card' | 'qr' | 'cash' | null
  isPaymentProcessing: boolean
  orderStatus: 'accepted' | 'cooking' | 'outForDelivery' | 'delivered'
  gameCompleted: boolean
}

export default function DeliveryKiosk() {
  const [gameState, setGameState] = useState<DeliveryState>({
    currentStep: 'address',
    address: null,
    recentAddresses: [
      { id: 'addr1', label: '집', addr1: '서울시 강남구 테헤란로 123' },
      { id: 'addr2', label: '회사', addr1: '서울시 서초구 서초대로 456' }
    ],
    stores: [],
    selectedStore: null,
    cart: [],
    deliveryNotes: '',
    paymentMethod: null,
    isPaymentProcessing: false,
    orderStatus: 'accepted',
    gameCompleted: false
  })

  const [addressSearch, setAddressSearch] = useState('')

  const mockStores: Store[] = [
    {
      id: 'store1',
      name: '맛있는 치킨',
      distance: 1.2,
      eta: 25,
      rating: 4.8,
      minOrder: 15000
    },
    {
      id: 'store2',
      name: '피자나라',
      distance: 0.8,
      eta: 20,
      rating: 4.6,
      minOrder: 20000
    },
    {
      id: 'store3',
      name: '중화요리',
      distance: 2.1,
      eta: 35,
      rating: 4.5,
      minOrder: 18000
    },
    {
      id: 'store4',
      name: '떡볶이 집',
      distance: 1.5,
      eta: 15,
      rating: 4.9,
      minOrder: 12000
    }
  ]

  const mockMenus = [
    { id: 'menu1', name: '후라이드 치킨', price: 18000 },
    { id: 'menu2', name: '양념 치킨', price: 19000 },
    { id: 'menu3', name: '피자 세트', price: 25000 },
    { id: 'menu4', name: '짜장면', price: 8000 },
    { id: 'menu5', name: '떡볶이', price: 6000 }
  ]

  // 주소 검색
  const searchAddress = () => {
    if (!addressSearch.trim()) {
      alert('주소를 입력해주세요.')
      return
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      label: '새 주소',
      addr1: addressSearch
    }

    setGameState(prev => ({
      ...prev,
      address: newAddress,
      stores: mockStores,
      currentStep: 'store-list'
    }))
  }

  // 최근 주소 선택
  const selectAddress = (address: Address) => {
    setGameState(prev => ({
      ...prev,
      address,
      stores: mockStores,
      currentStep: 'store-list'
    }))
  }

  // 매장 선택
  const selectStore = (store: Store) => {
    setGameState(prev => ({
      ...prev,
      selectedStore: store,
      currentStep: 'menu'
    }))
  }

  // 메뉴 추가
  const addToCart = (menuId: string) => {
    const menu = mockMenus.find(m => m.id === menuId)
    if (!menu) return

    const existingItem = gameState.cart.find(item => item.menuId === menuId)
    if (existingItem) {
      setGameState(prev => ({
        ...prev,
        cart: prev.cart.map(item =>
          item.menuId === menuId
            ? { ...item, qty: item.qty + 1, subTotal: item.unitPrice * (item.qty + 1) }
            : item
        )
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        cart: [...prev.cart, {
          menuId,
          qty: 1,
          unitPrice: menu.price,
          subTotal: menu.price
        }]
      }))
    }
  }

  // 수량 변경
  const updateQuantity = (menuId: string, newQty: number) => {
    if (newQty <= 0) {
      setGameState(prev => ({
        ...prev,
        cart: prev.cart.filter(item => item.menuId !== menuId)
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        cart: prev.cart.map(item =>
          item.menuId === menuId
            ? { ...item, qty: newQty, subTotal: item.unitPrice * newQty }
            : item
        )
      }))
    }
  }

  // 주문 확인
  const confirmOrder = () => {
    const totalAmount = gameState.cart.reduce((sum, item) => sum + item.subTotal, 0)
    if (gameState.selectedStore && totalAmount < gameState.selectedStore.minOrder) {
      alert(`최소 주문 금액 ${gameState.selectedStore.minOrder.toLocaleString()}원 이상 주문해주세요.`)
      return
    }

    setGameState(prev => ({
      ...prev,
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

    await new Promise(resolve => setTimeout(resolve, 2000))

    setGameState(prev => ({
      ...prev,
      isPaymentProcessing: false,
      orderStatus: 'accepted',
      currentStep: 'tracking'
    }))

    // 주문 상태 시뮬레이션
    setTimeout(() => {
      setGameState(prev => ({ ...prev, orderStatus: 'cooking' }))
      setTimeout(() => {
        setGameState(prev => ({ ...prev, orderStatus: 'outForDelivery' }))
        setTimeout(() => {
          setGameState(prev => ({ ...prev, orderStatus: 'delivered' }))
        }, 2000)
      }, 2000)
    }, 2000)
  }

  // 총 금액 계산
  const getTotalAmount = () => {
    return gameState.cart.reduce((total, item) => total + item.subTotal, 0)
  }

  // 게임 완료
  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true
    }))

    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'delivery-kiosk',
        timestamp: new Date().toISOString(),
        address: gameState.address?.addr1,
        store: gameState.selectedStore?.name,
        totalAmount: getTotalAmount(),
        paymentMethod: gameState.paymentMethod
      })
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(-50)))
    } catch (error) {
      console.log('게임 결과 저장 실패:', error)
    }
  }

  const resetGame = () => {
    setGameState({
      currentStep: 'address',
      address: null,
      recentAddresses: [
        { id: 'addr1', label: '집', addr1: '서울시 강남구 테헤란로 123' },
        { id: 'addr2', label: '회사', addr1: '서울시 서초구 서초대로 456' }
      ],
      stores: [],
      selectedStore: null,
      cart: [],
      deliveryNotes: '',
      paymentMethod: null,
      isPaymentProcessing: false,
      orderStatus: 'accepted',
      gameCompleted: false
    })
    setAddressSearch('')
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return '주문 접수'
      case 'cooking': return '조리 중'
      case 'outForDelivery': return '배달 중'
      case 'delivered': return '배달 완료'
      default: return ''
    }
  }

  const getOrderStatusProgress = (status: string) => {
    switch (status) {
      case 'accepted': return 25
      case 'cooking': return 50
      case 'outForDelivery': return 75
      case 'delivered': return 100
      default: return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <header className="bg-white/90 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-violet-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">배달앱 주문</h1>
                <p className="text-sm text-gray-600">배달 주문부터 추적까지</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-violet-100 hover:bg-violet-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
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
            {['address', 'store-list', 'menu', 'cart', 'payment', 'tracking'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  gameState.currentStep === step
                    ? 'bg-violet-500 text-white'
                    : ['address', 'store-list', 'menu', 'cart', 'payment', 'tracking'].indexOf(gameState.currentStep) > index
                    ? 'bg-violet-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 주소 검색 화면 */}
        {gameState.currentStep === 'address' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <MapPin className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">배달 주소를 입력하세요</h3>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                  placeholder="주소를 검색하세요"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={searchAddress}
                  className="mt-4 w-full px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg transition-colors"
                >
                  검색
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">최근 주소</h4>
                <div className="space-y-3">
                  {gameState.recentAddresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => selectAddress(addr)}
                      className="w-full p-4 bg-gray-50 hover:bg-violet-50 border-2 border-gray-200 rounded-lg transition-colors text-left"
                    >
                      <div className="font-semibold text-gray-900">{addr.label}</div>
                      <div className="text-sm text-gray-600">{addr.addr1}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 매장 목록 화면 */}
        {gameState.currentStep === 'store-list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">매장 선택</h3>
              <div className="text-sm text-gray-600 mb-4">배달 주소: {gameState.address?.addr1}</div>
              <div className="space-y-4">
                {gameState.stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => selectStore(store)}
                    className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-violet-500 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{store.name}</h4>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{store.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          거리: {store.distance}km | 예상 소요: {store.eta}분 | 최소주문: {store.minOrder.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 메뉴 화면 */}
        {gameState.currentStep === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{gameState.selectedStore?.name}</h3>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'cart' }))}
                  className="relative px-4 py-2 bg-violet-500 text-white rounded-lg"
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  장바구니
                  {gameState.cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {gameState.cart.reduce((sum, item) => sum + item.qty, 0)}
                    </span>
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockMenus.map(menu => (
                  <button
                    key={menu.id}
                    onClick={() => addToCart(menu.id)}
                    className="p-6 bg-gray-50 hover:bg-violet-50 border-2 border-gray-200 rounded-lg transition-colors text-left"
                  >
                    <div className="text-4xl mb-3">🍕</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{menu.name}</h4>
                    <p className="text-lg font-bold text-violet-600">{menu.price.toLocaleString()}원</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 장바구니 화면 */}
        {gameState.currentStep === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">장바구니</h3>

              {gameState.cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">장바구니가 비어있습니다</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {gameState.cart.map(item => {
                      const menu = mockMenus.find(m => m.id === item.menuId)
                      return (
                        <div key={item.menuId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">🍕</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{menu?.name}</h4>
                              <p className="text-sm text-gray-600">{menu?.price.toLocaleString()}원</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.menuId, item.qty - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.menuId, item.qty + 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-lg font-bold text-violet-600">
                              {item.subTotal.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">배달 요청사항</label>
                    <input
                      type="text"
                      value={gameState.deliveryNotes}
                      onChange={(e) => setGameState(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                      placeholder="예: 문 앞에 놓아주세요"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-gray-900">총 금액</span>
                      <span className="text-2xl font-bold text-violet-600">
                        {getTotalAmount().toLocaleString()}원
                      </span>
                    </div>
                    {gameState.selectedStore && getTotalAmount() < gameState.selectedStore.minOrder && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800">
                          최소 주문 금액 {gameState.selectedStore.minOrder.toLocaleString()}원 이상 주문해주세요.
                          ({gameState.selectedStore.minOrder - getTotalAmount()}원 더 필요합니다)
                        </p>
                      </div>
                    )}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, currentStep: 'menu' }))}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                      >
                        더 주문하기
                      </button>
                      <button
                        onClick={confirmOrder}
                        disabled={!!(gameState.selectedStore && getTotalAmount() < gameState.selectedStore.minOrder)}
                        className="px-8 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
                      >
                        주문하기
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                <CreditCard className="w-16 h-16 text-violet-600 mx-auto mb-4" />
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
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">QR</span>
                    </div>
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
                  <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">결제 처리 중...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 주문 추적 화면 */}
        {gameState.currentStep === 'tracking' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <Package className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">주문 추적</h3>
                <p className="text-gray-600">{gameState.selectedStore?.name}</p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">주문 상태</span>
                  <span className={`font-bold ${
                    gameState.orderStatus === 'delivered' ? 'text-green-600' : 'text-violet-600'
                  }`}>
                    {getOrderStatusText(gameState.orderStatus)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getOrderStatusProgress(gameState.orderStatus)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">주문 내역</h4>
                <div className="space-y-2 mb-4">
                  {gameState.cart.map(item => {
                    const menu = mockMenus.find(m => m.id === item.menuId)
                    return (
                      <div key={item.menuId} className="flex justify-between">
                        <span className="text-gray-700">{menu?.name} x {item.qty}</span>
                        <span className="font-medium">{item.subTotal.toLocaleString()}원</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">총 금액</span>
                    <span className="font-bold text-violet-600">{getTotalAmount().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {gameState.orderStatus === 'delivered' && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl font-bold text-green-600 mb-6">배달 완료!</p>
                  <button
                    onClick={completeGame}
                    className="px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg transition-colors"
                  >
                    완료
                  </button>
                </div>
              )}
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-violet-200 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">배달 주문 완료!</h2>
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <p className="text-gray-800 mb-2">{gameState.selectedStore?.name}</p>
                <p className="text-gray-800 mb-2">배달 주소: {gameState.address?.addr1}</p>
                <p className="text-gray-800 mb-2">주문 수량: {gameState.cart.length}개</p>
                <p className="text-gray-800 mb-2">총 금액: {getTotalAmount().toLocaleString()}원</p>
                <p className="text-gray-800">결제 방법: {
                  gameState.paymentMethod === 'card' ? '카드 결제' :
                  gameState.paymentMethod === 'qr' ? 'QR 결제' : '현금 결제'
                }</p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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

