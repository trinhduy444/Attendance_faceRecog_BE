'use strict';
const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const commentController = require('../../controllers/CommentController')
router.post('/createComment', authMiddleware.isLogin,commentController.createComment)
router.get('/getAllComments/:post_id', commentController.getAllComments)

module.exports = router