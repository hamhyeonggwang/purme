'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, HelpCircle, RotateCcw } from 'lucide-react'
import { useSessionStore } from '../../../store/session'
import { getScenario } from '../../../lib/scenarios'
import { Button, Stepper, Modal, Keypad, Toast } from '../../../components/ui'
import { paymentManager } from '../../../lib/payments'

interface MenuItem {
  id: string
  name: string
  price: number
  img: string
  tags: string[]
  allergens: string[]
}

interface CartItem {
  menuId: string
  name: string
  qty: number
  size: string
  temperature: string
  addOns: string[]
  sweetness: number
  unitPrice: number
  subTotal: number
}

export default function CafeKiosk() {
  const {
    currentSession,
    startSession,
    updateSession,
    nextStep,
    previousStep,
    logAction,
    logError,
    useAssist,
    isEasyMode
  } = useSessionStore()

  const [currentStep, setCurrentStep] = useState('menu')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
  const [pickupName, setPickupName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const scenario = getScenario('cafe')
  if (!scenario) return null

  const steps = scenario.steps
  const menus = scenario.datasets.menus as MenuItem[]
  const options = scenario.datasets.options

  useEffect(() => {
    if (!currentSession) {
      startSession('cafe')
    }
  }, [currentSession, startSession])

  const handleMenuSelect = (menu: MenuItem) => {
    setSelectedMenu(menu)
    setCurrentStep('options')
    logAction('menu_select', { menuId: menu.id })
  }

  const handleAddToCart = (menu: MenuItem, selectedOptions: any) => {
    const cartItem: CartItem = {
      menuId: menu.id,
      name: menu.name,
      qty: 1,
      size: selectedOptions.size || 'M',
      temperature: selectedOptions.temperature || 'ICE',
      addOns: selectedOptions.addOns || [],
      sweetness: selectedOptions.sweetness || 50,
      unitPrice: menu.price,
      subTotal: menu.price
    }

    setCart([...cart, cartItem])
    setCurrentStep('cart')
    setSelectedMenu(null)
    logAction('add_to_cart', { menuId: menu.id, options: selectedOptions })
  }

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty <= 0) {
      const newCart = cart.filter((_, i) => i !== index)
      setCart(newCart)
    } else {
      const newCart = [...cart]
      newCart[index].qty = newQty
      newCart[index].subTotal = newCart[index].unitPrice * newQty
      setCart(newCart)
    }
    logAction('quantity_change', { index, newQty })
  }

  const handlePayment = async (method: string) => {
    setPaymentMethod(method)
    setShowPaymentModal(true)
    
    const totalAmount = cart.reduce((sum, item) => sum + item.subTotal, 0)
    
    try {
      let result
      if (method === 'card') {
        result = await paymentManager.processCardPayment(totalAmount, {
          cardNumber: '1234-5678-9012-3456',
          expiryDate: '12/25',
          cvv: '123',
          pin: '1234'
        })
      } else if (method === 'qr') {
        result = await paymentManager.processQRPayment(totalAmount)
      } else if (method === 'cash') {
        result = await paymentManager.processCashPayment(totalAmount, totalAmount + 1000)
      }

      if (result?.success) {
        setCurrentStep('receipt')
        setShowPaymentModal(false)
        logAction('payment_success', { method, amount: totalAmount })
        updateSession({ paymentResult: result })
      } else {
        setToastMessage(result?.error || '결제에 실패했습니다')
        setShowToast(true)
        logError('payment_failed', result?.error || 'Unknown error')
      }
    } catch (error) {
      setToastMessage('결제 중 오류가 발생했습니다')
      setShowToast(true)
      logError('payment_error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleHelp = () => {
    setShowHelp(true)
    useAssist()
  }

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subTotal, 0)
  }

  const renderMenuStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        메뉴를 선택하세요
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {menus.map((menu) => (
          <motion.button
            key={menu.id}
            onClick={() => handleMenuSelect(menu)}
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
            <h3 className={`font-bold ${isEasyMode ? 'text-xl' : 'text-lg'} text-gray-900`}>
              {menu.name}
            </h3>
            <p className={`${isEasyMode ? 'text-lg' : 'text-base'} text-blue-600 font-semibold`}>
              {menu.price.toLocaleString()}원
            </p>
            {menu.allergens.length > 0 && (
              <p className="text-sm text-red-600">
                알레르기: {menu.allergens.join(', ')}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )

  const renderOptionsStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        옵션을 선택하세요
      </h2>
      
      {selectedMenu && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-gray-900 mb-4`}>
            {selectedMenu.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block font-semibold ${isEasyMode ? 'text-xl' : 'text-lg'} text-gray-700 mb-2`}>
                사이즈
              </label>
              <div className="flex space-x-2">
                {options.size.map((size) => (
                  <Button
                    key={size}
                    variant="secondary"
                    size={isEasyMode ? 'md' : 'sm'}
                    className="flex-1"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className={`block font-semibold ${isEasyMode ? 'text-xl' : 'text-lg'} text-gray-700 mb-2`}>
                온도
              </label>
              <div className="flex space-x-2">
                {options.temperature.map((temp) => (
                  <Button
                    key={temp}
                    variant="secondary"
                    size={isEasyMode ? 'md' : 'sm'}
                    className="flex-1"
                  >
                    {temp}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <Button
              onClick={() => setCurrentStep('menu')}
              variant="secondary"
              size={isEasyMode ? 'lg' : 'md'}
              className="flex-1"
            >
              이전
            </Button>
            <Button
              onClick={() => handleAddToCart(selectedMenu, {})}
              size={isEasyMode ? 'lg' : 'md'}
              className="flex-1"
            >
              장바구니에 담기
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const renderCartStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        장바구니
      </h2>
      
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold ${isEasyMode ? 'text-xl' : 'text-lg'} text-gray-900`}>
                  {item.name}
                </h3>
                <p className="text-gray-600">
                  {item.size} / {item.temperature}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleQuantityChange(index, item.qty - 1)}
                    variant="secondary"
                    size="sm"
                  >
                    -
                  </Button>
                  <span className={`font-bold ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                    {item.qty}
                  </span>
                  <Button
                    onClick={() => handleQuantityChange(index, item.qty + 1)}
                    variant="secondary"
                    size="sm"
                  >
                    +
                  </Button>
                </div>
                <span className={`font-bold ${isEasyMode ? 'text-xl' : 'text-lg'} text-blue-600`}>
                  {item.subTotal.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-gray-900`}>
            총 금액
          </span>
          <span className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-blue-600`}>
            {getTotalAmount().toLocaleString()}원
          </span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button
          onClick={() => setCurrentStep('menu')}
          variant="secondary"
          size={isEasyMode ? 'lg' : 'md'}
          className="flex-1"
        >
          메뉴 추가
        </Button>
        <Button
          onClick={() => setCurrentStep('name')}
          size={isEasyMode ? 'lg' : 'md'}
          className="flex-1"
          disabled={cart.length === 0}
        >
          주문하기
        </Button>
      </div>
    </div>
  )

  const renderNameStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        픽업 이름을 입력하세요
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <input
          type="text"
          value={pickupName}
          onChange={(e) => setPickupName(e.target.value)}
          placeholder="이름을 입력하세요"
          className={`w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none ${
            isEasyMode ? 'text-xl' : 'text-lg'
          }`}
          maxLength={10}
        />
      </div>
      
      <div className="flex space-x-4">
        <Button
          onClick={() => setCurrentStep('cart')}
          variant="secondary"
          size={isEasyMode ? 'lg' : 'md'}
          className="flex-1"
        >
          이전
        </Button>
        <Button
          onClick={() => setCurrentStep('payment')}
          size={isEasyMode ? 'lg' : 'md'}
          className="flex-1"
          disabled={!pickupName.trim()}
        >
          다음
        </Button>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        결제 방법을 선택하세요
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => handlePayment('card')}
          size={isEasyMode ? 'lg' : 'md'}
          className="h-20 flex items-center justify-center space-x-4"
        >
          <span className="text-3xl">💳</span>
          <span>카드 결제</span>
        </Button>
        <Button
          onClick={() => handlePayment('qr')}
          size={isEasyMode ? 'lg' : 'md'}
          className="h-20 flex items-center justify-center space-x-4"
        >
          <span className="text-3xl">📱</span>
          <span>QR 결제</span>
        </Button>
        <Button
          onClick={() => handlePayment('cash')}
          size={isEasyMode ? 'lg' : 'md'}
          className="h-20 flex items-center justify-center space-x-4"
        >
          <span className="text-3xl">💰</span>
          <span>현금 결제</span>
        </Button>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-gray-900`}>
            결제 금액
          </span>
          <span className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-blue-600`}>
            {getTotalAmount().toLocaleString()}원
          </span>
        </div>
      </div>
      
      <Button
        onClick={() => setCurrentStep('name')}
        variant="secondary"
        size={isEasyMode ? 'lg' : 'md'}
        className="w-full"
      >
        이전
      </Button>
    </div>
  )

  const renderReceiptStep = () => (
    <div className="space-y-6">
      <h2 className={`text-center font-bold ${isEasyMode ? 'text-3xl' : 'text-2xl'} text-gray-900`}>
        주문 완료!
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={`font-bold ${isEasyMode ? 'text-2xl' : 'text-xl'} text-gray-900`}>
            주문이 완료되었습니다
          </h3>
          <p className={`${isEasyMode ? 'text-lg' : 'text-base'} text-gray-600 mt-2`}>
            픽업 이름: {pickupName}
          </p>
        </div>
        
        <div className="space-y-2">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} x{item.qty}</span>
              <span>{item.subTotal.toLocaleString()}원</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold">
            <span>총 금액</span>
            <span>{getTotalAmount().toLocaleString()}원</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button
          onClick={() => window.location.reload()}
          variant="secondary"
          size={isEasyMode ? 'lg' : 'md'}
          className="flex-1"
        >
          새 주문
        </Button>
        <Link href="/kiosk-training" className="flex-1">
          <Button
            size={isEasyMode ? 'lg' : 'md'}
            className="w-full"
          >
            홈으로
          </Button>
        </Link>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'menu':
        return renderMenuStep()
      case 'options':
        return renderOptionsStep()
      case 'cart':
        return renderCartStep()
      case 'name':
        return renderNameStep()
      case 'payment':
        return renderPaymentStep()
      case 'receipt':
        return renderReceiptStep()
      default:
        return renderMenuStep()
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${
      isEasyMode ? 'p-6' : 'p-4'
    }`}>
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40 mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kiosk-training" className="text-gray-700 hover:text-blue-600 transition-colors">
                <ArrowLeft className={isEasyMode ? 'w-8 h-8' : 'w-6 h-6'} />
              </Link>
              <div>
                <h1 className={`font-bold text-gray-900 ${isEasyMode ? 'text-3xl' : 'text-2xl'}`}>
                  카페 주문
                </h1>
                <p className={`text-gray-600 ${isEasyMode ? 'text-lg' : 'text-sm'}`}>
                  맛있는 음료를 주문해보세요
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleHelp}
                className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isEasyMode ? 'text-lg' : 'text-base'
                }`}
              >
                <HelpCircle className={isEasyMode ? 'w-6 h-6' : 'w-4 h-4'} />
                <span>도움말</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl">
        {/* 진행 단계 */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            isEasyMode={isEasyMode}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {renderCurrentStep()}
        </div>
      </div>

      {/* 결제 모달 */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="결제 진행"
        size="md"
        isEasyMode={isEasyMode}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">💳</div>
          <p className={`${isEasyMode ? 'text-xl' : 'text-lg'} text-gray-600 mb-6`}>
            결제를 진행하고 있습니다...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </Modal>

      {/* 도움말 모달 */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="도움말"
        size="lg"
        isEasyMode={isEasyMode}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className={`font-bold ${isEasyMode ? 'text-xl' : 'text-lg'} text-blue-800 mb-2`}>
              현재 단계: {steps.find(s => s.key === currentStep)?.title}
            </h3>
            <p className={`${isEasyMode ? 'text-lg' : 'text-base'} text-blue-700`}>
              {steps.find(s => s.key === currentStep)?.helpText}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className={`font-semibold ${isEasyMode ? 'text-lg' : 'text-base'} text-gray-900`}>
              사용 방법:
            </h4>
            <ul className={`space-y-1 ${isEasyMode ? 'text-lg' : 'text-base'} text-gray-700`}>
              <li>• 화면의 버튼을 터치하여 선택하세요</li>
              <li>• 이전 버튼으로 단계를 되돌릴 수 있습니다</li>
              <li>• 도움말 버튼으로 언제든지 도움을 받을 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 토스트 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setShowToast(false)}
          isEasyMode={isEasyMode}
        />
      )}
    </div>
  )
}
