const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const scheduleModel = require('../models/ScheduleModel')
class ScheduleController {
    getAllScheduleById = async (req, res) =>{
        try{
            const student_id = req.user.user_id;
            if(!student_id) throw new ForbiddenError("Please Login");
            const result = await scheduleModel.getAllScheduleById(student_id)
            return res.status(200).json({
                status:200,
                message: "Get All Scheules successfully",
                metadata: result
            })
        }catch(err){
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }

    }
}

module.exports = new ScheduleController;