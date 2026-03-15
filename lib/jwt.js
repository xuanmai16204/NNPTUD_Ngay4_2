const jwt = require('jsonwebtoken');
const { getPrivateKey, getPublicKey } = require('./keys');

const ALGORITHM = 'RS256';
const EXPIRES_IN = '7d';

function sign(payload) {
  return jwt.sign(payload, getPrivateKey(), { algorithm: ALGORITHM, expiresIn: EXPIRES_IN });
}

function verify(token) {
  return jwt.verify(token, getPublicKey(), { algorithms: [ALGORITHM] });
}

module.exports = { sign, verify };
