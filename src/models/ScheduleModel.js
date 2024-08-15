'use strict';
const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class ScheduleModel {
    getAllScheduleById(student_id, semester_year_id) {
        return new Promise((resolve, reject) => {

            let q = `select * from AllSchedules where student_id = ? and status = ?`
            let params = [student_id, 1]
            if (semester_year_id) {
                q += ` and semester_year_id = ?`
                params.push(semester_year_id)
            }
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
    getSemesterNow() {
        return new Promise((resolve, reject) => {
            const q = `SELECT * 
                        FROM SemesterYear
                        WHERE semester_year_id = (
                            SELECT MAX(semester_year_id) 
                            FROM SemesterYear
                        );
                        `

            db.query(q, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result[0])
                }
            })
        })
    }
    getSemesterSomeInfo(semester_year_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT * 
                        FROM SemesterYear
                        WHERE semester_year_id = ?
                        `

            db.query(q, [semester_year_id],(err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result[0])
                }
            })
        })
    }
}

module.exports = new ScheduleModel();