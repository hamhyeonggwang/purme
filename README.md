# Link IT - 학령기 아동을 위한 전산화 인지재활 프로그램

## 프로젝트 개요

Link IT은 학령기 아동(7-15세)을 위한 전산화 인지재활 기반 지역사회 참여 증진 프로그램입니다.

### 핵심 목표
전산화 인지훈련을 통해 '생각하기 → 상호작용하기 → 참여하기'로 이어지는 인지 참여 사슬(cognitive participation chain)을 형성

### 주요 기능
- 시지각 훈련 모듈
- 인지 훈련모듈  
- 키오스크 응용 훈련 모듈
- 데이터 분석 및 시각화
- 가정 연계 프로그램

## 기술 스택

### Frontend
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Node.js + Express
- Firebase/Supabase
- Socket.io

### 개발 도구
- ESLint
- Prettier
- Concurrently

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env.local
# .env.local 파일을 편집하여 실제 값 입력
```

### 3. 개발 서버 실행
```bash
# 프론트엔드와 백엔드 동시 실행
npm run dev:full

# 또는 개별 실행
npm run dev      # 프론트엔드 (포트 3000)
npm run server   # 백엔드 (포트 3001)
```

## 프로젝트 구조

```
link-it/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── cognitive/         # 인지 훈련 컴포넌트
│   ├── kiosk/             # 키오스크 시뮬레이션
│   └── dashboard/         # 대시보드 컴포넌트
├── lib/                   # 유틸리티 함수
├── hooks/                 # 커스텀 훅
├── store/                 # 상태 관리
├── types/                 # TypeScript 타입 정의
├── server/                # Express 백엔드
└── public/                # 정적 파일
```

## 주요 모듈

### 1. 시지각 훈련 모듈
- 형태 지각
- 공간 지각
- 시각 기억
- 시각 운동 협응

### 2. 인지 훈련모듈
- 주의 집중
- 작업 기억
- 문제 해결
- 계획 수립

### 3. 키오스크 응용 훈련
- 편의점 무인결제 시뮬레이션
- 도서 대여 시스템
- 교통카드 사용 훈련

## 라이선스

MIT License

## 개발팀

푸르메재단 넥슨어린이재활병원 학령기치료팀

