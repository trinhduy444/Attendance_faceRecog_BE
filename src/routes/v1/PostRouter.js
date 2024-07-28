const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const postController = require('../../controllers/PostController')
router.post('/createPost/:course_group_id', authMiddleware.isLogin, postController.createPost)
router.post('/getAllPostValid/:course_group_id', authMiddleware.isLogin, postController.getAllPostValid)
router.put('/deletePost/:post_id', authMiddleware.isLogin, postController.setPostInvalid)
router.patch('/updatePost/:post_id', authMiddleware.isLogin, postController.updatePost)
module.exports = router