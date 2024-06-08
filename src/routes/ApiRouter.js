const express = require('express');
const router = express.Router();

const userRouterV1 = require('./v1/UserRouter');
const authRouterV1 = require('./v1/AuthRouter');
const courseRouterV1 = require('./v1/CourseRouter');

// API v1
router.use('/v1/users', userRouterV1);
router.use('/v1/auth', authRouterV1);
router.use('/v1/courses', courseRouterV1);

module.exports = router;