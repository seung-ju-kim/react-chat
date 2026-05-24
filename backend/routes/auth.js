import express from 'express';
import passport from 'passport';
import { googleCallback, getMe, logout, authFailure } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Google 로그인 페이지로 리다이렉트
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google 로그인 완료 후 콜백 → JWT 쿠키 발급
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  googleCallback
);

// 로그인 상태 확인 (토큰 유효한 사람만 통과)
router.get('/me', verifyToken, getMe);

router.post('/logout', logout);

router.get('/failure', authFailure);

export default router;
