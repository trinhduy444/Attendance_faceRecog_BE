
const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');
const sendMail = require('../config/nodeMailerConfig');

class TeacherModel {
    // Get user by ID
    sendMail = async (course_group_id, mailContent) => {
        const type = {
            "all": () => this.getAllEmailByCourseGroupId(course_group_id),
            "banned": () => this.getAllEmailByCourseGroupId(course_group_id, 1),
            "normal": () => this.getAllEmailByCourseGroupId(course_group_id, 0),
        }
        try {
            const emailArr = await (type[mailContent?.studentGroup] || type['all'])();
            const emails = emailArr.map(row => row.email);

            await sendMail(mailContent.title, mailContent.content, emails);
            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(error);
        }

    }
    getAllEmailByCourseGroupId(course_group_id, ban_yn) {
        return new Promise((resolve, reject) => {

            let q = `select sy.email from sysUser as sy right join CourseGroupStudentList as cgsl on sy.user_id = cgsl.student_id where course_group_id = ? and cgsl.status = 1`
            let params = [course_group_id]
            if (ban_yn) {
                q += ` and ban_yn = ?`
                params.push(ban_yn)
            }
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = new TeacherModel;