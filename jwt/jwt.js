require('dotenv').config();
const jwt = require('jsonwebtoken');
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.getSign = (data, secret) => {
  const token = jwt.sign(data, secret, { expiresIn: '10s' });
  return token;
};

exports.getRefreshSign = (data, secret) => {
  const token = jwt.sign(data, secret);
  return token;
};

exports.verifyToken = (token, secret) => {
  const isValid = jwt.verify(token, secret);
  return isValid;
};
