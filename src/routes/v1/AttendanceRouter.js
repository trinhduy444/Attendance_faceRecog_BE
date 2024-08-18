const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const attendanceController = require('../../controllers/AttendanceController');
const upload = require('../../config/MulterConfig');
// Get attendance raw data
router.get('/raw', authMiddleware.isLogin, attendanceController.getAttendanceRawData);

// Add attendance raw data
router.post('/raw', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.postAttendanceRawData);

// Add attendance raw data with server date time
router.post('/rawserverdatetime', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.postAttendanceRawDataServerDateTime);

// Update attendance from raw data
router.post('/pulldata', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.updateAttendanceFromRawData);

// Get attendance data
router.get('/', authMiddleware.isLogin, attendanceController.getAttendance);
// Get Attendance Detail
router.get('/detail', authMiddleware.isLogin, attendanceController.getAttendanceDetail);

// Edit attendance data
router.put('/', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.putAttendance);

// Delete attendance data
router.delete('/', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.deleteAttendance);

// Report summary
router.get('/report/summary', authMiddleware.isLogin, attendanceController.getAttendanceSummaryReport);

// Report detail
router.get('/report/detail', authMiddleware.isLogin, attendanceController.getAttendanceDetailReport);

// Upload Image
router.post('/uploadimage', authMiddleware.isLogin,upload.single('image'), attendanceController.uploadImage);

//Check student in CG
router.post('/checkStatusStudentInCourseGroup', authMiddleware.isLogin, attendanceController.checkStatusStudentInCourseGroup)

// Update Toltal Absent and sendMail 
router.post('/updateTotalAbsentAllCourseGroup',authMiddleware.isLogin,attendanceController.updateTotalAbsentAllCourseGroup)
module.exports = router;