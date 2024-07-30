const express = require('express');
const router = express.Router();
const passport = require('../config/Passport-config');
const session = require('express-session');

const userRouterV1 = require('./v1/UserRouter');
const authRouterV1 = require('./v1/AuthRouter');
const courseRouterV1 = require('./v1/CourseRouter');
const adminRouterV1 = require('./v1/AdminRouter');
const classRoomRouterV1 = require('./v1/ClasssRoomRouter');
const postRouterV1 = require('./v1/PostRouter');
const attendanceRouterV1 = require('./v1/AttendanceRouter');
const commentRouterV1 = require('./v1/CommentRouter');

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
router.use('/v1/admin', adminRouterV1);
router.use('/v1/classroom', classRoomRouterV1);
router.use('/v1/post', postRouterV1);
router.use('/v1/attendances', attendanceRouterV1);
router.use('/v1/comment', commentRouterV1)

module.exports = router;