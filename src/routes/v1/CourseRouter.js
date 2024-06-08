const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const courseController = require('../../controllers/CourseController');

// Get all course with pagination
router.get('/', courseController.getAllCoursesPagination);

// Get course by Course Code
router.get('/:courseCode', courseController.getCourseByCode);

// Add course
router.post('/', authMiddleware.isLogin, courseController.postCourse);

// Update course
router.put('/', authMiddleware.isLogin, courseController.putCourse);

// Delete course
router.delete('/', authMiddleware.isLogin, courseController.deleteCourse);

module.exports = router;