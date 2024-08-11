const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleWare');

const userController = require('../../controllers/UserController');

// Get all user with pagination
router.get('/', userController.getAllUserPagination);

// Get user by ID
router.get('/:userId', userController.getUserById);

router.post('/profile', authMiddleware.isLogin, userController.getProfile)

// router.post('/', null);

// router.put('/', null);

// router.delete('/', null);

router.post('/getImageAndNicknameByUsername',authMiddleware.isLogin, userController.getImageAndNicknameByUsername)
router.post('/checkExistUser', authMiddleware.isLogin, userController.checkExistUser)
module.exports = router;