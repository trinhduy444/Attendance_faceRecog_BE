const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const scheduleModel = require('../models/ScheduleModel')
class ScheduleController {
    getAllScheduleById = async (req, res) => {
        try {
            const student_id = req.user.user_id;
            const { semester_year_id } = req.body;
            if (!student_id) throw new ForbiddenError("Please Login");
            const result = await scheduleModel.getAllScheduleById(student_id, semester_year_id)
            return res.status(200).json({
                status: 200,
                message: "Get All Scheules successfully",
                metadata: result
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }

    }
    getSemesterNow = async (req, res) => {
        try {
            const result = await scheduleModel.getSemesterNow();
            return res.status(200).json({
                status: 200,
                message: "Get Semester Now Success",
                semester_year_id: parseInt(result.semester_year_id),
                week_from: parseInt(result.week_from),
                week_to: parseInt(result.week_to)
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }

    }
    getSemesterSomeInfo = async (req, res) => {
        try {
            const {semester_year_id} = req.params
            if(!semester_year_id) throw new BadRequestError("No semester")
            const result = await scheduleModel.getSemesterSomeInfo(semester_year_id);
            return res.status(200).json({
                status: 200,
                message: "Get Semester Some Info Success",
                semester_year_id: parseInt(result.semester_year_id),
                week_from: parseInt(result.week_from),
                week_to: parseInt(result.week_to)
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }

    }
}

module.exports = new ScheduleController;