const jwt = require('jsonwebtoken');
const env = require('../../config/env');

function sign(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiration,
  });
}

function verify(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { sign, verify };
