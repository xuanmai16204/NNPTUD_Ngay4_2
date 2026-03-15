const express = require('express');
const router = express.Router();
const { sign } = require('../lib/jwt');
const {
  findByUsername,
  findById,
  verifyPassword,
  updatePassword,
} = require('../lib/users');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');

/**
 * POST /auth/login
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Cần username và password' });
    }
    const user = await findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const valid = await verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const token = sign({ userId: user.id, username: user.username });
    return res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

/**
 * GET /auth/me - Yêu cầu đăng nhập (Bearer token)
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

/**
 * Validate newPassword: tối thiểu 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
 */
function validateNewPassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push('Mật khẩu mới tối thiểu 8 ký tự');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu mới cần ít nhất 1 chữ in hoa');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu mới cần ít nhất 1 chữ thường');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu mới cần ít nhất 1 chữ số');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Mật khẩu mới cần ít nhất 1 ký tự đặc biệt (!@#$%^&*...)');
  }
  return errors;
}

/**
 * POST /auth/change-password - Yêu cầu đăng nhập
 * Body: { oldPassword, newPassword }
 */
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: 'Cần gửi oldPassword và newPassword',
      });
    }

    const validationErrors = validateNewPassword(newPassword);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Mật khẩu mới không hợp lệ',
        details: validationErrors,
      });
    }

    const user = await findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const validOld = await verifyPassword(user, oldPassword);
    if (!validOld) {
      return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.id, newHash);

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
