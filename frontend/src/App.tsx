import './App.css'
import './hooks/useChatSocket';
import { useChatSocket } from './hooks/useChatSocket';

function App() {
  // 커스텀 훅 사용
  // TODO: URL은 환경변수로 관리하는 게 좋음!
  useChatSocket('ws://localhost:3000')

  return (
    <div>
      <h1>WebSocket Test!</h1>
    </div>
  )
}

export default App
