const express = require('express');
const {
  login,
  register,
  tokenValidate,
  logout,
  getNewToken,
} = require('../controller/users');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/tokenValidate', tokenValidate);
router.post('/logout', logout);
router.post('/token', getNewToken);

module.exports = router;
