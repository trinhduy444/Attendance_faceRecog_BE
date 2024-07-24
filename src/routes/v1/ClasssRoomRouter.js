'use strict';
const express = require('express');
const router = express.Router();
const classRoomController = require('../../controllers/ClassRoomController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');

router.post('/createClassRoom', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.createRoom)
router.post('/createClassRooms', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.createRooms)
router.post('/getRooms', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.getClassRooms)

module.exports = router;