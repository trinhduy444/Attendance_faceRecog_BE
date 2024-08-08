const attendanceModel = require('../models/AttendanceModel');
const userModel = require('../models/UserModel');
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

        const AttendanceRawData = { studentId, courseGroupId, attendType, attendImagePath };
        attendanceModel.addAttendanceRawDataServerDateTime(AttendanceRawData, req.user.user_id)
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

    updateAttendanceFromRawData(req, res) {
        let { courseGroupId, attendDate } = req.body;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;

        attendanceModel.updateAttendanceFromRawData(courseGroupId, attendDate, req.user.user_id)
        .then(() => {
            return res.status(200).json({
                'status': 200,
                'message': 'Update attendance data from raw data success.',
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

    getAttendance(req, res) {
        let { studentId, courseGroupId, attendDate } = req.query;
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

    putAttendance(req, res) {
        let { studentId, courseGroupId, attendDate, attendYn, enterTime, note } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;
        attendYn = attendYn || 0;
        enterTime = enterTime || '00:00';
        note = note || '';

        const oldKey = { studentId, courseGroupId, attendDate };
        const attendance = { attendYn, enterTime, note };
        attendanceModel.updateAttendance(oldKey, attendance, req.user.user_id)
            .then(() => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Update attendance success.',
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

    deleteAttendance(req, res) {
        let { studentId, courseGroupId, attendDate } = req.body;
        studentId = studentId || 0;
        courseGroupId = courseGroupId || 0;
        attendDate = attendDate || null;

        const key = { studentId, courseGroupId, attendDate };
        attendanceModel.deleteAttendance(key)
            .then(() => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Delete attendance success.',
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
            return res.status(201).json({ link_anh: result.secure_url });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi upload ảnh', error: error.message });
        }
    }
}

module.exports = new AttendanceController;