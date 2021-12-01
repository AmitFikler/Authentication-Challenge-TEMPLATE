const express = require('express');
const {
  login,
  register,
  tokenValidate,
  logout,
} = require('../controller/users');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/tokenValidate', tokenValidate);
router.post('/logout', logout);

module.exports = router;
