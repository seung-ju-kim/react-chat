import jwt from 'jsonwebtoken';

/**
 * 보호된 라우트에 붙이는 미들웨어.
 * 요청의 쿠키에서 accessToken 꺼내서 유효성 검증.
 * 유효하면 req.user 에 유저 정보 담고 다음 단계로 넘김(next).
 * 없거나 만료됐으면 401 반환.
 */
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: '토큰 없음' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: '토큰 만료 또는 유효하지 않음' });
  }
};

export default verifyToken;
