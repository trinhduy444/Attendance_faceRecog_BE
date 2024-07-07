const express = require('express');
const router = express.Router();
const passport = require('../utils/Passport-config');
const session = require('express-session');

const userRouterV1 = require('./v1/UserRouter');
const authRouterV1 = require('./v1/AuthRouter');
const courseRouterV1 = require('./v1/CourseRouter');

router.use(session({
    secret: 'admin123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Khởi tạo passport
router.use(passport.initialize());
router.use(passport.session());

// API v1
router.use('/v1/users', userRouterV1);
router.use('/v1/auth', authRouterV1);
router.use('/v1/courses', courseRouterV1);



module.exports = router;