const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class RequestModel {
    getAllRequests() {
        return new Promise((resolve, reject) => {
            const q = 'select a.* from vAttendanceRequest a order by a.create_time desc'
            db.query(q, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows)
                }
            })
        });
    }

    getAllRequestsByActiveUser(user_id, role_id) {
        return new Promise((resolve, reject) => {

            let q = `select a.* from vAttendanceRequest a order by a.create_time desc`;

            if (role_id == 2) q = `select a.* from vAttendanceRequest a where a.teacher_id = ? order by a.create_time desc`;
            if (role_id == 3) q = `select a.* from vAttendanceRequest a where a.student_id = ? order by a.create_time desc`;

            const params = [user_id]
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows)
                }
            })
        });
    }

    createAttendanceRequest(request, user_id) {
        let { student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status } = request;

        // Convert string to date
        attend_date = attend_date == null ? null : new Date(attend_date);

        student_id = sql.Int(student_id);
        course_group_id = sql.Int(course_group_id);
        attend_date = sql.Date(attend_date);
        attend_type = sql.TinyInt(attend_type);
        proof_image_path = sql.VarChar(proof_image_path);
        file_link = sql.VarChar(file_link);
        content = sql.NVarChar(content);
        response = sql.NVarChar(response);
        request_type = sql.TinyInt(request_type);
        status = sql.TinyInt(status);
        user_id = sql.Int(user_id);

        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO AttendanceRequest (student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status, creator_id, updater_id, create_time, update_time)
                OUTPUT Inserted.*
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());`;
            const params = [student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status, user_id, user_id];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    updateAttendanceRequest(request_id, status, user_id) {
        request_id = sql.Int(request_id);
        status = sql.TinyInt(status);
        user_id = sql.Int(user_id);

        return new Promise((resolve, reject) => {
            const q = `EXEC sp_AfterUpdateAttendanceRequest ?, ?, ?`;
            const params = [request_id, status, user_id];

            db.query(q, params, (err, rows, output) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length > 0) {
                        resolve(rows[0].permission);
                    } else {
                        resolve(1);
                    }
                }
            });
        });
    }

    updateImageRequest(request_id, updater_id, proof_image_path) {
        request_id = sql.Int(request_id);
        updater_id = sql.Int(updater_id);
        return new Promise((resolve, reject) => {
            const q = 'UPDATE AttendanceRequest set updater_id = ?, proof_image_path = ?, update_time = getdate() WHERE request_id = ?'
            const params = [updater_id, proof_image_path, request_id]
            db.query(q, params, (err, res) => {
                if (err) {
                    reject(err)
                }else{
                    resolve(true)
                }
            })
        })

    }
}

module.exports = new RequestModel;