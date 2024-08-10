'use strict';
const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class ScheduleModel {
    getAllScheduleById(student_id) {
        return new Promise((resolve, reject) => {
            const q = `select * from AllSchedules where student_id = ? and status = ?`
            const params = [student_id,1]
            db.query(q,params,(err,result) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }
}

module.exports = new ScheduleModel();