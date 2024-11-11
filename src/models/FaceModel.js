const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class FaceModel {
    getAllUserFacesByUserId(user_id) {
        user_id = sql.Int(user_id);

        return new Promise((resolve, reject) => {
            const q = `SELECT * FROM SysUserFace WHERE user_id = ?`;
            const params = [user_id];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getUserFaceById(user_face_id) {
        user_face_id = sql.Int(user_face_id);

        return new Promise((resolve, reject) => {
            const q = `SELECT * FROM SysUserFace WHERE user_face_id = ?`;
            const params = [user_face_id];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }
    
    getNewRandomUuid() {
        return new Promise((resolve, reject) => {
            const q = `
                DECLARE @uuid VARCHAR(36)
                SET @uuid = NEWID()
                WHILE EXISTS(SELECT 1 FROM SysUserFace x WHERE x.uuid = @uuid) BEGIN
                    SET @uuid = NEWID()
                END
                SELECT @uuid AS uuid`;
            const params = [];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].uuid);
                }
            });
        });
    }

    addUserFaces(face, user_id) {
        var { student_id, face_image_path, uuid, status } = face;
        
        student_id = sql.Int(student_id);
        face_image_path = sql.NVarChar(face_image_path);
        uuid = sql.VarChar(uuid);
        status = sql.TinyInt(status);
        user_id = sql.Int(user_id);

        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO SysUserFace (user_id, face_image_path, uuid, status, creator_id, updater_id, create_time, update_time)
                OUTPUT Inserted.*
                VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());`;
            const params = [student_id, face_image_path, uuid, status, user_id, user_id];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    deleteUserFaceById(face_user_id) {
        getUserFaceById(face_user_id)
        .then((userFace) => {
            var uuid = userFace.uuid;
            
        });
    }

    // getAllRequestsByActiveUser(user_id, role_id) {
    //     return new Promise((resolve, reject) => {

    //         let q = `select a.* from vAttendanceRequest a order by a.create_time desc`;

    //         if (role_id == 2) q = `select a.* from vAttendanceRequest a where a.teacher_id = ? order by a.create_time desc`;
    //         if (role_id == 3) q = `select a.* from vAttendanceRequest a where a.student_id = ? order by a.create_time desc`;

    //         const params = [user_id]
    //         db.query(q, params, (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows)
    //             }
    //         })
    //     });
    // }

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

module.exports = new FaceModel;