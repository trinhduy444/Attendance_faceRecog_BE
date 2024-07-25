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

//Get Course filter
router.post('/getCourseFilter', authMiddleware.isLogin, courseController.getCourseFilter)

router.post('/createCourseGroup', authMiddleware.isLogin, courseController.createCourseGroup)

module.exports = router;