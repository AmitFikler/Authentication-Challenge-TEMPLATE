const express = require('express');
const router = express.Router();

const { getInformation, getUsers } = require('../controller/api');

router.get('/v1/information', getInformation);
router.get('/v1/users', getUsers);

module.exports = router;
