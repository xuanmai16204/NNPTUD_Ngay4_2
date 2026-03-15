const { verify } = require('../lib/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Thiếu token. Gửi header: Authorization: Bearer <token>' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

module.exports = authMiddleware;
