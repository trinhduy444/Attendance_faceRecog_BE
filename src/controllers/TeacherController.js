const teacherModel = require('../models/TeacherModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');

class TeacherController {
    sendMail(req, res) {
        if (req.user.role_id !== 2) throw new ForbiddenError("You are not allowed to send mail for students.");
        const { course_group_id, mailContent } = req.body;
        if (!mailContent || !course_group_id) return res.status(403).json({ status: 403, message: "Please provide enough information" })
        teacherModel.sendMail(course_group_id,mailContent).then((result) => {
            if (result) {
                return res.status(201).json({ status: 201, message: "Send mail for students successfully." })
            } else {
                return res.status(403).json({ status: 403, message: "Something went wrong while sending mail." })
            }
        }
        ).catch((error) => {
            console.error(error);
            return res.status(500).json({ status: 500, message: error.message })

        })

    }

}

module.exports = new TeacherController;