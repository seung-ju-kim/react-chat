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
├── components/
│   └── Chat.tsx              # 채팅 UI + 입력/전송 처리
├── hooks/
│   └── useChatSocket.ts      # WebSocket 연결 커스텀 훅 (송수신 콜백 위임)
├── store/
│   └── useChatStore.ts       # Zustand 채팅 메시지 스토어
├── types/
│   └── chat.ts               # WireMessage(통신용) / ChatMessage(화면용)
└── pages/Test.tsx            # useState/useRef/변수 비교 테스트 페이지
backend
└── server.js                 # Express + ws 서버 (메시지 broadcast)
```

## 동작 개요

- 클라가 보낸 메시지는 서버가 **내용을 해석하지 않고 모든 클라이언트에 broadcast**.
- 본인 메시지도 서버 echo로 돌아와 단일 경로로 처리 (낙관적 업데이트 불필요).
- 탭별 식별을 위해 `myId`를 `sessionStorage`에 저장 → 두 탭으로 송수신 테스트 가능.
- 통신 포맷(`WireMessage`)과 화면 모델(`ChatMessage`)을 타입으로 분리.

## 스크립트

### frontend
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 후 프로덕션 빌드
- `npm run lint` — ESLint
- `npm run preview` — 빌드 결과 미리보기

### backend
- `npm run dev` — nodemon으로 서버 실행
