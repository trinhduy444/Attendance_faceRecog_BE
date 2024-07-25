const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/AdminController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');
const upload = require('../../config/MulterConfig');

router.post('/getUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getUsers);
router.post('/getUsersDetail', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getUsersDetail);
router.post('/getTeachers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getTeachers);
router.post('/getAllTeachersByFaculty', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getTeachersByFaculty);

router.post('/createUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createUsers);
router.post('/createTeachers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createTeachers);

router.post('/uploadimage', authMiddleware.isLogin,upload.single('image'), AdminController.uploadImage);
router.post('/uploadimages', authMiddleware.isLogin,authMiddleware.isAdmin, upload.array('images'), AdminController.uploadImages);


module.exports = router;