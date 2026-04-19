import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => { 
    const socket = new WebSocket('ws://localhost:3000');

    // 연결 성공
    socket.onopen = () => {
      console.log('connected to websocket server');
      // 서버 메시지 받기
      socket.send('hello from react');
    };

    // 서버 메시지 받기
    socket.onmessage = ((event) => {
      console.log(
        'message from server:',
        event.data
      );
    });

    socket.onclose = () => {
      console.log('socket closed');
    };

    // 컴포넌트 종료 시 정리
    return () => {
      socket.close();
    }
  }, []);

  return (
    <div>
      <h1>WebSocket Test!</h1>
    </div>
  )
}

export default App
