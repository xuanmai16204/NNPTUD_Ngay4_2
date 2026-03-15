require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const { ensureKeysExist } = require('./lib/keys');

const app = express();
app.use(express.json());

// Tạo key nếu chưa có (chạy lần đầu)
ensureKeysExist();

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log('  POST /auth/login     - Đăng nhập');
  console.log('  GET  /auth/me       - Thông tin user (cần Bearer token)');
  console.log('  POST /auth/change-password - Đổi mật khẩu (cần Bearer token)');
});
