const express = require('express');
const router = express.Router();

const userRouterV1 = require('./v1/UserRouter');

// API v1
router.use('/v1/users', userRouterV1);

module.exports = router;