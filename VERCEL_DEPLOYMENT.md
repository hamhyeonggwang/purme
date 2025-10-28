# Vercel 배포 가이드

## 1. 사전 준비

### MongoDB Atlas 설정
1. [MongoDB Atlas](https://www.mongodb.com/atlas)에서 계정 생성
2. 새로운 클러스터 생성 (M0 무료 티어 권장)
3. 데이터베이스 사용자 생성
4. 네트워크 접근 설정 (0.0.0.0/0으로 모든 IP 허용)
5. 연결 문자열 복사

### Vercel 계정 설정
1. [Vercel](https://vercel.com)에서 계정 생성
2. GitHub 저장소 연결

## 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

```bash
# MongoDB 설정
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkit?retryWrites=true&w=majority

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# 서버 설정
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app

# Vercel 환경 변수
VERCEL=1
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# 보안 설정
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=120

# API 제한 설정
API_RATE_LIMIT_WINDOW=15
API_RATE_LIMIT_MAX=100
LOGIN_RATE_LIMIT_MAX=5

# 관리자 계정
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@linkit.com
ADMIN_PASSWORD=admin123!
```

## 3. 배포 과정

### 자동 배포
1. GitHub에 코드 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 환경 변수 설정 후 재배포

### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

## 4. Vercel 제한사항 및 해결방법

### 파일 시스템 제한
- **문제**: Vercel은 읽기 전용 파일 시스템을 사용
- **해결**: 백업 파일은 `/tmp` 디렉토리에 저장 (임시적)
- **대안**: MongoDB Atlas 백업 또는 외부 스토리지 사용

### MongoDB 덤프 제한
- **문제**: `mongodump`/`mongorestore` 명령어 사용 불가
- **해결**: JSON 백업만 사용 가능
- **대안**: MongoDB Atlas의 자동 백업 기능 활용

### 실행 시간 제한
- **문제**: 서버리스 함수는 최대 30초 실행 제한
- **해결**: 긴 작업은 비동기 처리 또는 큐 시스템 사용

### 메모리 제한
- **문제**: 최대 1GB 메모리 제한
- **해결**: 대용량 데이터 처리는 청크 단위로 분할

## 5. 배포 후 확인사항

### 1. 헬스 체크
```bash
curl https://your-domain.vercel.app/api/health
```

### 2. 관리자 계정 확인
- 관리자 로그인 테스트
- 사용자 관리 기능 확인

### 3. 데이터베이스 연결 확인
- MongoDB Atlas 연결 상태 확인
- 데이터 CRUD 작업 테스트

### 4. API 엔드포인트 테스트
```bash
# 인증 테스트
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}'

# 훈련 세션 테스트
curl -X POST https://your-domain.vercel.app/api/training/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"trainingType":"basic","module":"color_matching","difficulty":"easy"}'
```

## 6. 모니터링 및 로깅

### Vercel Analytics
- 페이지 뷰 및 성능 모니터링
- 사용자 행동 분석

### 로그 확인
```bash
# Vercel CLI로 로그 확인
vercel logs https://your-domain.vercel.app
```

### 에러 모니터링
- Vercel 대시보드에서 에러 로그 확인
- MongoDB Atlas에서 연결 상태 모니터링

## 7. 백업 전략

### 자동 백업
- MongoDB Atlas 자동 백업 활용
- 일일 스냅샷 생성

### 수동 백업
- JSON 형태로 데이터 내보내기
- 관리자 대시보드에서 백업 실행

### 복원 절차
1. MongoDB Atlas에서 스냅샷 복원
2. 또는 JSON 백업 파일로 데이터 복원

## 8. 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 사용

### 코드 분할
- 동적 import 사용
- 페이지별 번들 최적화

### 캐싱 전략
- Vercel Edge Functions 활용
- CDN 캐싱 설정

## 9. 보안 고려사항

### 환경 변수 보안
- 민감한 정보는 환경 변수로 관리
- Vercel 대시보드에서 안전하게 설정

### API 보안
- Rate limiting 적용
- CORS 설정 확인
- JWT 토큰 보안

### 데이터 보안
- MongoDB Atlas 네트워크 접근 제한
- 데이터 암호화 설정

## 10. 문제 해결

### 일반적인 문제들

#### MongoDB 연결 실패
```bash
# 연결 문자열 확인
echo $MONGODB_URI

# 네트워크 접근 설정 확인
# MongoDB Atlas에서 IP 화이트리스트 확인
```

#### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 확인
npm install
```

#### 환경 변수 문제
```bash
# 환경 변수 확인
vercel env ls

# 환경 변수 설정
vercel env add VARIABLE_NAME
```

### 지원 및 문의
- Vercel 문서: https://vercel.com/docs
- MongoDB Atlas 문서: https://docs.atlas.mongodb.com
- Next.js 문서: https://nextjs.org/docs
