'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, CreditCard, Bell } from 'lucide-react'
import Link from 'next/link'

interface Dish {
  id: string
  name: string
  price: number
  img: string
  category: string
  allergens?: ('gluten' | 'milk' | 'egg' | 'peanut')[]
  origin?: { country: string; item: string }[]
  options?: { spice?: (0 | 1 | 2 | 3); portion?: ('S' | 'M' | 'L') }
}

interface CartItem {
  dishId: string
  qty: number
  selected: {
    spice: number
    portion: 'S' | 'M' | 'L'
  }
  unitPrice: number
  subTotal: number
}

interface RestaurantState {
  currentStep: 'category' | 'menu' | 'dine-takeout' | 'cart' | 'payment' | 'bell'
  selectedCategory: string
  selectedDish: Dish | null
  dineOrTakeout: 'dine' | 'takeout' | null
  tableNumber: string
  cart: CartItem[]
  paymentMethod: 'card' | 'qr' | 'cash' | null
  isPaymentProcessing: boolean
  bellNumber: string
  gameCompleted: boolean
}

export default function RestaurantKiosk() {
  const [gameState, setGameState] = useState<RestaurantState>({
    currentStep: 'category',
    selectedCategory: '',
    selectedDish: null,
    dineOrTakeout: null,
    tableNumber: '',
    cart: [],
    paymentMethod: null,
    isPaymentProcessing: false,
    bellNumber: '',
    gameCompleted: false
  })

  const [showInstructions, setShowInstructions] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // 식당 메뉴 데이터
  const dishes: Dish[] = [
    // 메인 요리
    {
      id: 'bulgogi',
      name: '불고기',
      price: 12000,
      img: '🥩',
      category: '메인 요리',
      allergens: ['soy'],
      origin: [{ country: '한국', item: '소고기' }],
      options: { spice: [0, 1, 2], portion: ['S', 'M', 'L'] }
    },
    {
      id: 'galbi',
      name: '갈비',
      price: 15000,
      img: '🍖',
      category: '메인 요리',
      allergens: ['soy'],
      origin: [{ country: '한국', item: '소고기' }],
      options: { spice: [0, 1], portion: ['M', 'L'] }
    },
    {
      id: 'chicken',
      name: '치킨',
      price: 18000,
      img: '🍗',
      category: '메인 요리',
      allergens: ['egg'],
      origin: [{ country: '한국', item: '닭고기' }],
      options: { spice: [0, 1, 2, 3], portion: ['M', 'L'] }
    },
    // 면류
    {
      id: 'ramen',
      name: '라면',
      price: 8000,
      img: '🍜',
      category: '면류',
      allergens: ['gluten', 'egg'],
      origin: [{ country: '한국', item: '밀가루' }],
      options: { spice: [0, 1, 2, 3], portion: ['M', 'L'] }
    },
    {
      id: 'udon',
      name: '우동',
      price: 9000,
      img: '🍲',
      category: '면류',
      allergens: ['gluten'],
      origin: [{ country: '일본', item: '밀가루' }],
      options: { spice: [0, 1], portion: ['M', 'L'] }
    },
    {
      id: 'jajangmyeon',
      name: '짜장면',
      price: 7000,
      img: '🍝',
      category: '면류',
      allergens: ['gluten'],
      origin: [{ country: '중국', item: '밀가루' }],
      options: { spice: [0], portion: ['M', 'L'] }
    },
    // 밥류
    {
      id: 'bibimbap',
      name: '비빔밥',
      price: 10000,
      img: '🍚',
      category: '밥류',
      allergens: ['egg'],
      origin: [{ country: '한국', item: '쌀' }],
      options: { spice: [0, 1, 2], portion: ['M', 'L'] }
    },
    {
      id: 'kimchi-fried-rice',
      name: '김치볶음밥',
      price: 9000,
      img: '🍛',
      category: '밥류',
      allergens: ['egg'],
      origin: [{ country: '한국', item: '쌀' }],
      options: { spice: [1, 2, 3], portion: ['M', 'L'] }
    },
    {
      id: 'curry-rice',
      name: '카레라이스',
      price: 11000,
      img: '🍛',
      category: '밥류',
      allergens: ['milk'],
      origin: [{ country: '일본', item: '쌀' }],
      options: { spice: [0, 1, 2], portion: ['M', 'L'] }
    },
    // 사이드
    {
      id: 'kimchi',
      name: '김치',
      price: 3000,
      img: '🥬',
      category: '사이드',
      origin: [{ country: '한국', item: '배추' }],
      options: { spice: [1, 2, 3], portion: ['S', 'M'] }
    },
    {
      id: 'pickled-radish',
      name: '단무지',
      price: 2000,
      img: '🥕',
      category: '사이드',
      origin: [{ country: '한국', item: '무' }],
      options: { spice: [0], portion: ['S', 'M'] }
    },
    {
      id: 'seaweed-soup',
      name: '미역국',
      price: 5000,
      img: '🍲',
      category: '사이드',
      origin: [{ country: '한국', item: '미역' }],
      options: { spice: [0, 1], portion: ['M', 'L'] }
    }
  ]

  const categories = ['메인 요리', '면류', '밥류', '사이드']

  const [selectedOptions, setSelectedOptions] = useState({
    spice: 1,
    portion: 'M' as 'S' | 'M' | 'L'
  })

  // 카테고리 선택
  const selectCategory = (category: string) => {
    setGameState(prev => ({
      ...prev,
      selectedCategory: category,
      currentStep: 'menu'
    }))
  }

  // 메뉴 선택
  const selectDish = (dish: Dish) => {
    setGameState(prev => ({
      ...prev,
      selectedDish: dish
    }))
    setSelectedOptions({
      spice: dish.options?.spice?.[0] || 1,
      portion: dish.options?.portion?.[0] || 'M'
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
    if (!gameState.selectedDish) return

    const portionMultiplier = selectedOptions.portion === 'S' ? 0.8 : 
                             selectedOptions.portion === 'L' ? 1.2 : 1
    const unitPrice = Math.round(gameState.selectedDish.price * portionMultiplier)

    const cartItem: CartItem = {
      dishId: gameState.selectedDish.id,
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

  // 매장/포장 선택
  const selectDineOrTakeout = (option: 'dine' | 'takeout') => {
    setGameState(prev => ({
      ...prev,
      dineOrTakeout: option,
      currentStep: 'payment'
    }))
  }

  // 테이블 번호 입력
  const setTableNumber = (number: string) => {
    setGameState(prev => ({
      ...prev,
      tableNumber: number
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

    // 호출벨 번호 생성
    const bellNumber = Math.floor(Math.random() * 999) + 1
    setGameState(prev => ({
      ...prev,
      isPaymentProcessing: false,
      bellNumber: bellNumber.toString(),
      currentStep: 'bell'
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
        game: 'restaurant-kiosk',
        timestamp: new Date().toISOString(),
        totalAmount: getTotalAmount(),
        itemsCount: gameState.cart.length,
        dineOrTakeout: gameState.dineOrTakeout,
        tableNumber: gameState.tableNumber,
        bellNumber: gameState.bellNumber,
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
      currentStep: 'category',
      selectedCategory: '',
      selectedDish: null,
      dineOrTakeout: null,
      tableNumber: '',
      cart: [],
      paymentMethod: null,
      isPaymentProcessing: false,
      bellNumber: '',
      gameCompleted: false
    })
    setShowInstructions(true)
  }

  // 필터링된 메뉴
  const filteredDishes = dishes.filter(dish => dish.category === gameState.selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-emerald-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">식당 키오스크</h1>
                <p className="text-sm text-gray-600">음식 주문부터 호출벨까지</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-emerald-100 hover:bg-emerald-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
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
            {['category', 'menu', 'dine-takeout', 'cart', 'payment', 'bell'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === gameState.currentStep
                    ? 'bg-emerald-500 text-white'
                    : ['category', 'menu', 'dine-takeout', 'cart', 'payment', 'bell'].indexOf(gameState.currentStep) > index
                    ? 'bg-emerald-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {gameState.currentStep === 'category' && '카테고리 선택'}
              {gameState.currentStep === 'menu' && '메뉴 선택'}
              {gameState.currentStep === 'dine-takeout' && '매장/포장 선택'}
              {gameState.currentStep === 'cart' && '주문 확인'}
              {gameState.currentStep === 'payment' && '결제'}
              {gameState.currentStep === 'bell' && '호출벨 번호'}
            </h2>
          </div>
        </div>

        {/* 카테고리 선택 화면 */}
        {gameState.currentStep === 'category' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectCategory(category)}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-300 text-center"
                >
                  <div className="text-6xl mb-4">
                    {category === '메인 요리' && '🍖'}
                    {category === '면류' && '🍜'}
                    {category === '밥류' && '🍚'}
                    {category === '사이드' && '🥗'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 메뉴 선택 화면 */}
        {gameState.currentStep === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{gameState.selectedCategory}</h3>
              <p className="text-gray-600">원하는 음식을 선택해주세요</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map(dish => (
                <motion.div
                  key={dish.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectDish(dish)}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                    gameState.selectedDish?.id === dish.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-transparent hover:border-emerald-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{dish.img}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h4>
                    <p className="text-2xl font-bold text-emerald-600 mb-4">{dish.price.toLocaleString()}원</p>
                    
                    {dish.allergens && (
                      <div className="mb-3">
                        <div className="text-xs text-red-600 mb-1">알레르기 정보</div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {dish.allergens.map(allergen => (
                            <span
                              key={allergen}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                            >
                              {allergen === 'gluten' ? '글루텐' :
                               allergen === 'milk' ? '우유' :
                               allergen === 'egg' ? '계란' : '견과류'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {dish.origin && (
                      <div className="text-xs text-gray-600">
                        원산지: {dish.origin.map(o => `${o.country} ${o.item}`).join(', ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 옵션 선택 */}
            {gameState.selectedDish && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{gameState.selectedDish.img}</div>
                  <h4 className="text-xl font-bold text-gray-900">{gameState.selectedDish.name}</h4>
                  <p className="text-gray-600">옵션을 선택해주세요</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* 매운 정도 */}
                  {gameState.selectedDish.options?.spice && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">매운 정도</h5>
                      <div className="flex space-x-2">
                        {gameState.selectedDish.options.spice.map(level => (
                          <button
                            key={level}
                            onClick={() => selectOption('spice', level)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                              selectedOptions.spice === level
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                            }`}
                          >
                            {level === 0 ? '순한맛' :
                             level === 1 ? '보통맛' :
                             level === 2 ? '매운맛' : '아주매운맛'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 크기 */}
                  {gameState.selectedDish.options?.portion && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">크기</h5>
                      <div className="flex space-x-2">
                        {gameState.selectedDish.options.portion.map(size => (
                          <button
                            key={size}
                            onClick={() => selectOption('portion', size)}
                            className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                              selectedOptions.portion === size
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentStep: 'category' }))}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    뒤로
                  </button>
                  <button
                    onClick={addToCart}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                  >
                    장바구니에 추가
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 매장/포장 선택 화면 */}
        {gameState.currentStep === 'dine-takeout' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">매장 식사 또는 포장을 선택해주세요</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => {
                    setGameState(prev => ({ ...prev, dineOrTakeout: 'dine' }))
                    // 테이블 번호 입력 모달 표시
                    const tableNumber = prompt('테이블 번호를 입력해주세요 (1-20):')
                    if (tableNumber) {
                      setTableNumber(tableNumber)
                      selectDineOrTakeout('dine')
                    }
                  }}
                  className="p-8 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-lg transition-colors"
                >
                  <div className="text-6xl mb-4">🍽️</div>
                  <h4 className="text-xl font-bold text-emerald-800">매장 식사</h4>
                  <p className="text-gray-600 mt-2">테이블 번호를 입력해주세요</p>
                </button>
                
                <button
                  onClick={() => selectDineOrTakeout('takeout')}
                  className="p-8 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors"
                >
                  <div className="text-6xl mb-4">🥡</div>
                  <h4 className="text-xl font-bold text-blue-800">포장</h4>
                  <p className="text-gray-600 mt-2">포장 주문입니다</p>
                </button>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'menu' }))}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  뒤로
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
                <h3 className="text-2xl font-bold text-gray-900">주문 확인</h3>
                <ShoppingCart className="w-8 h-8 text-emerald-600" />
              </div>

              {gameState.cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-xl text-gray-600">장바구니가 비어있습니다</p>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentStep: 'category' }))}
                    className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                  >
                    메뉴 보기
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {gameState.cart.map((item, index) => {
                      const dish = dishes.find(d => d.id === item.dishId)
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{dish?.img}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{dish?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.selected.portion} | {item.selected.spice === 0 ? '순한맛' :
                                 item.selected.spice === 1 ? '보통맛' :
                                 item.selected.spice === 2 ? '매운맛' : '아주매운맛'}
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
                            <div className="text-lg font-bold text-emerald-600">
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
                      <span className="text-2xl font-bold text-emerald-600">
                        {getTotalAmount().toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, currentStep: 'category' }))}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                      >
                        더 주문하기
                      </button>
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, currentStep: 'dine-takeout' }))}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
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
                <CreditCard className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">결제 방법을 선택해주세요</h3>
                <p className="text-gray-600">총 금액: {getTotalAmount().toLocaleString()}원</p>
                <p className="text-sm text-gray-500 mt-2">
                  {gameState.dineOrTakeout === 'dine' ? `테이블 번호: ${gameState.tableNumber}` : '포장 주문'}
                </p>
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
                  <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">결제 처리 중...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 호출벨 번호 화면 */}
        {gameState.currentStep === 'bell' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">주문 완료!</h3>
              
              <div className="bg-emerald-50 rounded-xl p-6 mb-8">
                <Bell className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-emerald-800 mb-2">호출벨 번호</h4>
                <div className="text-6xl font-black text-emerald-600 mb-4">{gameState.bellNumber}</div>
                <p className="text-gray-700">
                  주문이 준비되면 호출벨이 울립니다
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">주문 내역</h4>
                {gameState.cart.map((item, index) => {
                  const dish = dishes.find(d => d.id === item.dishId)
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">
                        {dish?.name} x {item.qty}
                      </span>
                      <span className="font-medium">{item.subTotal.toLocaleString()}원</span>
                    </div>
                  )
                })}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">총 금액</span>
                    <span className="font-bold text-emerald-600">{getTotalAmount().toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={completeGame}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
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
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-emerald-200">
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-emerald-200 max-w-md mx-4">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">식당 주문 완료!</h2>
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-gray-800 mb-2">호출벨 번호: {gameState.bellNumber}</p>
                <p className="text-gray-800 mb-2">주문 수량: {gameState.cart.length}개</p>
                <p className="text-gray-800 mb-2">주문 방식: {
                  gameState.dineOrTakeout === 'dine' ? `매장 식사 (테이블 ${gameState.tableNumber})` : '포장'
                }</p>
                <p className="text-gray-800 mb-2">결제 방법: {
                  gameState.paymentMethod === 'card' ? '카드 결제' :
                  gameState.paymentMethod === 'qr' ? 'QR 결제' : '현금 결제'
                }</p>
                <p className="text-gray-800">총 금액: {getTotalAmount().toLocaleString()}원</p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
