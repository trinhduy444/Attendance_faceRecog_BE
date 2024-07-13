const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/AdminController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');

router.post('/createUsers', authMiddleware.isLogin ,authMiddleware.isAdmin ,AdminController.createUsers);

module.exports = router;