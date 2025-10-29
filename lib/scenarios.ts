export interface Step {
  key: string
  title: string
  timeoutSec: number
  helpText?: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  steps: Step[]
  datasets: any
}

export const scenarios: Record<string, Scenario> = {
  cafe: {
    id: "cafe",
    name: "카페 주문",
    description: "음료 주문부터 결제까지",
    steps: [
      { key: "menu", title: "메뉴 선택", timeoutSec: 90, helpText: "원하는 음료를 고르고 '담기'를 누르세요" },
      { key: "options", title: "옵션 선택", timeoutSec: 60, helpText: "사이즈와 온도를 선택하세요" },
      { key: "cart", title: "장바구니", timeoutSec: 60, helpText: "수량과 옵션을 확인하세요" },
      { key: "name", title: "픽업 이름", timeoutSec: 30, helpText: "픽업할 이름을 입력하세요" },
      { key: "payment", title: "결제", timeoutSec: 120, helpText: "결제 방법을 선택하세요" },
      { key: "receipt", title: "영수증", timeoutSec: 30, helpText: "영수증을 확인하세요" }
    ],
    datasets: {
      menus: [
        { id: "americano", name: "아메리카노", price: 4000, img: "/images/americano.jpg", tags: ["hot", "ice"], allergens: [] },
        { id: "latte", name: "라떼", price: 4500, img: "/images/latte.jpg", tags: ["hot", "ice"], allergens: ["milk"] },
        { id: "cappuccino", name: "카푸치노", price: 4500, img: "/images/cappuccino.jpg", tags: ["hot", "ice"], allergens: ["milk"] },
        { id: "mocha", name: "모카", price: 5000, img: "/images/mocha.jpg", tags: ["hot", "ice"], allergens: ["milk"] },
        { id: "frappe", name: "프라페", price: 5500, img: "/images/frappe.jpg", tags: ["ice"], allergens: ["milk"] },
        { id: "smoothie", name: "스무디", price: 6000, img: "/images/smoothie.jpg", tags: ["ice"], allergens: ["milk"] }
      ],
      options: {
        size: ["S", "M", "L"],
        temperature: ["HOT", "ICE"],
        addOns: [
          { id: "shot", label: "샷 추가", price: 500 },
          { id: "syrup", label: "시럽", price: 300 },
          { id: "whipped", label: "휘핑", price: 500 }
        ],
        sweetness: [0, 25, 50, 75, 100]
      }
    }
  },
  restaurant: {
    id: "restaurant",
    name: "식당 주문",
    description: "음식 주문부터 호출벨까지",
    steps: [
      { key: "category", title: "카테고리 선택", timeoutSec: 60, helpText: "원하는 음식 카테고리를 선택하세요" },
      { key: "menu", title: "메뉴 선택", timeoutSec: 90, helpText: "음식을 선택하고 옵션을 설정하세요" },
      { key: "dinein", title: "매장/포장", timeoutSec: 30, helpText: "매장에서 드실지 포장할지 선택하세요" },
      { key: "cart", title: "주문 확인", timeoutSec: 60, helpText: "주문 내용을 확인하세요" },
      { key: "payment", title: "결제", timeoutSec: 120, helpText: "결제 방법을 선택하세요" },
      { key: "bell", title: "호출벨 번호", timeoutSec: 30, helpText: "호출벨 번호를 확인하세요" }
    ],
    datasets: {
      categories: [
        { id: "main", name: "메인 요리", icon: "🍽️" },
        { id: "noodle", name: "면류", icon: "🍜" },
        { id: "rice", name: "밥류", icon: "🍚" },
        { id: "side", name: "사이드", icon: "🥗" }
      ],
      menus: [
        { id: "pasta", name: "파스타", price: 12000, category: "main", allergens: ["gluten"], origin: [{ country: "이탈리아", item: "파스타" }] },
        { id: "pizza", name: "피자", price: 15000, category: "main", allergens: ["gluten", "milk"], origin: [{ country: "이탈리아", item: "치즈" }] },
        { id: "ramen", name: "라면", price: 8000, category: "noodle", allergens: ["gluten"], origin: [{ country: "한국", item: "면" }] },
        { id: "bibimbap", name: "비빔밥", price: 10000, category: "rice", allergens: [], origin: [{ country: "한국", item: "쌀" }] }
      ]
    }
  },
  photobooth: {
    id: "photobooth",
    name: "포토부스",
    description: "사진 촬영부터 인쇄까지",
    steps: [
      { key: "layout", title: "레이아웃 선택", timeoutSec: 60, helpText: "원하는 사진 레이아웃을 선택하세요" },
      { key: "camera", title: "사진 촬영", timeoutSec: 120, helpText: "카메라를 맞추고 촬영하세요" },
      { key: "edit", title: "편집", timeoutSec: 90, helpText: "필터와 프레임을 선택하세요" },
      { key: "print", title: "인쇄/저장", timeoutSec: 60, helpText: "인쇄하거나 저장하세요" }
    ],
    datasets: {
      layouts: [
        { id: "2cut", name: "2컷", description: "2장의 사진" },
        { id: "4cut", name: "4컷", description: "4장의 사진" },
        { id: "id", name: "증명사진", description: "신분증용 사진" }
      ],
      filters: [
        { id: "normal", name: "일반" },
        { id: "bright", name: "밝게" },
        { id: "dark", name: "어둡게" },
        { id: "grayscale", name: "흑백" }
      ],
      frames: [
        { id: "none", name: "프레임 없음" },
        { id: "heart", name: "하트" },
        { id: "star", name: "별" },
        { id: "flower", name: "꽃" }
      ]
    }
  },
  train: {
    id: "train",
    name: "기차표 예매",
    description: "기차표 예매부터 승차권까지",
    steps: [
      { key: "search", title: "검색", timeoutSec: 120, helpText: "출발지, 도착지, 날짜를 선택하세요" },
      { key: "train", title: "열차 선택", timeoutSec: 90, helpText: "원하는 열차를 선택하세요" },
      { key: "seat", title: "좌석 선택", timeoutSec: 90, helpText: "좌석을 선택하세요" },
      { key: "passenger", title: "승객 정보", timeoutSec: 60, helpText: "승객 정보를 입력하세요" },
      { key: "payment", title: "결제", timeoutSec: 120, helpText: "결제 방법을 선택하세요" },
      { key: "ticket", title: "승차권", timeoutSec: 30, helpText: "승차권을 확인하세요" }
    ],
    datasets: {
      stations: [
        { id: "seoul", name: "서울", code: "SEO" },
        { id: "busan", name: "부산", code: "BUS" },
        { id: "daegu", name: "대구", code: "DAE" },
        { id: "incheon", name: "인천", code: "INC" },
        { id: "gwangju", name: "광주", code: "GWA" },
        { id: "daejeon", name: "대전", code: "DAJ" }
      ],
      classes: [
        { id: "general", name: "일반실", price: 1 },
        { id: "first", name: "특실", price: 1.5 }
      ]
    }
  },
  civil: {
    id: "civil",
    name: "민원발급",
    description: "민원서류 발급 신청",
    steps: [
      { key: "service", title: "업무 선택", timeoutSec: 60, helpText: "발급받을 서류를 선택하세요" },
      { key: "applicant", title: "신청자 구분", timeoutSec: 30, helpText: "본인인지 대리인인지 선택하세요" },
      { key: "identity", title: "본인인증", timeoutSec: 120, helpText: "신분증을 촬영하거나 정보를 입력하세요" },
      { key: "config", title: "발급 설정", timeoutSec: 60, helpText: "발급 옵션을 설정하세요" },
      { key: "payment", title: "수수료 결제", timeoutSec: 90, helpText: "수수료를 결제하세요" },
      { key: "preview", title: "미리보기", timeoutSec: 60, helpText: "발급될 서류를 확인하세요" }
    ],
    datasets: {
      services: [
        { id: "resident", name: "주민등록등본", fee: 1000, requiresIdCapture: true },
        { id: "family", name: "가족관계증명서", fee: 1000, requiresIdCapture: true },
        { id: "tax", name: "납세증명서", fee: 500, requiresIdCapture: false },
        { id: "income", name: "소득증명서", fee: 500, requiresIdCapture: false }
      ]
    }
  },
  delivery: {
    id: "delivery",
    name: "배달앱 주문",
    description: "배달 주문부터 추적까지",
    steps: [
      { key: "address", title: "주소 입력", timeoutSec: 90, helpText: "배달받을 주소를 입력하세요" },
      { key: "store", title: "매장 선택", timeoutSec: 60, helpText: "원하는 매장을 선택하세요" },
      { key: "menu", title: "메뉴 선택", timeoutSec: 120, helpText: "메뉴를 선택하고 장바구니에 담으세요" },
      { key: "cart", title: "주문 확인", timeoutSec: 60, helpText: "주문 내용을 확인하세요" },
      { key: "payment", title: "결제", timeoutSec: 120, helpText: "결제 방법을 선택하세요" },
      { key: "track", title: "주문 추적", timeoutSec: 180, helpText: "주문 상태를 확인하세요" }
    ],
    datasets: {
      stores: [
        { id: "pizza", name: "피자헛", distance: 0.5, eta: 30, rating: 4.5, minOrder: 15000 },
        { id: "chicken", name: "교촌치킨", distance: 0.8, eta: 25, rating: 4.3, minOrder: 12000 },
        { id: "burger", name: "맥도날드", distance: 1.2, eta: 20, rating: 4.0, minOrder: 8000 },
        { id: "chinese", name: "중화반점", distance: 0.7, eta: 35, rating: 4.2, minOrder: 18000 }
      ]
    }
  }
}

export const getScenario = (id: string): Scenario | undefined => {
  return scenarios[id]
}

export const getAllScenarios = (): Scenario[] => {
  return Object.values(scenarios)
}

