const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const courseModel = require('../models/CourseModel');
const userModel = require('../models/UserModel');
const classRoomModel = require('../models/ClassRoomModel')
const { redisClientInit } = require('../config/RedisConfig');
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
        const courses = await courseModel.getCoursesFilter(faculty_id, inputFilter, type, credit);
        // console.log(courses)
        return res.status(200).json({
            status: 200,
            message: "Get Courses Successfully",
            metadata: courses,
        })
    };

    getAllCourseGroupActive = async (req, res) => {
        if (req.user?.role_id !== 1 && req.user.role_id !== 4) {
            throw new ForbiddenError('You are not allowed');
        }
        const coursegroups = await courseModel.getAllCourseGroupActive();
        return res.status(200).json({
            status: 200,
            message: "Get Courses Successfully",
            metadata: coursegroups,
        })
    };

    getCourseGroupStudentListInfo(req, res) {
        let { courseGroupId } = req.params;
        courseGroupId = courseGroupId || 0;

        courseModel.getCourseGroupStudentListInfo(courseGroupId)
            .then((students) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive course group student list info success.',
                    'data': {
                        'students': students
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

    createCourseGroup = async (req, res) => {
        if (req.user?.role_id !== 1 && req.user.role_id !== 4) {
            throw new ForbiddenError('You are not allowed');
        }
        const user_id = req.user.user_id;
        try {
            const { course_code, group_code, teacher_id, total_student_qty, shift_code, classroom_code, students, semester_year_id, week_day } = req.body;
            if (!course_code) throw new BadRequestError('course_code is required');
            console.log("data", { course_code, group_code, teacher_id, total_student_qty, shift_code, classroom_code, students, semester_year_id, week_day })
            await classRoomModel.setRoomNotEmpty(shift_code, classroom_code, user_id).then(async (classroomshift_id) => {
                const usersId = await userModel.getUserIdFromList(students)
                await courseModel.createCourseGroup(classroomshift_id, course_code, group_code, teacher_id, total_student_qty, usersId, user_id, semester_year_id, week_day)
            })

            return res.status(201).json({
                status: 201,
                message: "Create CourseGroup Successfully",

            })
        } catch (error) {
            return res.status(500).json({
                'status': 500,
                'message': error.message,
            });
        }

    }

    getAllCoursesGroupByTeacherId = async (req, res) => {
        const { semester_year_id } = req.query;

        if (req.user?.role_id !== 2 && req.user?.role_id !== 4 && req.user?.role_id !== 1 ) {
            return res.status(403).json({ error: 'You are not allowed' });
        }

        const teacher_id = req.user.user_id;
        const data = await courseModel.getCourseGroupByTeacherId(teacher_id, semester_year_id);
        return res.status(200).json({
            status: 200,
            message: "Get Course Group Successfully",
            metadata: data
        })
        // const cacheKey = `teacher_course_info_${teacher_id}`;
        // try {
        //     const cachedData = await redisClient.get(cacheKey);
        //     if (cachedData) {
        //         // Lấy dữ liệu từ Redis cache
        //         const data = JSON.parse(cachedData);
        //         return res.status(200).json({
        //             status: 200,
        //             message: "Get Course Group Successfully",
        //             metadata: data
        //         })
        //     } else {
        //         const data = await courseModel.getCourseGroupByTeacherId(teacher_id);
        //         await redisClient.set(cacheKey, JSON.stringify(data));
        //         return res.status(200).json({
        //             status: 200,
        //             message: "Get Course Group Successfully",
        //             metadata: data
        //         })
        //     }
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }
    };
    getAllCoursesGroupByStudentId = async (req, res) => {
        const { semester_year_id } = req.query;
        const { course_group_id } = req.body;
        // console.log(semester_year_id,course_group_id);
        const student_id = req.user.user_id;
        if (!student_id) throw new ForbiddenError("Pls login required")
        try {
            const data = await courseModel.getCourseGroupByStudentId(student_id, semester_year_id, course_group_id);
            return res.status(200).json({
                status: 200,
                message: "Get Course Group Successfully",
                metadata: data
            })
        } catch (err) {
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    };
    getAllCourseGroup = async (req, res) => {
        const { semester_year_id } = req.query;
        // console.log("sêms",semester_year_id);
        try {
            const data = await courseModel.getAllCourseGroup(semester_year_id);
            return res.status(200).json({
                status: 200,
                message: "Get Info Course Group Successfully",
                metadata: data
            })
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: "Somthing went wrong!"
            })
        }
    }
    getInfoCourseGroup = async (req, res) => {
        const { course_group_id } = req.params;
        if (!course_group_id) throw new BadRequestError("Invalid Course Group");
        try {
            const data = await courseModel.getInfoCourseGroup(course_group_id);
            return res.status(200).json({
                status: 200,
                message: "Get Info Course Group Successfully",
                metadata: data[0]
            })
        } catch (err) {
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    }
    checkAccessCourseGroupTeacher = async (req, res) => {
        
        const user_id = req.user.user_id;
        const { course_group_id } = req.params;
        
        try {
            const result = await courseModel.checkTeacherInCourseGroup(course_group_id, user_id);
            if (result === true) {
                return res.status(200).json({
                    status: 200,
                    message: "Ok, you can access to the course group"
                })
            }
            else {
                return res.status(200).json({
                    status: 400,
                    message: "Fail, you are not allowed to access this course group"
                })
            }
        } catch (err) {
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    }

    checkInCourseGroup = async (req, res) => {
        const user_id = req.user.user_id;
        const { course_group_id } = req.params;
        console.log(`Course Group ${course_group_id}`);
        if (!user_id) throw new ForbiddenError("Pls Login");
        try {
            const result = await courseModel.checkInCourseGroup(course_group_id, user_id);
            if (result === true) {
                return res.status(200).json({
                    status: 200,
                    message: "Ok, you can access to the course group"
                })
            }
            else {
                return res.status(400).json({
                    status: 400,
                    message: "Fail, you are not allowed to access this course group"
                })
            }
        } catch (err) {
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    }
    getAllSemester = async (req, res) => {
        try {
            const result = await courseModel.getAllSemester();
            return res.status(200).json({
                status: 200,
                message: "get all semesters successfully",
                metadata: result
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    };
    createCourseGroups = async (req, res) => {
        try {
            if (req.user?.role_id !== 1 && req.user?.role_id !== 4)  throw new ForbiddenError("You not allowed to create a new course group")
            const { courseGroups } = req.body;
            if (courseGroups.length <= 0 || !courseGroups) {
                return res.status(200).json({ status: 400, message: "No courses found" });
            }
            // console.log(courseGroups)
            await courseModel.createMutipleCourseGroup(courseGroups, req.user.user_id);

            return res.status(201).json({
                status: 201,
                message: "Create course groups successfully",
            })
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }
    }
    createStudentList = async (req, res) => {
        try {
            if (req.user?.role_id !== 1 && req.user?.role_id !== 4)  throw new ForbiddenError("You not allowed to create a new course group")
            const { studentLists } = req.body;
            if (studentLists.length <= 0 || !studentLists) {
                return res.status(200).json({ status: 400, message: "No students found" });
            }
            // console.log(studentLists)
            await courseModel.createMultiStudentList(studentLists, req.user.user_id);

            return res.status(201).json({
                status: 201,
                message: "Create Student List into Course Group successfully",
            })
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }

    }
    viewAllStudentCourseGroup = async (req, res) => {
        if (req.user?.role_id !== 1 && req.user?.role_id !== 4)  throw new ForbiddenError("You are not allowed to view data")
        let { status, teacher_id, course_group_id } = req.query;
        if (!course_group_id) {
            return res.status(403).json({
                status: 403,
                message: "Please enter a Course Group ID"
            })
        }
        try {

            const data = await courseModel.viewAllStudentCourseGroup(status, teacher_id, course_group_id)
            return res.status(200).json({
                status: 200,
                message: "Get All Student In Course Group successfully",
                metadata: data
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }

    }
    viewAllStudentCourseGroupByTeacher = async (req, res) => {
        if (req.user.role_id !== 2) throw new ForbiddenError("You are not allowed to view data")
        let { status, course_group_id } = req.query;

        if (!course_group_id) {
            return res.status(403).json({
                status: 403,
                message: "Please enter a semester year ID"
            })
        }
        try {

            const data = await courseModel.viewAllStudentCourseGroup(status, req.user.user_id, course_group_id)
            return res.status(200).json({
                status: 200,
                message: "Get All Student In Course Group successfully",
                metadata: data
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({
                status: 400,
                message: "Somthing went wrong!"
            })
        }

    }
}

module.exports = new CourseController;