const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class NotifyModel {
    createNotification(title, file_link, content, user_id) {
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO sysNotify (sender_id, title, content, file_link, status, creator_id, create_time)
                OUTPUT INSERTED.notify_id
                VALUES (?, ?, ?, ?, ?, ?, GETDATE());`;

            const params = [user_id, title, content, file_link, 1, user_id];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows[0].notify_id);
                }
            });
        });
    }

    createReceived(type, valueType, notify_id, creator_id) {
        return new Promise((resolve, reject) => {
            let q = '';
            let params = [];

            if (type === 'users') {
                console.log("vô");
                switch (valueType) {
                    case 'allUsers':
                        q = 'SELECT user_id FROM sysUser';
                        break;
                    case 'admins':
                        q = 'SELECT user_id FROM sysUser WHERE role_id = 1';
                        break;
                    case 'teachers':
                        q = 'SELECT user_id FROM sysUser WHERE role_id = 2';
                        break;
                    case 'students':
                        q = 'SELECT user_id FROM sysUser WHERE role_id = 3';
                        break;
                    default:
                        q = 'SELECT user_id FROM sysUser';
                        break;
                }
            } else if (type === 'courseGroup') {
                q = 'SELECT student_id FROM CourseGroupStudentList WHERE course_group_id = ?';
                params.push(parseInt(valueType, 10));
            }

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const receiverIds = rows.map(row => row.user_id || row.student_id);
                    console.log("re", receiverIds);

                    if (receiverIds.length === 0) {
                        resolve('No receivers found.');
                        return;
                    }
                    const insertValues = receiverIds.map(id => [notify_id, id, 0, creator_id, new Date()]);
                    const placeholders = insertValues.map(() => '(?, ?, ?, ?, ?)').join(',');
                    const insertQuery = `INSERT INTO notifyUser (notify_id, receiver_id, status, creator_id, create_time) VALUES ${placeholders}`;

                    const flattenedValues = insertValues.reduce((acc, val) => acc.concat(val), []);

                    db.query(insertQuery, flattenedValues, (insertErr, insertResult) => {
                        if (insertErr) {
                            reject(insertErr);
                        } else {
                            resolve(insertResult);
                        }
                    });
                }
            });
        });
    }

    getAllNotifications() {
        return new Promise((resolve, reject) => {
            const q = 'Select sn.*,su.nickname from sysNotify as sn left join sysUser as su on su.user_id = sn.sender_id ORDER BY sn.create_time DESC '
            db.query(q, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows)
                }
            })
        });
    }
    hideNotification(notify_id, updater_id) {
        return new Promise((resolve, reject) => {
            const q = 'update SysNotify set status = 0, updater_id = ?, update_time = getDate() where notify_id = ?'
            const params = [updater_id, notify_id]
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }
    showNotification(notify_id, updater_id) {
        return new Promise((resolve, reject) => {
            const q = 'update SysNotify set status = 1, updater_id = ?, update_time = getDate() where notify_id = ?'
            const params = [updater_id, notify_id]
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }
    getAllNotificationsActiveByUser(receiver_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT sn.*, su.nickname, nu.status AS nu_status
                FROM NotifyUser AS nu
                RIGHT JOIN SysNotify AS sn ON nu.notify_id = sn.notify_id
                LEFT JOIN sysUser AS su ON sn.sender_id = su.user_id
                WHERE sn.status = 1 and nu.receiver_id = ?
                ORDER BY 
                    sn.create_time DESC;`
            const params = [receiver_id]
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows)
                }
            })
        });
    }
    viewNotification(notify_id, user_id) {
        return new Promise((resolve, reject) => {
            console.log("vô")
            const q = 'update NotifyUser set status = 1, updater_id = ?, update_time = getDate() where notify_id = ? and receiver_id = ?'
            const params = [user_id, notify_id, user_id]
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }
}

module.exports = new NotifyModel;