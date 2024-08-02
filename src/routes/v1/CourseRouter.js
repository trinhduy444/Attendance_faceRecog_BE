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

//Get All Course Group active
router.post('/getAllCourseGroupActive', authMiddleware.isLogin, courseController.getAllCourseGroupActive)

// Create Course Group
router.post('/createCourseGroup', authMiddleware.isLogin, courseController.createCourseGroup)

router.post('/getCourseGroupByTeacher', authMiddleware.isLogin, courseController.getAllCoursesGroupByTeacherId)

router.post('/getCourseGroupByStudent', authMiddleware.isLogin, courseController.getAllCoursesGroupByStudentId)

router.get('/getInfoCourseGroup/:course_group_id', courseController.getInfoCourseGroup)

router.post('/checkAccessCourseGroup/:course_group_id', authMiddleware.isLogin, courseController.checkInCourseGroup)

module.exports = router;