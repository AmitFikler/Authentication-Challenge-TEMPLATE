const express = require('express');
const { login, register, tokenValidate } = require('../controller/users');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/tokenValidate', tokenValidate);

module.exports = router;
