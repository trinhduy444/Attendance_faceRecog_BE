const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');
const classRoomModel = require('./ClassRoomModel')
const userModel = require('./UserModel');
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
            const q = 'INSERT INTO CourseGroupStudentList (course_group_id, student_id, total_absent, ban_yn, status, creator_id, create_time) VALUES (?, ?,?,?, ?, ?, getdate())';
            const params = [course_group_id, userId, 0, 0, 1, creator_id];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    getCourseGroupID(course_code, group_code) {
        return new Promise((resolve, reject) => {
            const q = 'select course_group_id from CourseGroup where course_code = ? and group_code = ?';
            const params = [course_code, group_code];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].course_group_id);
                }
            });
        });
    }
    createMultiStudentList = async (studentLists, creator_id) => {
        // console.log("create", studentLists)
        return new Promise(async (resolve, reject) => {

            try {
                const values = await Promise.all(studentLists.map(async (student) => {
                    const { MSSV, 'Mã môn': course_code, 'Nhóm': group_code } = student;

                    const user_id = await userModel.getUserIdByUsername(MSSV);
                    // console.log("user_id", user_id[0].user_id)
                    const course_group_id = await this.getCourseGroupID(course_code, group_code);
                    // console.log("course_group", course_group_id)

                    return [
                        course_group_id,
                        user_id[0].user_id,
                        0,
                        0,
                        1,
                        creator_id
                    ];
                }));

                // Prepare the query
                const q = `
                INSERT INTO CourseGroupStudentList (course_group_id, student_id,total_absent,ban_yn, status, creator_id, create_time)
                VALUES ${values.map(() => '(?, ?, ?, ?, ?, ?,getDate())').join(', ')}
            `;

                const flattenedValues = values.flat();

                db.query(q, flattenedValues, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });

            } catch (error) {
                console.error('Error in createMultiStudentList:', error);
                return res.status(500).json({
                    status: 500,
                    message: error.message,
                });
            }
        })
    };


    createCourseGroup = async (classroomshift_id, course_code, group_code, teacher_id, total_student_qty, usersId, creator_id, semester_year_id, week_day) => {
        return new Promise(async (resolve, reject) => {
            const q = 'INSERT INTO CourseGroup (course_code, group_code, teacher_id, total_student_qty, status, creator_id, create_time,classroomshift_id,semester_year_id) OUTPUT INSERTED.course_group_id VALUES (?, ?, ?, ?, ?, ?, getdate(),?,?)';
            const params = [course_code, group_code, teacher_id, total_student_qty, 1, creator_id, classroomshift_id, semester_year_id];
            try {
                db.query(q, params, async (err, result) => {
                    if (err) {
                        return reject(err);
                    }

                    const course_group_id = result[0].course_group_id;
                    const semesterInfo = await this.getSemesterById(semester_year_id);
                    const total_shift = parseInt(semesterInfo[0].week_to) - parseInt(semesterInfo[0].week_from)

                    await this.createSchedule(course_group_id, classroomshift_id, semester_year_id, semesterInfo[0].week_from, semesterInfo[0].week_to, week_day, semesterInfo[0].exclude_week, total_shift, creator_id);

                    await Promise.all(usersId.map(userid => this.createCourseGroupStudentList(course_group_id, userid, creator_id)));

                    resolve({ course_group_id, ...result[0] });
                });
            } catch (error) {
                reject(error);
            }
        });
    };
    createMutipleCourseGroup = async (courseGroups, creator_id) => {
        try {
            const values = await Promise.all(courseGroups.map(async (cg) => {
                const { 'Mã môn': course_code, 'Mã nhóm': group_code, 'Sĩ số': total_student_qty, 'Thứ': week_day, 'Tuần bắt đầu': week_from,
                    'Tuần kết thúc': week_to, 'Tuần nghỉ': exclude_week, 'Ca học': shift, 'Tổng ca': total_shift,
                    'Phòng': classroom_code, 'Học kỳ': semester, 'Năm học': year, 'MSGV': MSGV } = cg;


                const shift_code = `ca${shift}`;
                const classroomshift_id = await classRoomModel.setRoomNotEmpty(shift_code, classroom_code, creator_id);
                const [{ semester_year_id }] = await this.getSemesterIDByInfo(semester, year);
                const teacher_id = await userModel.getTeacherIDByMSGV(MSGV);
                const status = 1;
                return {
                    courseGroup: [
                        course_code,
                        group_code,
                        teacher_id,
                        total_student_qty,
                        classroomshift_id,
                        semester_year_id,
                        status,
                        creator_id
                    ],
                    schedule: [
                        classroomshift_id,
                        semester_year_id,
                        week_day,
                        week_from,
                        week_to,
                        exclude_week,
                        total_shift,
                        creator_id
                    ]
                };
            }));

            const courseGroupValues = values.map(v => v.courseGroup).flat();
            const scheduleValues = values.map(v => v.schedule);

            const q = `
                INSERT INTO CourseGroup (course_code, group_code, teacher_id, total_student_qty, classroomshift_id, semester_year_id,status, creator_id, create_time)
                OUTPUT INSERTED.course_group_id
                VALUES ${values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?,getDate())').join(', ')}
            `;

            db.query(q, courseGroupValues, async (err, result) => {
                if (err) {
                    console.error('Error inserting course groups:', err);
                    reject(err);
                }

                for (let i = 0; i < result.length; i++) {
                    const course_group_id = parseInt(result[i].course_group_id);
                    const [classroomshift_id,
                        semester_year_id,
                        week_day,
                        week_from,
                        week_to,
                        exclude_week,
                        total_shift,
                        creator_id
                    ] = scheduleValues[i];

                    await this.createSchedule(
                        course_group_id,
                        classroomshift_id,
                        semester_year_id,
                        week_from,
                        week_to,
                        week_day,
                        exclude_week,
                        total_shift,
                        creator_id
                    );
                }
            });
        } catch (error) {
            console.error('Error inserting course groups:', error);
            throw error;
        }
    };

    createSchedule = (course_group_id, classroomshift_id, semester_year_id, week_from, week_to, week_day, exclude_week, total_shift, creator_id) => {
        if (exclude_week === null || exclude_week === undefined) {
            exclude_week = '';
        }
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO Schedule (course_group_id, classroomshift_id, semester_year_id, week_from, week_to, week_day , exclude_week,total_shift,status, creator_id, create_time) 
                VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, getDate())
            `;
            const params = [course_group_id, classroomshift_id, semester_year_id, week_from, week_to, week_day, exclude_week, total_shift, 1, creator_id];

            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
    getCourseGroupByTeacherId(teacher_id, semester_year_id) {
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
    getCourseGroupByStudentId(student_id, semester_year_id, course_group_id) {
        // console.log("adad", student_id, semester_year_id, course_group_id)
        return new Promise((resolve, reject) => {
            // const q = 'EXEC GetCourseGroupInfoByStudentId @student_id = ?'
            let q = 'SELECT * FROM ViewCourseGroupInfoByStudentId WHERE student_id = ?'
            let params = [student_id]

            if (semester_year_id) {
                q += ` and semester_year_id = ?`;
                params.push(semester_year_id);
            }
            if (course_group_id) {
                q += ` and course_group_id = ?`;
                params.push(course_group_id);
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
            let q = `SELECT * FROM CourseGroupInfoView ORDER BY semester_year_id DESC;`;
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
    getAllSemester() {
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
    getSemesterById(semester_year_id) {

        return new Promise((resolve, reject) => {
            let q = `select * from SemesterYear where semester_year_id = ?`;
            db.query(q, [semester_year_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // console.log("ress",result);
                    resolve(result);
                }
            });
        });
    }

    getSemesterIDByInfo(semester, year) {
        return new Promise((resolve, reject) => {
            let q = `select semester_year_id from SemesterYear where semester = ? and year = ?`;
            const params = [semester, year];
            db.query(q, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // View All Student in Course Group
    viewAllStudentCourseGroup(status, teacher_id, course_group_id) {

        return new Promise((resolve, reject) => {
            let q = `select * from viewAllStudentInCourseGroup where course_group_id = ?`;
            let params = [course_group_id];

            if (status) {
                status = sql.Int(status);
                q += ` and status = ?`
                params.push(status);
            }
            if (teacher_id) {
                teacher_id = sql.Int(teacher_id);
                q += ` and teacher_id = ?`
                params.push(teacher_id);
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
    // Update student total absent
    updateTotalAbsent(courseGroupId, studentList) {
        courseGroupId = sql.Int(courseGroupId);
        studentList = sql.VarChar(studentList);

        const q = 'exec UpdateTotalAbsent ?, ?';
        const params = [courseGroupId, studentList];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    // Update all student total absent
    updateAllTotalAbsent(courseGroupId) {
        courseGroupId = sql.Int(courseGroupId);

        const q = 'exec UpdateTotalAbsent ?';
        const params = [courseGroupId];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = new CourseModel;