// Require model
const attendanceModel = require('../models/AttendanceModel');
const userModel = require('../models/UserModel');
const courseModel = require('../models/CourseModel');

const { ForbiddenError, BadRequestError } = require('../core/ErrorResponse');
const { cloudinary, CLOUDINARY_FOLDER2 } = require('../config/CloudinaryConfig');
const streamifier = require('streamifier');

class AttendanceController {
    getAttendanceRawData(req, res) {
        let { studentId, courseGroupId, attendDate, attendType } = req.query;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;
        attendType = attendType || 0;

        attendanceModel.getAttendanceRawDatas(studentId, courseGroupId, attendDate, attendType)
            .then((AttendanceRawDatas) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive Attendance Raw Data success.',
                    'data': AttendanceRawDatas
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    postAttendanceRawData(req, res) {
        let { studentId, courseGroupId, attendDate, attendType, attendTime, attendImagePath } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;
        attendType = attendType || 0;
        attendTime = attendTime || '00:00';
        attendImagePath = attendImagePath || '';

        const AttendanceRawData = { studentId, courseGroupId, attendDate, attendType, attendTime, attendImagePath };
        attendanceModel.addAttendanceRawData(AttendanceRawData, req.user.user_id)
            .then(() => {
                return res.status(200).json({
                    'status': 201,
                    'message': 'Add Attendance Raw Data success.',
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

    postAttendanceRawDataServerDateTime(req, res) {
        let { studentId, courseGroupId, attendType, attendImagePath } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendType = attendType || 0;
        attendImagePath = attendImagePath || '';
        console.log("dataaaaaa:",studentId, courseGroupId, attendType, attendImagePath);
        
        const AttendanceRawData = { studentId, courseGroupId, attendType, attendImagePath };
        attendanceModel.addAttendanceRawDataServerDateTime(AttendanceRawData, req.user.user_id)
            .then((notExists) => {
                if (notExists) {
                    return res.status(201).json({
                        'status': 201,
                        'message': 'Add Attendance Raw Data success.',
                        'data': {}
                    });
                } else {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'Attendance Raw Data exists.',
                        'data': {}
                    });
                }
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    updateAttendanceFromRawData(req, res) {
        let { courseGroupId, attendDate, forceUpdate } = req.body;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;
        forceUpdate = forceUpdate || false;

        attendanceModel.updateAttendanceFromRawData(courseGroupId, attendDate, req.user.user_id, forceUpdate)
            .then(() => {
                courseModel.updateTotalAbsent(courseGroupId, '')
                    .then(() => {
                        return res.status(200).json({
                            'status': 200,
                            'message': 'Update attendance data from raw data success.',
                            'data': {}
                        });
                    });
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getAttendance(req, res) {
        let { studentId, courseGroupId, attendDate } = req.query;
        console.log('control', { studentId, courseGroupId, attendDate })
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;

        attendanceModel.getAttendances(studentId, courseGroupId, attendDate)
            .then((Attendances) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive Attendances success.',
                    'data': Attendances
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }
    getAttendanceDetail(req, res) {
        const { studentId, courseGroupId, attendDate } = req.query;
        attendanceModel.getAttendanceDetail(studentId, courseGroupId, attendDate).then((data) => {

            return res.status(200).json({
                status: 200,
                message: 'Get Attendance Detail Successfully',
                metadata: data
            })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({
                status: 500,
                message: err,
            });
        });
    }
    putAttendance(req, res) {
        let { studentId, courseGroupId, attendDate, attendYn, lateYn, enterTime, note } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;
        attendYn = attendYn || 0;
        lateYn = lateYn || 0;
        enterTime = enterTime || '00:00';
        note = note || '';

        const oldKey = { studentId, courseGroupId, attendDate };
        const attendance = { attendYn, lateYn, enterTime, note };
        attendanceModel.updateAttendance(oldKey, attendance, req.user.user_id)
            .then(() => {
                courseModel.updateTotalAbsent(courseGroupId, studentId.toString())
                    .then(() => {
                        return res.status(200).json({
                            'status': 200,
                            'message': 'Update attendance success.',
                            'data': {}
                        });
                    });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    deleteAttendance(req, res) {
        let { studentId, courseGroupId, attendDate } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;

        const key = { studentId, courseGroupId, attendDate };
        attendanceModel.deleteAttendance(key)
            .then(() => {
                courseModel.updateTotalAbsent(courseGroupId, studentId == -1 ? '' : studentId.toString())
                    .then(() => {
                        return res.status(200).json({
                            'status': 200,
                            'message': 'Delete attendance success.',
                            'data': {}
                        });
                    });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getAttendanceSummaryReport(req, res) {
        let { attendDate1, attendDate2, studentId, courseGroupId } = req.query;
        attendDate1 = attendDate1 || null;
        attendDate2 = attendDate2 || null;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;

        attendanceModel.getAttendanceSummaryReport(attendDate1, attendDate2, studentId, courseGroupId)
            .then((data) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive attendance summary report success.',
                    'data': data
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getAttendanceDetailReport(req, res) {
        let { courseGroupId, studentId } = req.query;
        courseGroupId = courseGroupId || 0;
        studentId = studentId || 0;

        attendanceModel.getAttendanceDetailReport(courseGroupId, studentId)
            .then((data) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive attendance detail report success.',
                    'data': {
                        'values': data[0],
                        'headers': data[1]
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

    uploadImage = async (req, res) => {
        try {
            const { user_id, course_group_id, date, type } = req.body;
            if (!user_id) throw new ForbiddenError('Please provide a user');

            if (!req.file) {
                return res.status(400).json({ message: 'Không có file nào được upload' });
            }

            const userUpload = await userModel.getUserById(user_id);
            if (!userUpload) throw new ForbiddenError("User to upload not found");

            const customPublicId = `${user_id}_attendanceData_${course_group_id}_${date}_${type}`;

            const uploadOptions = {
                folder: CLOUDINARY_FOLDER2,
                public_id: customPublicId,
                overwrite: true,
                resource_type: "auto"
            };

            const streamUpload = (file, options) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        options,
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req.file, uploadOptions);
            const attendanceRawData = {
                studentId: user_id,
                courseGroupId: course_group_id,
                attendDate: date,
                attendType: type,
                attendImagePath: result.secure_url
            };
            attendanceModel.updateAttendanceRawDataImagePath(attendanceRawData)
                .then(() => {
                    return res.status(201).json({ link_anh: result.secure_url });
                }).catch((err) => {
                    return res.status(500).json({ message: 'Lỗi khi upload ảnh', error: err });
                });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi khi upload ảnh', error: error.message });
        }
    }
    checkStatusStudentInCourseGroup = async (req, res) => {
        try {
            const { courseGroupId, studentId } = req.body;

            const result = await attendanceModel.checkStatusStudentInCourseGroup(courseGroupId, studentId)
            return res.status(200).json({ metadata: result })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Lỗi khi upload ảnh', error: error.message });
        }
    }
    updateTotalAbsentAllCourseGroup = async (req, res) => {
        try {
            const { course_group_id, isSendMail } = req.body;
            // console.log("body", course_group_id, isSendMail)
            if (!course_group_id || course_group_id === 'none') throw new BadRequestError("Please enter a course group ID");
            const role_id = req.user.role_id
            if (role_id !== 1 && role_id !== 2 && role_id !== 4) throw new ForbiddenError("You not allowed to access this endpoint")
            await courseModel.updateAllTotalAbsent(course_group_id).then(async (result) => {
                if (result && isSendMail) {
                    const result2 = await attendanceModel.sendMailAllStudentAfterUpdate(course_group_id)
                    if (result2) {
                        return res.status(200).json({ status: 200, message: "Update Total absent and send mail successfully" })
                    } else {
                        return res.status(203).json({ status: 203, message: "Update Total absent and send mail fail" })

                    }
                } else {
                    return res.status(200).json({ status: 200, message: "Update Total absent successfully" })
                }
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({ status: 500, message: 'Lỗi khi hoàn tất điều chỉnh điểm danh', error: error.message });
        }
    }
}

module.exports = new AttendanceController;