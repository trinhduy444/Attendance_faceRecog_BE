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

    // updateAttendanceRequest(request_id, status, user_id) {
    //     request_id = sql.Int(request_id);
    //     status = sql.TinyInt(status);
    //     user_id = sql.Int(user_id);

    //     return new Promise((resolve, reject) => {
    //         const q = `
    //             INSERT INTO AttendanceRequest (student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status, creator_id, updater_id, create_time, update_time)
    //             OUTPUT Inserted.*
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());`;
    //         const params = [student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status, user_id, user_id];

    //         db.query(q, params, (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows[0]);
    //             }
    //         });
    //     });
    // }

    // createReceived(type, valueType, notify_id, creator_id) {
    //     return new Promise((resolve, reject) => {
    //         let q = '';
    //         let params = [];

    //         if (type === 'users') {
    //             // console.log("vô");
    //             switch (valueType) {
    //                 case 'allUsers':
    //                     q = 'SELECT user_id FROM sysUser';
    //                     break;
    //                 case 'admins':
    //                     q = 'SELECT user_id FROM sysUser WHERE role_id = 1';
    //                     break;
    //                 case 'teachers':
    //                     q = 'SELECT user_id FROM sysUser WHERE role_id = 2';
    //                     break;
    //                 case 'students':
    //                     q = 'SELECT user_id FROM sysUser WHERE role_id = 3';
    //                     break;
    //                 default:
    //                     q = 'SELECT user_id FROM sysUser';
    //                     break;
    //             }
    //         } else if (type === 'courseGroup') {
    //             q = 'SELECT student_id FROM CourseGroupStudentList WHERE course_group_id = ?';
    //             params.push(parseInt(valueType, 10));
    //         }

    //         db.query(q, params, (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 const receiverIds = rows.map(row => row.user_id || row.student_id);
    //                 // console.log("re", receiverIds);

    //                 if (receiverIds.length === 0) {
    //                     resolve('No receivers found.');
    //                     return;
    //                 }
    //                 const insertValues = receiverIds.map(id => [notify_id, id, 0, creator_id, new Date()]);
    //                 const placeholders = insertValues.map(() => '(?, ?, ?, ?, ?)').join(',');
    //                 const insertQuery = `INSERT INTO notifyUser (notify_id, receiver_id, status, creator_id, create_time) VALUES ${placeholders}`;

    //                 const flattenedValues = insertValues.reduce((acc, val) => acc.concat(val), []);

    //                 db.query(insertQuery, flattenedValues, (insertErr, insertResult) => {
    //                     if (insertErr) {
    //                         reject(insertErr);
    //                     } else {
    //                         resolve(insertResult);
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }

    
    // hideNotification(notify_id, updater_id) {
    //     return new Promise((resolve, reject) => {
    //         const q = 'update SysNotify set status = 0, updater_id = ?, update_time = getDate() where notify_id = ?'
    //         const params = [updater_id, notify_id]
    //         db.query(q, params, (err, result) => {
    //             if (err) {
    //                 reject(false)
    //             }
    //             else {
    //                 resolve(true)
    //             }
    //         })
    //     })
    // }
    // showNotification(notify_id, updater_id) {
    //     return new Promise((resolve, reject) => {
    //         const q = 'update SysNotify set status = 1, updater_id = ?, update_time = getDate() where notify_id = ?'
    //         const params = [updater_id, notify_id]
    //         db.query(q, params, (err, result) => {
    //             if (err) {
    //                 reject(false)
    //             }
    //             else {
    //                 resolve(true)
    //             }
    //         })
    //     })
    // }

    // viewNotification(notify_id, user_id) {
    //     return new Promise((resolve, reject) => {
    //         console.log("vô")
    //         const q = 'update NotifyUser set status = 1, updater_id = ?, update_time = getDate() where notify_id = ? and receiver_id = ?'
    //         const params = [user_id, notify_id, user_id]
    //         db.query(q, params, (err, result) => {
    //             if (err) {
    //                 reject(false)
    //             }
    //             else {
    //                 resolve(true)
    //             }
    //         })
    //     })
    // }
}

module.exports = new RequestModel;