import './App.css'
import './hooks/useChatSocket';
import { useChatSocket } from './hooks/useChatSocket';

import useChatStore from './store/useChatStore';

function App() {
  // WebSocket 연결 설정
  // TODO: URL은 환경변수로 관리하는 게 좋음!
  useChatSocket('ws://localhost:3000')

  // Zustand store에서 메시지 상태 가져오기
  const messages = useChatStore((state) => state.messages);

  return (
    <div>
      <h1>Chat Messages Test!</h1>
      <p>
        count: {messages.length}
      </p>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
