const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/AuthMiddleWare');
const scheduleController = require('../../controllers/ScheduleController');


router.post('/getSchedule',authMiddleware.isLogin,scheduleController.getAllScheduleById)
router.get('/getSemesterNow',scheduleController.getSemesterNow)
router.get('/getSemesterSomeInfo/:semester_year_id',scheduleController.getSemesterSomeInfo)
module.exports = router;