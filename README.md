# react-chat

React + WebSocket 기반의 실시간 채팅 프로젝트  
Google OAuth 2.0 로그인, JWT 인증, HttpOnly 쿠키 적용

## 구성

- `frontend/` — React 18 + TypeScript + Vite, 상태 관리는 Zustand, 라우팅은 React Router
- `backend/` — Express 5 + `ws` 기반 WebSocket 서버, Passport.js Google OAuth, JWT 인증

## 시작하기

### 사전 준비

1. [Google Cloud Console](https://console.cloud.google.com)에서 OAuth 앱 등록
2. `backend/.env` 파일 생성

```env
NODE_ENV=development
GOOGLE_CLIENT_ID=발급받은_클라이언트_ID
GOOGLE_CLIENT_SECRET=발급받은_클라이언트_시크릿
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=랜덤_문자열
```

3. `frontend/.env` 파일 생성

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 → Google 로그인 → 채팅

## 주요 디렉토리

```
frontend/src
├── App.tsx
├── pages/
│   ├── LoginPage.tsx         Google 로그인 버튼 페이지
│   └── ChatPage.tsx          헤더(프로필/로그아웃) + 채팅 레이아웃
├── components/
│   ├── Chat.tsx              채팅 UI + 입력/전송 처리
│   └── ProtectedRoute.tsx    로그인 여부 확인 후 라우트 보호
├── hooks/
│   └── useChatSocket.ts      WebSocket 연결 커스텀 훅
├── store/
│   ├── useChatStore.ts       채팅 메시지 전역 상태
│   └── useUserStore.ts       로그인 유저 정보 전역 상태
└── types/
    └── chat.ts               WireMessage(통신용) / ChatMessage(화면용)

backend/
├── server.js                 서버 시작 (포트 열기)
├── app.js                    Express 설정, 미들웨어 연결
├── routes/
│   └── auth.js               인증 라우트 (/auth/google, /auth/me, /auth/logout)
├── controllers/
│   └── authController.js     Google OAuth 전략, JWT 발급, 로그아웃
└── middleware/
    └── verifyToken.js        JWT 유효성 검증 미들웨어
```

## 동작 개요

### 인증
- Google OAuth 2.0으로 로그인
- 로그인 성공 시 JWT(accessToken 1h / refreshToken 7d) 발급
- HttpOnly 쿠키로 저장 → JS 접근 불가, XSS 방어
- ProtectedRoute가 /auth/me 호출해 페이지 진입 전 인증 확인

### 채팅
- 클라가 보낸 메시지는 서버가 내용을 해석하지 않고 모든 클라이언트에 broadcast
- 본인 메시지도 서버 echo로 돌아와 단일 경로로 처리 (낙관적 업데이트 불필요)
- 통신 포맷(`WireMessage`)과 화면 모델(`ChatMessage`)을 타입으로 분리

## 스크립트

### frontend
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 후 프로덕션 빌드
- `npm run lint` — ESLint
- `npm run preview` — 빌드 결과 미리보기

### backend
- `npm run dev` — nodemon으로 서버 실행
