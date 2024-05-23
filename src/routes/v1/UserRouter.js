const express = require('express');
const router = express.Router();

const userController = require('../../controllers/UserController');

// Get all user with pagination
router.get('/', userController.getAllUserPagination);

// Get user by ID
router.get('/:userId', userController.getUserById);

// router.post('/', null);

// router.put('/', null);

// router.delete('/', null);

module.exports = router;