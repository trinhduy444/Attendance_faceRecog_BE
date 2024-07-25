const { BadRequestError } = require('../core/ErrorResponse');
const courseModel = require('../models/CourseModel');
const userModel = require('../models/UserModel');
const classRoomModel = require('../models/ClassRoomModel')

class CourseController {
    getCourseByCode(req, res) {
        const { courseCode } = req.params;

        courseModel.getCourseByCode(courseCode)
            .then((course) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive course success.',
                    'data': {
                        'course': course[0]
                    }
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getAllCoursesPagination(req, res) {
        let { otherJoins, otherFields, order, search, page, limit } = req.query;
        otherJoins = otherJoins || '';
        otherFields = otherFields || '';
        order = order || '';
        search = search || '';
        page = page || 1;
        limit = limit || 20;

        courseModel.getAllCoursesPagination(otherJoins, otherFields, order, search, page, limit)
            .then((data) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive courses success.',
                    'data': {
                        'courses': data[0],
                        'pageInfo': data[1]
                    }
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    postCourse(req, res) {
        let { courseCode, courseName, credit, description, status } = req.body;
        courseCode = courseCode || '';
        courseName = courseName || '';
        credit = credit || 0;
        description = description || '';
        status = status || 0;

        const course = { courseCode, courseName, credit, description, status };
        courseModel.addCourse(course, req.user.user_id)
            .then(() => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Add course success.',
                    'data': {}
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    putCourse(req, res) {
        let { oldCourseCode, courseCode, courseName, credit, description, status } = req.body;
        oldCourseCode = oldCourseCode || '';
        courseCode = courseCode || '';
        courseName = courseName || '';
        credit = credit || 0;
        description = description || '';
        status = status || 0;

        const oldKey = { oldCourseCode };
        const course = { courseCode, courseName, credit, description, status };
        courseModel.updateCourse(oldKey, course, req.user.user_id)
            .then(() => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Update course success.',
                    'data': {}
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    deleteCourse(req, res) {
        let { courseCode } = req.body;
        courseCode = courseCode || '';

        courseModel.deleteCourse({ courseCode })
            .then(() => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Delete course success.',
                    'data': {}
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getCourseFilter = async (req, res) => {
        const { faculty_id, inputFilter, type, credit } = req.body;
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const courses = await courseModel.getCoursesFilter(faculty_id, inputFilter, type, credit);
        // console.log(courses)
        return res.status(200).json({
            status: 200,
            message: "Get Courses Successfully",
            metadata: courses,
        })
    };

    createCourseGroup = async (req, res) => {
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const { course_code, group_code, teacher_id, total_student_qty, shift_code, classroom_code, students } = req.body;
        if (!course_code) throw new BadRequestError('course_code is required');
        const usersId = await userModel.getUserIdFromList(students)

        await courseModel.createCourseGroup(course_code, group_code, teacher_id, total_student_qty, usersId, req.user.role_id)
            .then(async (data) => {
                if (data) {
                    await classRoomModel.setRoomNotEmpty(shift_code, classroom_code)
                }
            })
        return res.status(201).json({
            status: 201,
            message: "Create CourseGroup Successfully",

        })
    }
}

module.exports = new CourseController;