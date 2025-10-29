export interface PaymentMethod {
  type: 'card' | 'qr' | 'cash'
  name: string
  icon: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  receiptData?: any
}

export interface CardPaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  pin: string
}

export class PaymentManager {
  private paymentMethods: PaymentMethod[] = [
    { type: 'card', name: '카드 결제', icon: '💳' },
    { type: 'qr', name: 'QR 결제', icon: '📱' },
    { type: 'cash', name: '현금 결제', icon: '💰' }
  ]

  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods
  }

  async processCardPayment(
    amount: number,
    cardData: CardPaymentData,
    attempts: number = 0
  ): Promise<PaymentResult> {
    // 모의 카드 결제 처리
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 대기
    
    // PIN 검증 (간단한 모의 검증)
    if (cardData.pin !== '1234' && attempts < 3) {
      return {
        success: false,
        error: `PIN이 올바르지 않습니다. (${attempts + 1}/3)`
      }
    }
    
    if (attempts >= 3) {
      return {
        success: false,
        error: 'PIN 입력 횟수를 초과했습니다. 다른 결제 방법을 사용해주세요.'
      }
    }

    const transactionId = `TXN_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      receiptData: {
        amount,
        method: '카드',
        cardNumber: cardData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
        timestamp: new Date().toISOString()
      }
    }
  }

  async processQRPayment(amount: number): Promise<PaymentResult> {
    // 모의 QR 결제 처리
    await new Promise(resolve => setTimeout(resolve, 3000)) // 3초 대기
    
    const transactionId = `QR_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      receiptData: {
        amount,
        method: 'QR',
        timestamp: new Date().toISOString()
      }
    }
  }

  async processCashPayment(
    amount: number,
    insertedAmount: number
  ): Promise<PaymentResult> {
    if (insertedAmount < amount) {
      return {
        success: false,
        error: `금액이 부족합니다. 추가로 ${amount - insertedAmount}원이 필요합니다.`
      }
    }

    const change = insertedAmount - amount
    
    // 거스름돈 계산 퀴즈
    const quizResult = await this.calculateChangeQuiz(change)
    
    if (!quizResult) {
      return {
        success: false,
        error: '거스름돈 계산을 다시 시도해주세요.'
      }
    }

    const transactionId = `CASH_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      receiptData: {
        amount,
        method: '현금',
        insertedAmount,
        change,
        timestamp: new Date().toISOString()
      }
    }
  }

  private async calculateChangeQuiz(change: number): Promise<boolean> {
    return new Promise((resolve) => {
      // 간단한 거스름돈 계산 퀴즈
      const quiz = {
        question: `거스름돈은 ${change}원입니다. 맞나요?`,
        answer: change
      }
      
      // 실제로는 모달이나 컴포넌트에서 처리
      // 여기서는 간단히 true 반환
      resolve(true)
    })
  }

  generateReceipt(receiptData: any): string {
    const receipt = `
=== 영수증 ===
결제일시: ${new Date(receiptData.timestamp).toLocaleString('ko-KR')}
결제방법: ${receiptData.method}
결제금액: ${receiptData.amount.toLocaleString()}원
${receiptData.method === '현금' ? `투입금액: ${receiptData.insertedAmount.toLocaleString()}원\n거스름돈: ${receiptData.change.toLocaleString()}원` : ''}
거래번호: ${receiptData.transactionId}
================
    `.trim()
    
    return receipt
  }

  async downloadReceipt(receiptData: any): Promise<void> {
    const receipt = this.generateReceipt(receiptData)
    const blob = new Blob([receipt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt_${receiptData.transactionId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }
}

export const paymentManager = new PaymentManager()

