import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * 라우팅 구조
 *   /login       → 로그인 페이지 (쿠키 있으면 /chat 으로 자동 이동)
 *   /chat        → 채팅 페이지 (ProtectedRoute로 보호 — 토큰 없으면 /login 으로)
 *   그 외 경로   → /login 으로 리다이렉트
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
