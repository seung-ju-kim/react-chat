import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';

// app.js보다 먼저 실행되므로 여기서도 dotenv 로드 필요
dotenv.config();

// Google OAuth 전략 등록
// Google 로그인 성공 시 profile(이름, 이메일, 사진)을 done()으로 넘김
// _accessToken, _refreshToken 은 Google API 사용 시 필요하나 지금은 사용 안 함
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (_accessToken, _refreshToken, profile, done) => {
    return done(null, profile);
  }
));

const isProduction = process.env.NODE_ENV === 'production';

// 로컬: secure false + sameSite lax (localhost 동일 도메인)
// 배포: secure true + sameSite none (다른 도메인 간 쿠키 허용)
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

// Google 로그인 완료 후 호출
// profile에서 이름/이메일/사진 꺼내 JWT 2개 발급 후 HttpOnly 쿠키로 저장
export const googleCallback = (req, res) => {
  const user = req.user;

  const payload = {
    name: user.displayName,
    email: user.emails[0].value,
    photo: user.photos[0].value,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 });         // 1시간
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7일

  res.redirect('http://localhost:5173/chat');
};

// verifyToken 미들웨어를 통과한 유저 정보를 그대로 응답
export const getMe = (req, res) => {
  res.json({ user: req.user });
};

// 쿠키 2개 삭제 → 로그아웃 처리
export const logout = (_req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: '로그아웃 완료' });
};

export const authFailure = (_req, res) => {
  res.status(401).json({ message: 'Google 로그인 실패' });
};
