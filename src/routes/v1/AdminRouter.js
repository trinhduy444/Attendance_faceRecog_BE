const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/AdminController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');
// console.log(authMiddleware)
const upload = require('../../config/MulterConfig');

router.post('/getUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getUsers);
router.post('/getUsersDetail', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getUsersDetail);
router.post('/getTeachers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getTeachers);
router.post('/getAllAdmins', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getAllAdmins)
router.post('/getAllTeachersByFaculty/:faculty_id', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getTeachersByFaculty);

router.post('/createAdmin', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createAdmin)
router.post('/createUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createUsers);
router.post('/createTeachers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createTeachers);

router.post('/uploadimage', authMiddleware.isLogin,upload.single('image'), AdminController.uploadImage);
// router.post('/uploadimages', authMiddleware.isLogin,authMiddleware.isAdmin, upload.array('images'), AdminController.uploadImages);
router.post('/uploadimages', authMiddleware.isLogin,authMiddleware.isAdmin, upload.array('images'), AdminController.uploadImages2);
router.post('/uploadSysFaces', authMiddleware.isLogin,authMiddleware.isAdmin, upload.array('images'), AdminController.uploadImagesWithFace);

// router.post('/findClosetVector', authMiddleware.isLogin, AdminController.findClosestVector);


// Lock admin account
router.put('/lockAccount/:user_id', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.lockAccount);
router.put('/unLockAccount/:user_id', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.unLockAccount);

// Lock User Account
router.put('/lockUserAccount/:user_id/:role_id', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.lockUserAccount);
router.put('/unLocUserkAccount/:user_id/:role_id', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.unLockUserAccount);

module.exports = router;