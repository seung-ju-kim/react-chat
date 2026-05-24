import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import authRouter from './routes/auth.js';
import './controllers/authController.js'; // Google OAuth 전략 등록

dotenv.config();

const app = express();

// 프론트(5173) → 백엔드(3000) 요청 허용
// credentials: true 는 쿠키 포함 요청을 허용하기 위해 필요
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// 요청에 포함된 쿠키를 파싱해 req.cookies 로 접근 가능하게 함
app.use(cookieParser());

// Passport 초기화 (session 없이 JWT + 쿠키 방식으로 사용)
app.use(passport.initialize());

app.get('/', (_req, res) => {
  res.send('backend works');
});

// /auth 하위 라우트를 authRouter에 위임
app.use('/auth', authRouter);

export default app;
