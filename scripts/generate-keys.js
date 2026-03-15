/**
 * Tạo cặp khóa RSA 2048-bit cho JWT RS256
 * Output: keys/private.pem, keys/public.pem
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '..', 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

const privatePath = path.join(keysDir, 'private.pem');
const publicPath = path.join(keysDir, 'public.pem');

fs.writeFileSync(privatePath, privateKey, 'utf8');
fs.writeFileSync(publicPath, publicKey, 'utf8');

console.log('Đã tạo cặp khóa RS256 (2048-bit):');
console.log('  - keys/private.pem');
console.log('  - keys/public.pem');
