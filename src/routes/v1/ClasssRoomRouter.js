'use strict';
const express = require('express');
const router = express.Router();
const classRoomController = require('../../controllers/ClassRoomController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');

router.post('/createClassRoom', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.createRoom)
router.post('/createClassRooms', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.createRooms)

router.post('/getRooms', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.getClassRooms)
router.post('/getClassRoomsFilter', authMiddleware.isLogin,authMiddleware.isAdmin, classRoomController.getClassRoomsFilter)
router.post('/getShiftEmpty', authMiddleware.isLogin,authMiddleware.isAdmin, classRoomController.getShiftEmpty)
router.post('/getAllRooms', authMiddleware.isLogin, authMiddleware.isAdmin, classRoomController.getAllClassRooms)

module.exports = router;