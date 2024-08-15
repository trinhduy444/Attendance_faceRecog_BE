const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class PostModel {
    checkIsTeacherInGroup(teacher_id, course_group_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT CASE WHEN EXISTS ( 
                         SELECT 1 
                         FROM coursegroup 
                         WHERE teacher_id = ? AND course_group_id = ? 
                       ) 
                       THEN 'TRUE' 
                       ELSE 'FALSE' 
                     END AS has_course_group`;
            const params = [teacher_id, course_group_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result[0].has_course_group === 'TRUE') {
                        resolve(true);
                    }
                    resolve(false);
                }
            });
        });
    }
    createPost(course_group_id, user_id, title, content, file_link) {
        return new Promise((resolve, reject) => {
            const q = `INSERT INTO PostGroup (course_group_id, title, content, file_link, status, creator_id, create_time) 
                       VALUES (?, ?, ?, ?, ?, ?, getDate())`;
            const params = [course_group_id, title, content, file_link, 1, user_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    getAllPostValid(course_group_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT pg.*, su.nickname, su.avatar_path 
                    FROM PostGroup AS pg 
                    RIGHT JOIN SysUser AS su ON su.user_id = pg.creator_id 
                    WHERE pg.status = 1 AND pg.course_group_id = ?
                    ORDER BY pg.create_time DESC;
                    `;
            const params = [course_group_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    checkIsCreated(post_id, creator_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT CASE WHEN EXISTS ( 
                         SELECT 1 
                         FROM PostGroup 
                         WHERE post_id = ? AND creator_id = ? 
                       ) 
                       THEN 'TRUE' 
                       ELSE 'FALSE' 
                     END AS has_created_post`;
            const params = [post_id, creator_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result[0].has_created_post === 'TRUE') {
                        resolve(true);
                    }
                    resolve(false);
                }
            });
        });
    }

    setPostInvalid(post_id, updater_id) {
        return new Promise((resolve, reject) => {
            const q = `UPDATE PostGroup SET updater_id = ?, update_time = GETDATE(), status = 0 WHERE post_id = ?`;
            const params = [updater_id, post_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    updatePost(post_id, updater_id, title, content, file_link) {
        return new Promise((resolve, reject) => {
            let fieldsToUpdate = [];
            let params = [updater_id];  
            if (title !== undefined) {
                fieldsToUpdate.push('title = ?');
                params.push(title);
            }

            if (content !== undefined) {
                fieldsToUpdate.push('content = ?');
                params.push(content);
            }

            if (file_link !== undefined) {
                fieldsToUpdate.push('file_link = ?');
                params.push(file_link);
            }

            params.push(post_id); // Luôn luôn cần post_id cho WHERE

            if (fieldsToUpdate.length > 0) {
                const q = `UPDATE PostGroup SET updater_id = ?, update_time = GETDATE(), ${fieldsToUpdate.join(', ')} WHERE post_id = ?`;
                db.query(q, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                reject(new Error('No fields to update.'));
            }
        });
    }



}

module.exports = new PostModel;