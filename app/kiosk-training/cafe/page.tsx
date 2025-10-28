'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, CreditCard, Download } from 'lucide-react'
import Link from 'next/link'

interface CafeMenu {
  id: string
  name: string
  price: number
  img: string
  tags?: ('hot' | 'ice' | 'signature' | 'decaf')[]
  options: {
    size: ('S' | 'M' | 'L')[]
    temperature: ('HOT' | 'ICE')[]
    addOns?: { id: string; label: string; price: number }[]
    sweetness?: (0 | 25 | 50 | 75 | 100)[]
  }
  allergens?: ('milk' | 'nuts' | 'soy')[]
}

interface CartItem {
  menuId: string
  qty: number
  selected: { 
    size: 'S' | 'M' | 'L'
    temperature: 'HOT' | 'ICE'
    addOns: string[]
    sweetness: number
  }
  unitPrice: number
  subTotal: number
}

interface CafeState {
  currentStep: 'menu' | 'options' | 'cart' | 'name' | 'payment' | 'receipt'
  selectedMenu: CafeMenu | null
  cart: CartItem[]
  pickupName: string
  paymentMethod: 'card' | 'qr' | 'cash' | null
  isPaymentProcessing: boolean
  gameCompleted: boolean
}

export default function CafeKiosk() {
  const [gameState, setGameState] = useState<CafeState>({
    currentStep: 'menu',
    selectedMenu: null,
    cart: [],
    pickupName: '',
    paymentMethod: null,
    isPaymentProcessing: false,
    gameCompleted: false
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // 카페 메뉴 데이터
  const cafeMenus: CafeMenu[] = [
    {
      id: 'americano',
      name: '아메리카노',
      price: 4500,
      img: '☕',
      tags: ['hot', 'ice'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['HOT', 'ICE'],
        addOns: [
          { id: 'shot', label: '샷 추가', price: 500 },
          { id: 'syrup', label: '시럽 추가', price: 300 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      }
    },
    {
      id: 'latte',
      name: '카페라떼',
      price: 5000,
      img: '🥛',
      tags: ['hot', 'ice'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['HOT', 'ICE'],
        addOns: [
          { id: 'shot', label: '샷 추가', price: 500 },
          { id: 'syrup', label: '시럽 추가', price: 300 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      },
      allergens: ['milk']
    },
    {
      id: 'cappuccino',
      name: '카푸치노',
      price: 5000,
      img: '☕',
      tags: ['hot'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['HOT'],
        addOns: [
          { id: 'shot', label: '샷 추가', price: 500 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      },
      allergens: ['milk']
    },
    {
      id: 'mocha',
      name: '카페모카',
      price: 5500,
      img: '🍫',
      tags: ['hot', 'ice'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['HOT', 'ICE'],
        addOns: [
          { id: 'shot', label: '샷 추가', price: 500 },
          { id: 'whipped', label: '휘핑크림', price: 500 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      },
      allergens: ['milk']
    },
    {
      id: 'frappuccino',
      name: '프라푸치노',
      price: 6000,
      img: '🧊',
      tags: ['ice', 'signature'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['ICE'],
        addOns: [
          { id: 'shot', label: '샷 추가', price: 500 },
          { id: 'whipped', label: '휘핑크림', price: 500 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      },
      allergens: ['milk']
    },
    {
      id: 'tea',
      name: '차',
      price: 4000,
      img: '🍵',
      tags: ['hot', 'ice'],
      options: {
        size: ['S', 'M', 'L'],
        temperature: ['HOT', 'ICE'],
        sweetness: [0, 25, 50, 75, 100]
      }
    }
  ]

  const [selectedOptions, setSelectedOptions] = useState({
    size: 'M' as 'S' | 'M' | 'L',
    temperature: 'HOT' as 'HOT' | 'ICE',
    addOns: [] as string[],
    sweetness: 50
  })

  // 메뉴 선택
  const selectMenu = (menu: CafeMenu) => {
    setGameState(prev => ({
      ...prev,
      selectedMenu: menu,
      currentStep: 'options'
    }))
    setSelectedOptions({
      size: 'M',
      temperature: 'HOT',
      addOns: [],
      sweetness: 50
    })
  }

  // 옵션 선택
  const selectOption = (type: string, value: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }))
  }

  // 장바구니에 추가
  const addToCart = () => {
    if (!gameState.selectedMenu) return

    const addOnPrice = gameState.selectedMenu.options.addOns?.reduce((total, addOn) => {
      return total + (selectedOptions.addOns.includes(addOn.id) ? addOn.price : 0)
    }, 0) || 0

    const sizeMultiplier = selectedOptions.size === 'S' ? 0.8 : selectedOptions.size === 'L' ? 1.2 : 1
    const unitPrice = Math.round((gameState.selectedMenu.price + addOnPrice) * sizeMultiplier)

    const cartItem: CartItem = {
      menuId: gameState.selectedMenu.id,
      qty: 1,
      selected: selectedOptions,
      unitPrice,
      subTotal: unitPrice
    }

    setGameState(prev => ({
      ...prev,
      cart: [...prev.cart, cartItem],
      currentStep: 'cart'
    }))

    showFeedbackMessage('장바구니에 추가되었습니다! 🛒')
  }

  // 수량 변경
  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setGameState(prev => ({
        ...prev,
        cart: prev.cart.filter((_, i) => i !== index)
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        cart: prev.cart.map((item, i) => 
          i === index 
            ? { ...item, qty: newQty, subTotal: item.unitPrice * newQty }
            : item
        )
      }))
    }
  }

  // 픽업 이름 입력
  const setPickupName = (name: string) => {
    setGameState(prev => ({
      ...prev,
      pickupName: name,
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

    setGameState(prev => ({
      ...prev,
      isPaymentProcessing: false,
      currentStep: 'receipt'
    }))
  }

  // 피드백 표시
  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
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

    // 게임 결과 저장
    try {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
      gameHistory.push({
        game: 'cafe-kiosk',
        timestamp: new Date().toISOString(),
        totalAmount: getTotalAmount(),
        itemsCount: gameState.cart.length,
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
      currentStep: 'menu',
      selectedMenu: null,
      cart: [],
      pickupName: '',
      paymentMethod: null,
      isPaymentProcessing: false,
      gameCompleted: false
    })
    setShowInstructions(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-amber-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">카페 키오스크</h1>
                <p className="text-sm text-gray-600">음료 주문부터 결제까지</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-amber-100 hover:bg-amber-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
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
            {['menu', 'options', 'cart', 'name', 'payment', 'receipt'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === gameState.currentStep
                    ? 'bg-amber-500 text-white'
                    : ['menu', 'options', 'cart', 'name', 'payment', 'receipt'].indexOf(gameState.currentStep) > index
                    ? 'bg-amber-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {gameState.currentStep === 'menu' && '메뉴 선택'}
              {gameState.currentStep === 'options' && '옵션 선택'}
              {gameState.currentStep === 'cart' && '장바구니'}
              {gameState.currentStep === 'name' && '픽업 이름'}
              {gameState.currentStep === 'payment' && '결제'}
              {gameState.currentStep === 'receipt' && '영수증'}
            </h2>
          </div>
        </div>

        {/* 메뉴 선택 화면 */}
        {gameState.currentStep === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafeMenus.map(menu => (
                <motion.div
                  key={menu.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectMenu(menu)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-amber-300"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{menu.img}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
                    <p className="text-2xl font-bold text-amber-600 mb-4">{menu.price.toLocaleString()}원</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {menu.tags?.map(tag => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tag === 'signature' ? 'bg-red-100 text-red-700' :
                            tag === 'hot' ? 'bg-orange-100 text-orange-700' :
                            tag === 'ice' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tag === 'signature' ? '시그니처' :
                           tag === 'hot' ? 'HOT' :
                           tag === 'ice' ? 'ICE' : tag}
                        </span>
                      ))}
                    </div>
                    {menu.allergens && (
                      <div className="mt-3 text-xs text-red-600">
                        알레르기: {menu.allergens.join(', ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 옵션 선택 화면 */}
        {gameState.currentStep === 'options' && gameState.selectedMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{gameState.selectedMenu.img}</div>
                <h3 className="text-2xl font-bold text-gray-900">{gameState.selectedMenu.name}</h3>
                <p className="text-lg text-gray-600">옵션을 선택해주세요</p>
              </div>

              <div className="space-y-8">
                {/* 사이즈 선택 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">사이즈</h4>
                  <div className="flex space-x-4">
                    {gameState.selectedMenu.options.size.map(size => (
                      <button
                        key={size}
                        onClick={() => selectOption('size', size)}
                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                          selectedOptions.size === size
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 온도 선택 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">온도</h4>
                  <div className="flex space-x-4">
                    {gameState.selectedMenu.options.temperature.map(temp => (
                      <button
                        key={temp}
                        onClick={() => selectOption('temperature', temp)}
                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                          selectedOptions.temperature === temp
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 추가 옵션 */}
                {gameState.selectedMenu.options.addOns && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">추가 옵션</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {gameState.selectedMenu.options.addOns.map(addOn => (
                        <button
                          key={addOn.id}
                          onClick={() => {
                            const newAddOns = selectedOptions.addOns.includes(addOn.id)
                              ? selectedOptions.addOns.filter(id => id !== addOn.id)
                              : [...selectedOptions.addOns, addOn.id]
                            selectOption('addOns', newAddOns)
                          }}
                          className={`p-4 rounded-lg border-2 font-medium transition-colors ${
                            selectedOptions.addOns.includes(addOn.id)
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                          }`}
                        >
                          <div>{addOn.label}</div>
                          <div className="text-sm">+{addOn.price.toLocaleString()}원</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 당도 선택 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">당도</h4>
                  <div className="flex space-x-2">
                    {gameState.selectedMenu.options.sweetness?.map(sweetness => (
                      <button
                        key={sweetness}
                        onClick={() => selectOption('sweetness', sweetness)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          selectedOptions.sweetness === sweetness
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                        }`}
                      >
                        {sweetness}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'menu' }))}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  뒤로
                </button>
                <button
                  onClick={addToCart}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
                >
                  장바구니에 추가
                </button>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">장바구니</h3>
                <ShoppingCart className="w-8 h-8 text-amber-600" />
              </div>

              {gameState.cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-xl text-gray-600">장바구니가 비어있습니다</p>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentStep: 'menu' }))}
                    className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                  >
                    메뉴 보기
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {gameState.cart.map((item, index) => {
                      const menu = cafeMenus.find(m => m.id === item.menuId)
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{menu?.img}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{menu?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.selected.size} | {item.selected.temperature}
                                {item.selected.addOns.length > 0 && ` | ${item.selected.addOns.join(', ')}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(index, item.qty - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(index, item.qty + 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-lg font-bold text-amber-600">
                              {item.subTotal.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-gray-900">총 금액</span>
                      <span className="text-2xl font-bold text-amber-600">
                        {getTotalAmount().toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, currentStep: 'menu' }))}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                      >
                        더 주문하기
                      </button>
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, currentStep: 'name' }))}
                        className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
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

        {/* 픽업 이름 입력 화면 */}
        {gameState.currentStep === 'name' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">픽업 이름을 입력해주세요</h3>
              <div className="mb-8">
                <input
                  type="text"
                  value={gameState.pickupName}
                  onChange={(e) => setGameState(prev => ({ ...prev, pickupName: e.target.value }))}
                  placeholder="이름을 입력하세요"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'cart' }))}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  뒤로
                </button>
                <button
                  onClick={() => setPickupName(gameState.pickupName)}
                  disabled={!gameState.pickupName.trim()}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
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
                <CreditCard className="w-16 h-16 text-amber-600 mx-auto mb-4" />
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
                  <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">결제 처리 중...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 영수증 화면 */}
        {gameState.currentStep === 'receipt' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">주문 완료!</h3>
                <p className="text-gray-600">픽업 이름: {gameState.pickupName}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">주문 내역</h4>
                {gameState.cart.map((item, index) => {
                  const menu = cafeMenus.find(m => m.id === item.menuId)
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">
                        {menu?.name} x {item.qty}
                      </span>
                      <span className="font-medium">{item.subTotal.toLocaleString()}원</span>
                    </div>
                  )
                })}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">총 금액</span>
                    <span className="font-bold text-amber-600">{getTotalAmount().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={completeGame}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
                >
                  완료
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 피드백 */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-amber-200">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-xl font-semibold text-gray-800">{feedbackMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 게임 완료 화면 */}
        {gameState.gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-amber-200 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">카페 주문 완료!</h2>
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-gray-800 mb-2">픽업 이름: {gameState.pickupName}</p>
                <p className="text-gray-800 mb-2">주문 수량: {gameState.cart.length}개</p>
                <p className="text-gray-800 mb-2">결제 방법: {
                  gameState.paymentMethod === 'card' ? '카드 결제' :
                  gameState.paymentMethod === 'qr' ? 'QR 결제' : '현금 결제'
                }</p>
                <p className="text-gray-800">총 금액: {getTotalAmount().toLocaleString()}원</p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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