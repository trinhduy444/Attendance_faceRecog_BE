const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleWare');

const teacherController = require('../../controllers/TeacherController');

// Get all user with pagination
router.post('/sendMail', authMiddleware.isLogin,authMiddleware.isTeacher, teacherController.sendMail);


module.exports = router;