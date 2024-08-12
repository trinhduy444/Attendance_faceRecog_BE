const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');
const sendMail = require('../config/nodeMailerConfig');
const { warningMailCG, banMailCG } = require('../helpers/mailContentHelper')
class AttendanceRawDataModel {
    // Get list of attendance raw data
    getAttendanceRawDatas(studentId, courseGroupId, attendDate, attendType) {
        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);
        attendType = sql.TinyInt(attendType);

        return new Promise((resolve, reject) => {
            const q = 'select * from attendancerawdata where ? in (student_id, 0) and ? in (course_group_id, 0) and (? is null or attend_date = ?) and ? in (attend_type, 0)';
            const params = [studentId, courseGroupId, attendDate, attendDate, attendType];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all AttendanceRawDatas
    getAllAttendanceRawDatas() {
        return new Promise((resolve, reject) => {
            const q = 'select * from attendancerawdata';

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add new AttendanceRawData
    addAttendanceRawData(attendanceRawData, userId) {
        let { studentId, courseGroupId, attendDate, attendType, attendTime, attendImagePath } = attendanceRawData;
        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);
        attendType = sql.TinyInt(attendType);
        attendTime = sql.VarChar(attendTime);
        attendImagePath = sql.VarChar(attendImagePath);
        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = 'insert into AttendanceRawData (student_id, course_group_id, attend_date, attend_type, attend_time, attend_image_path, creator_id, create_time) select ?, ?, ?, ?, ?, ?, ?, getdate()';
            const params = [studentId, courseGroupId, attendDate, attendType, attendTime, attendImagePath, userId];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /*
    // delete AttendanceRawData
    deleteAttendanceRawData(key) {
        let { AttendanceRawDataCode } = key;

        AttendanceRawDataCode = sql.VarChar(AttendanceRawDataCode);

        const q = 'delete AttendanceRawData where AttendanceRawData_code = ?';
        const params = [AttendanceRawDataCode];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    */

    // Update Attendance from raw data
    updateAttendanceFromRawData(courseGroupId, attendDate, userId) {
        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);
        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = "exec UpdateAttendanceFromRawData ?, ?, ?";
            const params = [courseGroupId, attendDate, userId];
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    // Get list of attendance
    getAttendances(studentId, courseGroupId, attendDate) {

        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);

        return new Promise((resolve, reject) => {
            const q = 'select * from vattendance where ? in (student_id, 0) and ? in (course_group_id, 0) and (? is null or attend_date = ?)';
            const params = [studentId, courseGroupId, attendDate, attendDate];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Update exists attendance
    updateAttendance(oldKey, attendance, userId) {
        let { studentId, courseGroupId, attendDate } = oldKey;
        let { attendYn, enterTime, note } = attendance;

        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);

        attendYn = sql.Bit(attendYn);
        enterTime = sql.VarChar(enterTime);
        note = sql.NVarChar(note);

        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = 'update attendance set attend_yn = ?, enter_time = ?, note = ?, updater_id = ?, update_time = getdate() where student_id = ? and course_group_id = ? and attend_date = ?';
            const params = [attendYn, enterTime, note, userId, studentId, courseGroupId, attendDate];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    // Delete attendance
    deleteAttendance(key) {
        let { studentId, courseGroupId, attendDate } = key;

        // Convert string to date
        attendDate = attendDate == null ? null : new Date(attendDate);

        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);
        attendDate = sql.Date(attendDate);

        const q = 'delete attendance where student_id = ? and course_group_id = ? and attend_date = ?';
        const params = [studentId, courseGroupId, attendDate];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    // Get attendance summary report
    getAttendanceSummaryReport(attendDate1, attendDate2, studentId, courseGroupId) {
        // Convert string to date
        attendDate1 = attendDate1 == null ? null : new Date(attendDate1);
        attendDate2 = attendDate2 == null ? null : new Date(attendDate2);

        attendDate1 = sql.Date(attendDate1);
        attendDate2 = sql.Date(attendDate2);
        studentId = sql.Int(studentId);
        courseGroupId = sql.Int(courseGroupId);

        return new Promise((resolve, reject) => {
            const q = "exec AttendanceSummaryReport ?, ?, ?, ?";
            const params = [attendDate1, attendDate2, studentId, courseGroupId];
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    // Get attendance detail report
    getAttendanceDetailReport(courseGroupId, studentId) {
        courseGroupId = sql.Int(courseGroupId);
        studentId = sql.Int(studentId);

        return new Promise((resolve, reject) => {
            const q = "exec AttendanceDetailReport ?, ?";
            const params = [courseGroupId, studentId];
            let result = [], cout = 1;
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);

                result.push(rows);

                if (result.length == 2 || cout == 2) {
                    resolve(result)
                }
                cout++;
            });
        });
    }
    checkStatusStudentInCourseGroup(courseGroupId, studentId) {
        courseGroupId = sql.Int(courseGroupId);
        studentId = sql.Int(studentId);

        return new Promise((resolve, reject) => {
            const q = "EXEC sp_CheckAttendanceStatus ?, ?";
            const params = [courseGroupId, studentId];
            db.query(q, params, async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const res = await this.handleSendMail(rows[0]);
                    console.log("row", rows[0]);
                    resolve(res);
                }
            });
        });
    }
    handleSendMail = async (result) => {
        let title;
        let content;
        if (!result) return false;
        if (result.type == 'no') {
            return false;
        } else if (result.type == 'warning') {
            console.log('here')
            title = `Cảnh báo sinh viên ${result?.student_name} nghỉ học nhiều`;
            content = warningMailCG(result)
                await sendMail(title, content, result.student_email)
            return true;
        }
        else if (result.type == 'ban') {
            title = `CẤM THI. Cảnh báo sinh viên ${result?.student_name}`;
            content = banMailCG(result)
                await sendMail(title, content, result.student_email)
            return true;
        }
        return false;
    }
}

module.exports = new AttendanceRawDataModel;