# react-chat

React + WebSocket 기반의 실시간 채팅 프로젝트

## 구성

- `frontend/` — React 18 + TypeScript + Vite, 상태 관리는 Zustand
- `backend/` — Express 5 + `ws` 기반 WebSocket 서버

## 시작하기

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

`nodemon`으로 `server.js`를 실행한다.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev 서버가 뜨면 브라우저에서 접속해 채팅을 확인한다.

## 주요 디렉토리

```
frontend/src
├── App.tsx
├── hooks/useChatSocket.ts   # WebSocket 연결 커스텀 훅
├── pages/Test.tsx           # useState/useRef/변수 비교 테스트 페이지
└── store/                   # Zustand 스토어
backend
└── server.js                # Express + ws 서버
```

## 스크립트

### frontend
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 후 프로덕션 빌드
- `npm run lint` — ESLint
- `npm run preview` — 빌드 결과 미리보기

### backend
- `npm run dev` — nodemon으로 서버 실행
