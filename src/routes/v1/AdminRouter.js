const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/AdminController');
const authMiddleware = require('../../middlewares/AuthMiddleWare');
const upload = require('../../config/MulterConfig');
const { cloudinary, CLOUDINARY_FOLDER } = require('../../config/CloudinaryConfig');
const streamifier = require('streamifier');

router.post('/getUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.getUsers);

router.post('/createUsers', authMiddleware.isLogin, authMiddleware.isAdmin, AdminController.createUsers);

router.post('/uploadimage', authMiddleware.isLogin,upload.single('image'), AdminController.uploadImage);
router.post('/uploadimages', authMiddleware.isLogin,authMiddleware.isAdmin, upload.array('images'), AdminController.uploadImages);
// router.get('/viewImage/:public_id', async (req, res) => {
//     try {
//         const { public_id } = req.params;
//         const result = await cloudinary.api.resource(public_id);
//         res.json({ url: result.secure_url });
//     } catch (error) {
//         res.status(404).json({ message: 'Không tìm thấy ảnh' });
//     }
// });
module.exports = router;