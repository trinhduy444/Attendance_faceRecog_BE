const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class CourseModel {
    // Get course by Code
    getCourseByCode(courseCode) {
        courseCode = sql.VarChar(courseCode);
        return new Promise((resolve, reject) => {
            const q = 'select top 1 * from course where course_code = ?';
            const params = [courseCode];
            
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get all courses
    getAllCourses() {
        return new Promise((resolve, reject) => {
            const q = 'select * from course';
            
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get all courses by page with page info
    getAllCoursesPagination(otherJoins, otherFields, order, search, page, limit) {
        otherJoins = sql.VarChar(otherJoins);
        otherFields = sql.VarChar(otherFields);
        order = sql.VarChar(search);
        page = sql.Int(page);
        limit = sql.Int(limit);
        return new Promise((resolve, reject) => {
            const q = "exec TableLoadingPagination 'course', ?, ?, ?, ?, ?, ?";
            const params = [otherJoins, otherFields, order, search, page, limit];
            let result = [], cout = 1;
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);

                if (rows.length || cout == 3) result.push(rows);
                if (result.length == 2 || cout == 4) {
                    resolve(result);
                }
                cout++;
            });
        });
    }

    // Add new course
    addCourse(course, userId) {
        let { courseCode, courseName, credit, description, status } = course;
        
        courseCode = sql.VarChar(courseCode);
        courseName = sql.NVarChar(courseName);
        credit = sql.Int(credit);
        description = sql.NVarChar(description);
        status = sql.Bit(status);
        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = 'insert into course (course_code, course_name, credit, description, status, creator_id, updater_id, create_time, update_time) select ?, ?, ?, ?, ?, ?, ?, getdate(), getdate()';
            const params = [courseCode, courseName, credit, description, status, userId, userId];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    // Update exists course
    updateCourse(oldKey, course, userId) {
        let { oldCourseCode } = oldKey;
        let { courseCode, courseName, credit, description, status } = course;

        oldCourseCode = sql.VarChar(oldCourseCode);
        courseCode = sql.VarChar(courseCode);
        courseName = sql.NVarChar(courseName);
        credit = sql.Int(credit);
        description = sql.NVarChar(description);
        status = sql.Bit(status);
        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = 'update course set course_code = ?, course_name = ?, credit = ?, description = ?, status = ?, updater_id = ?, update_time = getdate() where course_code = ?';
            const params = [courseCode, courseName, credit, description, status, userId, oldCourseCode];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    // delete course
    deleteCourse(key) {
        let { courseCode } = key;

        courseCode = sql.VarChar(courseCode);

        const q = 'delete course where course_code = ?';
        const params = [courseCode];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = new CourseModel;