// const express = require('express');
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();

/*
왜 http 서버 따로 만드냐?

Express 앱(app)만으로는
WebSocket 붙이기 어려움

HTTP 서버 위에
WebSocket 서버를 붙임
*/
const server = http.createServer(app);

/* 
WebSocket 서버 생성
*/
const wss = new WebSocketServer({
  server
});

/*
HTTP 테스트용
브라우저에서 localhost:3000 들어가면 확인 가능
*/
app.get('/', (req, res) => {
  res.send('backend works');
});

/* 
클라이언트 연결 감지
*/
wss.on('connection', (ws) => {
  console.log('client connected');

  // 접속 즉시 서버가 메시지 보냄
  ws.send('hello from server');

  /* 
  클라이언트 메시지 받기
  */
  ws.on('message', (message) => {
    console.log('client says:', message.toString());

    // 응답 보내기
    ws.send('server received your message');
  });

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

/* 
중요!
app.listen 아님

server.listen.
*/
server.listen(3000, () => {
  console.log('server running on 3000');
});