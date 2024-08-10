const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const scheduleController = require('../../controllers/ScheduleController');


router.post('/getSchedule',authMiddleware.isLogin,scheduleController.getAllScheduleById)
module.exports = router;