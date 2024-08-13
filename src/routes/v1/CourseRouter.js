const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const courseController = require('../../controllers/CourseController');

// Get all course with pagination
router.get('/', courseController.getAllCoursesPagination);

// Get course by Course Code
// router.get('/:courseCode', courseController.getCourseByCode);

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

// Get course group list of student info
router.get('/groups/students/:courseGroupId', authMiddleware.isLogin, courseController.getCourseGroupStudentListInfo);

// Create Course Group
router.post('/createCourseGroup', authMiddleware.isLogin, courseController.createCourseGroup)

// Get All Course Group Teacher
router.post('/getCourseGroupByTeacher', authMiddleware.isLogin, courseController.getAllCoursesGroupByTeacherId)

// Get All CourseGroup Student
router.post('/getCourseGroupByStudent', authMiddleware.isLogin, courseController.getAllCoursesGroupByStudentId)

router.get('/getInfoCourseGroup/:course_group_id', courseController.getInfoCourseGroup)

router.post('/checkAccessCourseGroup/:course_group_id', authMiddleware.isLogin, courseController.checkInCourseGroup)

//Get All Course Groups have Semester Year
router.post('/getAllCourseGroup', authMiddleware.isLogin, authMiddleware.isAdmin, courseController.getAllCourseGroup)
//Get All Semesters
router.post('/getAllSemesters', authMiddleware.isLogin, courseController.getAllSemester)

// Create Mutli Course Group
router.post('/createCourseGroups',authMiddleware.isLogin, authMiddleware.isAdmin, courseController.createCourseGroups)

// Create Mutltii Student in Course Group
router.post('/createStudentLists', authMiddleware.isLogin, authMiddleware.isAdmin, courseController.createStudentList)

// Get Coursse Groups Details

module.exports = router;