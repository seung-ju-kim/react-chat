import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import useUserStore from '../store/useUserStore';

export default function ChatPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  /**
   * [WHAT] 로그아웃 처리
   * [HOW] 백엔드 /auth/logout 호출 → HttpOnly 쿠키 삭제
   *       → store 초기화 → /login 으로 이동
   * [WHY] 쿠키는 JS로 직접 삭제 불가(HttpOnly)이므로 반드시 백엔드를 통해야 함
   */
  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    clearUser();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      {/* 헤더: 앱 이름 + 프로필 사진 + 유저 이름 + 로그아웃 버튼 */}
      <header style={styles.header}>
        <span style={styles.appName}>💬 React Chat</span>
        <div style={styles.userArea}>
          {user?.photo && (
            <img src={user.photo} alt="프로필" style={styles.avatar} />
          )}
          <span style={styles.userName}>{user?.name}</span>
          <button style={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>
      <main style={styles.main}>
        <Chat />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '56px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
    flexShrink: 0,
  },
  appName: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  logoutButton: {
    padding: '6px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    fontSize: '13px',
    color: '#666',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
  },
};
