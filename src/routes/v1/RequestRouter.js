const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleWare');
const requestController = require('../../controllers/RequestController')

// Get all request
router.get('/', authMiddleware.isLogin, requestController.getAllRequestsByActiveUser);

// Add request
router.post('/', authMiddleware.isLogin, requestController.createAttendanceRequest)

// Approve request
//router.post('/', authMiddleware.isLogin, requestController.createAttendanceRequest)

// router.post('/createNotification', authMiddleware.isLogin, notifyController.createNotification)
// router.post('/getAllNotificationsActiveByUser', authMiddleware.isLogin, notifyController.getAllNotificationsActiveByUser)
// router.post('/getAllNotifications', authMiddleware.isLogin, authMiddleware.isAdmin, notifyController.getAllNotifications)
// router.put('/hideNotifications/:notify_id', authMiddleware.isLogin, authMiddleware.isAdmin, notifyController.hideNotifications)
// router.put('/showNotifications/:notify_id', authMiddleware.isLogin, authMiddleware.isAdmin, notifyController.showNotifications)
// router.put('/viewNotification/:notify_id', authMiddleware.isLogin, notifyController.viewNotification)

module.exports = router;