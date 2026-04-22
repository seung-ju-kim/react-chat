import './App.css'
import './hooks/useChatSocket';
import { useChatSocket } from './hooks/useChatSocket';

import useChatStore from './store/useChatStore';

function App() {
  /**
   * [WHAT] 메시지 추가 action
   * [WHY] 상태 변경은 Store에서만 일어나도록 하기 위함
   * [WHEN] 컴포넌트 렌더 시 초기화
   */
  const addMessage = useChatStore((state) => state.addMessage);

  /**
   * [WHAT] 채팅 메시지 목록
   */
  const messages = useChatStore((state) => state.messages);

  /**
   * [WHAT] WebSocket 연결
   * TODO: URL은 환경변수로 관리하는 게 좋음!
   */
  const { isConnected } = useChatSocket(
    'ws://localhost:3000',
    (msg) => {
      /**
       * [WHEN] 서버에서 메시지를 수신했을 때 실행
       * [WHY] Hook에서 전달된 메시지를 Store에 반영하기 위함
       * [HOW] addMessage 호출
       */
      addMessage({
        id: Date.now().toString(),
        text: msg
      });
    }
  );




  return (
    <div>
      <h1>Chat Messages Test!</h1>
      <p>
        WebSocket 연결 상태: {isConnected ? (<b>연결됨</b>) : <b>연결 끊김</b>}
      </p>

      {!isConnected && messages.length === 0 && <p>서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.</p>}

      {isConnected && messages.length !== 0 && (
        <>
          <p>count: {messages.length}</p>
          <div>
            {messages.map((msg) => (
              <p key={msg.id}>{msg.text}</p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
