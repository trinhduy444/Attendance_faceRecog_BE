const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const attendanceController = require('../../controllers/AttendanceController');

// Get attendance raw data
router.get('/raw', authMiddleware.isLogin, attendanceController.getAttendanceRawData);

// Add attendance raw data
router.post('/raw', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.postAttendanceRawData);

// Update attendance from raw data
router.post('/pulldata', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.updateAttendanceFromRawData);

// Get attendance data
router.get('/', authMiddleware.isLogin, attendanceController.getAttendance);

// Edit attendance data
router.put('/', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.putAttendance);

// Delete attendance data
router.delete('/', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, attendanceController.deleteAttendance);

// Report summary
router.get('/report/summary', authMiddleware.isLogin, attendanceController.getAttendanceSummaryReport);

// Report detail
router.get('/report/detail', authMiddleware.isLogin, attendanceController.getAttendanceDetailReport);

module.exports = router;