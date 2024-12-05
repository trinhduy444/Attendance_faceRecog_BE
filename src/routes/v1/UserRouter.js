const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleWare');

const userController = require('../../controllers/UserController');
const recogController = require('../../controllers/RecogController');


// Get all user with pagination
router.get('/', userController.getAllUserPagination);

// Get user by ID
router.get('/:userId', userController.getUserById);

router.post('/profile', authMiddleware.isLogin, userController.getProfile)

// Get user face list
router.get('/faces/:userId', authMiddleware.isLogin, userController.getUserFaces);

router.post('/sync/:courseGroupId', recogController.syncFaceDataToElasticsearch)
router.post('/findClosetVector', authMiddleware.isLogin, authMiddleware.isTeacherOrAdmin, recogController.findClosestVector);
router.post('/findClosetKNN', recogController.findClosestKNN);

// router.post('/', null);

// router.put('/', null);

// router.delete('/', null);

router.post('/getImageAndNicknameByUsername', authMiddleware.isLogin, userController.getImageAndNicknameByUsername)
router.post('/checkExistUser', authMiddleware.isLogin, userController.checkExistUser)

router.post('/getSomeinfo', authMiddleware.isLogin, userController.getSomeInfo)
module.exports = router;