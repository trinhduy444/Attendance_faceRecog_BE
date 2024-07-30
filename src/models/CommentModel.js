const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class CommentModel {

    createComment(commenter_id, ref_table, ref_id, content) {
        return new Promise((resolve, reject) => {
            const q = 'insert into SysComment (ref_id, ref_table, commenter_id, content, status, creator_id, create_time) VALUES( ?, ?, ?, ?, ?, ?,getdate())';
            const params = [ref_id, ref_table, commenter_id, content, 1, commenter_id];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                else {
                    resolve(true);
                }
            });
        });
    }
    getAllComments(post_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT 
                    sc.ref_id,
                    sc.content,
                    sc.commenter_id,
                    su.nickname,
                    su.avatar_path,
                    sc.create_time
                FROM
                    SysComment sc
                JOIN
                    sysUser su ON sc.commenter_id = su.user_id
                WHERE
                    sc.status = 1 AND sc.ref_id = ?
                ORDER BY 
                    sc.create_time ASC;`;
    
            const params = [ post_id];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    

}

module.exports = new CommentModel;