const teacherModel = require('../models/TeacherModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');
const userModel = require('../models/UserModel');
class TeacherController {
    sendMail(req, res) {
        if (req.user.role_id !== 2) throw new ForbiddenError("You are not allowed to send mail for students.");
        const { course_group_id, mailContent } = req.body;
        if (!mailContent || !course_group_id) return res.status(403).json({ status: 403, message: "Please provide enough information" })
        teacherModel.sendMail(course_group_id, mailContent).then((result) => {
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
    getAllTeachersByFacultyId = async (req, res) => {
        let { faculty_id } = req.params
        let faculty_name = '';
        if (!faculty_id) {
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("Please login to receive");
            const faculty = await userModel.getFacultyByUserId(user_id)
            faculty_id = faculty.faculty_id;
            faculty_name = faculty.faculty_name;
        }

        teacherModel.getAllTeachersByFacultyId(faculty_id).then((result) => {
            if (result) {
                return res.status(200).json({ status: 200, message: "Get All Teacher In Faculty successfully.", faculty: { faculty_id, faculty_name }, teachers: result })
            } else {
                return res.status(403).json({ status: 403, message: "Something went wrong while get all teachers." })
            }
        }).catch((error) => {
            console.error(error);
            return res.status(500).json({ status: 500, message: error.message })

        })
    }

}

module.exports = new TeacherController;