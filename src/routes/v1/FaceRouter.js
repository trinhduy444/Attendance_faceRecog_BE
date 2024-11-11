const express = require('express');
const router = express.Router();
const faceController = require('../../controllers/FaceController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');
const upload = require('../../config/MulterConfig');

router.get('/:userId', authMiddleware.isLogin, faceController.getAllUserFacesById);

router.post('/upload', authMiddleware.isLogin, authMiddleware.isAdmin, upload.array('faces'), faceController.uploadFaces);

module.exports = router;