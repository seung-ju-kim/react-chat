import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import app from './app.js';

/**
 * Express app(app)만으로는 WebSocket을 붙일 수 없음.
 * http 서버를 별도로 만들고, 그 위에 WebSocket 서버를 함께 올리는 구조.
 * → HTTP 요청(REST API)과 WebSocket 연결을 같은 포트(3000)에서 처리 가능.
 */
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('client connected');

  ws.on('message', (message) => {
    const messageStr = message.toString();

    // 받은 메시지를 내용 해석 없이 접속 중인 모든 클라이언트에 broadcast
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  });

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running on 3000');
});
