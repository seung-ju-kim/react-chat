import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

type Props = {
  children: React.ReactNode;
};

/**
 * 로그인한 사람만 접근 가능한 페이지를 감싸는 컴포넌트.
 * /auth/me 로 쿠키 유효성 확인 → 실패 시 /login 으로 리다이렉트.
 * credentials: 'include' 는 쿠키를 요청에 포함시키기 위해 필요.
 */
export default function ProtectedRoute({ children }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setStatus('ok');
      })
      .catch(() => setStatus('fail'));
  }, [setUser]);

  if (status === 'loading') return <div>로딩 중...</div>;
  // 토큰 없거나 만료 → 로그인 페이지로
  if (status === 'fail') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
