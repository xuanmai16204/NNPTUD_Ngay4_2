const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keysDir = path.join(__dirname, '..', 'keys');
const privatePath = path.join(keysDir, 'private.pem');
const publicPath = path.join(keysDir, 'public.pem');

function ensureKeysExist() {
  if (fs.existsSync(privatePath) && fs.existsSync(publicPath)) return;
  if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  fs.writeFileSync(privatePath, privateKey, 'utf8');
  fs.writeFileSync(publicPath, publicKey, 'utf8');
  console.log('Đã tạo keys/private.pem và keys/public.pem (RS256 2048-bit)');
}

function getPrivateKey() {
  return fs.readFileSync(privatePath, 'utf8');
}

function getPublicKey() {
  return fs.readFileSync(publicPath, 'utf8');
}

module.exports = { ensureKeysExist, getPrivateKey, getPublicKey };
