const bcrypt = require('bcryptjs');

let initialized = false;
const users = [
  { id: '1', username: 'admin', email: 'admin@example.com', passwordHash: '' },
];

async function init() {
  if (initialized) return;
  users[0].passwordHash = await bcrypt.hash('123456', 10);
  initialized = true;
}

async function findByUsername(username) {
  await init();
  return users.find((u) => u.username === username || u.email === username);
}

async function findById(id) {
  await init();
  return users.find((u) => u.id === id);
}

async function verifyPassword(user, plainPassword) {
  return bcrypt.compare(plainPassword, user.passwordHash);
}

async function updatePassword(userId, newHash) {
  await init();
  const u = users.find((x) => x.id === userId);
  if (u) u.passwordHash = newHash;
  return !!u;
}

module.exports = { findByUsername, findById, verifyPassword, updatePassword };
