const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleWare');
const requestController = require('../../controllers/RequestController')

// Get all request
router.get('/', authMiddleware.isLogin, requestController.getAllRequestsByActiveUser);

// Add request
router.post('/', authMiddleware.isLogin, requestController.createAttendanceRequest);

// Approve/Reject request
router.get('/approve/:request_id', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, requestController.approveAttendanceRequest);
router.get('/reject/:request_id', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, requestController.rejectAttendanceRequest);

module.exports = router;