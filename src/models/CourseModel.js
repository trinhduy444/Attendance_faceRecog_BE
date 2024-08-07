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

    //Get Courses filter
    getCoursesFilter(faculty_id, inputFilter, type, credit) {
        return new Promise((resolve, reject) => {
            let q = 'select Course.*, faculty.faculty_name from Course left join faculty on Course.faculty_id = faculty.faculty_id where status = 1'
            const params = [];

            if (faculty_id) {
                q += ' and Course.faculty_id = ?';
                params.push(faculty_id);
            }
            if (credit) {
                q += ' and credit = ?';
                params.push(credit);
            }
            // Add filtering based on type
            if (type === 0 && inputFilter) {
                q += ' and course_name LIKE ?';
                params.push(`%${inputFilter}%`);
            } else if (type === 1 && inputFilter) {
                q += ' and course_code LIKE ?';
                params.push(`%${inputFilter}%`);
            }

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    // Get All CourseGroup
    getAllCourseGroupActive() {
        return new Promise((resolve, reject) => {
            const q = 'SELECT * FROM ActiveCourseGroups'
            db.query(q, (err, rows) => {
                if (err) {
                    reject(err)
                } else { resolve(rows) };
            })
        });
    }

    // Get course group student info list
    getCourseGroupStudentListInfo(courseGroupId) {
        courseGroupId = sql.Int(courseGroupId);

        return new Promise((resolve, reject) => {
            const q = 'select * from vCourseGroupStudentList where ? in (course_group_id, 0)';
            const params = [courseGroupId];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    }

    createCourseGroupStudentList(course_group_id, userId, creator_id) {
        return new Promise((resolve, reject) => {
            const q = 'INSERT INTO CourseGroupStudentList (course_group_id, student_id, status, creator_id, create_time) VALUES (?, ?, ?, ?, getdate())';
            const params = [course_group_id, userId, 1, creator_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    createCourseGroup(classroomshift_id, course_code, group_code, teacher_id, total_student_qty, usersId, creator_id) {
        return new Promise((resolve, reject) => {
            const q = 'INSERT INTO CourseGroup (course_code, group_code, teacher_id, total_student_qty, status, creator_id, create_time,classroomshift_id) OUTPUT INSERTED.course_group_id VALUES (?, ?, ?, ?, ?, ?, getdate(),?)';
            const params = [course_code, group_code, teacher_id, total_student_qty, 1, creator_id, classroomshift_id];

            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const course_group_id = result[0].course_group_id;

                    Promise.all(usersId.map(userid => this.createCourseGroupStudentList(course_group_id, userid, creator_id)))
                        .then(() => resolve({ course_group_id, ...result[0] }))
                        .catch(err => reject(err));
                }
            });
        });
    }

    getCourseGroupByTeacherId(teacher_id,semester_year_id) {
        return new Promise((resolve, reject) => {
            // const q = 'EXEC GetTeacherCourseInfo @teacher_id = ?'
            let q = `SELECT * FROM CourseGroupInfoView where teacher_id = ?`;
            let params = [teacher_id];
    
            if (semester_year_id) {
                q += ` and semester_year_id = ?`;
                params.push(semester_year_id);
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
    getCourseGroupByStudentId(student_id) {
        return new Promise((resolve, reject) => {
            const q = 'EXEC GetCourseGroupInfoByStudentId @student_id = ?'
            const params = [student_id]
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
    getInfoCourseGroup(course_group_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT
                cg.course_code,
                cg.teacher_id,
                cg.group_code,
                cg.semester_year_id,
                c.course_name,
                su.nickname
            FROM
                CourseGroup cg
                INNER JOIN Course c ON cg.course_code = c.course_code
                INNER JOIN sysUser su ON cg.teacher_id = su.user_id
            WHERE
            cg.course_group_id = ?;
            `
            const params = [course_group_id]
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    };
    getAllCourseGroup(semester_year_id) {
        return new Promise((resolve, reject) => {
            let q = `SELECT * FROM CourseGroupInfoView`;
            let params = [];
    
            if (semester_year_id) {
                q += ` WHERE semester_year_id = ?`;
                params.push(semester_year_id);
            }
    
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    checkInCourseGroup(courseGroupId, studentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) AS count
                FROM CourseGroupStudentList
                WHERE course_group_id = ? AND student_id = ?;
            `;

            db.query(query, [courseGroupId, studentId], (err, results) => {
                if (err) return reject(err);
                if (results[0].count > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };
    getAllSemester(){
        return new Promise((resolve, reject) => {
            let q = `select * from SemesterYear`;
            db.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new CourseModel;