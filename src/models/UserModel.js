require('dotenv').config();

const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');
const bcrypt = require('bcrypt');
const { getRedis } = require('../config/RedisConfig');

const facultyList = {
    "Công Nghệ Thông Tin": 10010,
    "Quản Trị Kinh Doanh": 10011,
    "Điện - Điện tử": 10012,
    "Kế toán": 10013,
    "Luật": 10014,
    "Thiết kế đồ họa": 10015,
}
const genderList = {
    "Nam": 1,
    "Nữ": 0,
};
class UserModel {
    // Get user by ID
    getUserById(userId) {
        userId = sql.Int(userId);
        return new Promise((resolve, reject) => {
            const q = 'select sysuser.* ,faculty.faculty_name from sysuser left join faculty on Sysuser.faculty_id = faculty.faculty_id where user_id = ?';
            const params = [userId];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    // Get user by username
    getUserByUsername(username) {
        username = sql.VarChar(username);
        return new Promise((resolve, reject) => {
            const q = 'select top 1 * from sysuser where username = ?';
            const params = [username];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getUserIdByUsername(username) {
        username = sql.VarChar(username);
        return new Promise((resolve, reject) => {
            const q = 'select user_id from sysuser where username = ?';
            const params = [username];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].user_id);
                }
            });
        });
    }
    checkExistUser(username) {
        username = sql.VarChar(username);
        return new Promise((resolve, reject) => {
            const q = 'select user_id from sysuser where username = ? and status = ?';
            const params = [username, 1];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(false);
                } else {
                    if (rows.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    checkExistUserByUsernameAndEmail(username, email) {
        username = sql.VarChar(username);
        return new Promise((resolve, reject) => {
            const q = 'select user_id from sysuser where username = ? and email = ? and status = ?';
            const params = [username, email, 1];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(false);
                } else {
                    if (rows.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    // Get user_id by username
    getUserIdByUsername(username) {
        username = sql.VarChar(username);
        return new Promise((resolve, reject) => {
            const q = 'select user_id from sysuser where username = ?';
            const params = [username];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    // Get user by email
    getUserByEmail(email) {
        email = sql.VarChar(email);
        return new Promise((resolve, reject) => {
            const q = 'select top 1 * from sysuser where email = ?';
            const params = [email];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all users
    getAllUsers() {
        const cacheKey = 'allUsers';

        return new Promise(async (resolve, reject) => {
            try {
                const redisClient = getRedis();
                const cachedData = await redisClient.get(cacheKey);

                if (cachedData) {
                    console.log('Data retrieved from Redis cache');
                    return resolve(JSON.parse(cachedData));
                }
                const query = `SELECT 
                            user_id, 
                            email, 
                            username, 
                            nickname, 
                            phone, 
                            avatar_path, 
                            course_year, 
                            gender,
                            status, 
                            faculty.faculty_name 
                           FROM sysuser 
                           LEFT JOIN faculty 
                           ON sysuser.faculty_id = faculty.faculty_id 
                           WHERE role_id = 3`;

                db.query(query, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    // Lưu kết quả vào Redis với thời gian sống (TTL) là 1 giờ (3600 giây)
                    redisClient.set(cacheKey, JSON.stringify(rows), {
                        EX: 3600,
                    });

                    console.log('Data retrieved from SQL and stored in Redis');
                    resolve(rows);
                });
            } catch (err) {
                console.error('Error while retrieving data: ', err);
                reject(err);
            }
        })
    };

    // Get all users Detail
    getAllUsersDetail(faculty_id, inputFilter, type, genderFilter) {
        return new Promise((resolve, reject) => {
            // Base query
            let q = 'select user_id, email, username, nickname, phone, avatar_path, course_year, gender, sysuser.status, faculty.faculty_name ' +
                'from sysuser left join faculty On SysUser.faculty_id = faculty.faculty_id where role_id = 3';
            const params = [];

            if (faculty_id) {
                q += ' and sysuser.faculty_id = ?';
                params.push(faculty_id);
            }
            if (genderFilter) {
                q += ' and gender = ?';
                params.push(genderFilter);
            }
            // Add filtering based on type
            if (type === 0 && inputFilter) {
                q += ' and nickname LIKE ?';
                params.push(`%${inputFilter}%`);
            } else if (type === 1 && inputFilter) {
                q += ' and username LIKE ?';
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

    // Get user faces
    getUserFaces(userId) {
        userId = sql.Int(userId);

        return new Promise((resolve, reject) => {
            const q = 'select a.user_face_id, a.user_id, a.username, a.nickname, a.face_image_path from vSysUserFace a where a.user_id = ?';
            const params = [userId];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all teachers
    getAllTeachers() {
        const cacheKey = 'allTeachers';

        return new Promise(async (resolve, reject) => {
            try {
                const redisClient = getRedis();
                const cachedData = await redisClient.get(cacheKey);

                if (cachedData) {
                    console.log('Data retrieved from Redis cache');
                    return resolve(JSON.parse(cachedData));
                }
                const q = 'select user_id, email, username, nickname, phone, avatar_path, course_year, gender,status, faculty.faculty_name from sysuser left join faculty On SysUser.faculty_id = faculty.faculty_id where role_id = 2';

                db.query(q, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        redisClient.set(cacheKey, JSON.stringify(rows), {
                            EX: 3600,
                        });

                        console.log('Data retrieved from SQL and stored in Redis');
                        resolve(rows);
                    }
                });

            } catch (err) {
                console.error('Error while retrieving data: ', err);
                reject(err);
            }

        });
    }

    // Get All Admin
    getAllAdmins() {
        const cacheKey = 'allAdmins';

        return new Promise(async (resolve, reject) => {
            try {
                const redisClient = getRedis();
                const cachedData = await redisClient.get(cacheKey);

                if (cachedData) {
                    console.log('Data retrieved from Redis cache');
                    return resolve(JSON.parse(cachedData));
                }
                const q = 'select user_id, email, username, nickname, phone, avatar_path,status from sysuser where role_id= 1';

                db.query(q, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        redisClient.set(cacheKey, JSON.stringify(rows), {
                            EX: 3600,
                        });

                        console.log('Data retrieved from SQL and stored in Redis');
                        resolve(rows);
                    }
                });

            } catch (err) {
                console.error('Error while retrieving data: ', err);
                reject(err);
            }

        });
    }

    getAllTeachersByFaculty(faculty_id) {
        return new Promise((resolve, reject) => {
            let q = 'select user_id, email, username, nickname from sysuser where role_id = 2 and faculty_id = ?';
            const params = [faculty_id]
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    // Get all users by page with page info
    getAllUsersPagination(otherJoins, otherFields, order, search, page, limit) {
        otherJoins = sql.VarChar(otherJoins);
        otherFields = sql.VarChar(otherFields);
        order = sql.VarChar(search);
        page = sql.Int(page);
        limit = sql.Int(limit);
        return new Promise((resolve, reject) => {
            const q = "exec TableLoadingPagination 'sysuser', ?, ?, ?, ?, ?, ?";
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

    addUser(user) {
        /*
        console.log(user);
        return new Promsise((resolve, reject) => {
            const q = 'insert into sysuser()'
            const params = []
        });
        */
    }
    //Get user_id from list
    async getUserIdFromList(students) {
        const arrUsersid = await Promise.all(students.map((user) => this.getUserIdByUsername(user.MSSV)))
        const userIds = arrUsersid.map((user) => user[0].user_id);
        return userIds;
    }
    deleteKey(key = '') {
        const redisClient = getRedis();
        redisClient.del(key, (err, response) => {
            if (err) {
                console.error('Error deleting cache:', err);
            } else if (response === 1) {
                console.log(`Cache with key '${cacheKey}' was deleted`);
            } else {
                console.log(`Cache with key '${cacheKey}' does not exist`);
            }
        });
    }
    //Create Admin 
    createAdmin(email, username, password, nickname, phone, creator_id) {
        this.deleteKey('allAdmins')
        return new Promise(async (resolve, reject) => {
            const passwordHashed = await bcrypt.hash(password, 10);
            const q = `insert into sysuser(email, username, password, nickname, phone, role_id, status, creator_id,create_time) values(?, ?, ?, ?, ?, ?, ?, ?, getDate())`;
            const params = [email, username, passwordHashed, nickname, phone, 1, 1, creator_id];
            db.query(q, params, (err, row) => {
                if (err) reject(err);

                resolve(row)
            });
        })

    }
    // Create Multiple Users
    createUsers = async (users, creatorId) => {
        this.deleteKey('allUsers')
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(users) || users.length === 0) {
                return reject(new Error('Invalid users array'));
            }

            try {
                const values = await Promise.all(users.map(async (user) => {
                    const { MSSV, 'Họ Lót': hoLot, 'Tên': ten, Email, Phone, 'Khoa': faculty, 'Khóa': course_year, Gender } = user;
                    const nickname = `${hoLot} ${ten}`;
                    const phoneStr = String(Phone); // Chuyển đổi Phone thành chuỗi
                    const last3DigitsOfPhone = phoneStr.slice(-3);
                    const last4DigitsOfMSSV = MSSV.toString().slice(-4);
                    const firstNameNormalized = ten.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
                    const passwordPlain = `${last3DigitsOfPhone}${firstNameNormalized.charAt(0).toUpperCase() + firstNameNormalized.slice(1)}${last4DigitsOfMSSV}`;
                    const passwordHashed = await bcrypt.hash(passwordPlain, 10);
                    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    const newFaculty = facultyList[faculty]
                    const newGender = genderList[Gender]
                    return [
                        Email,
                        MSSV,
                        passwordHashed,
                        nickname,
                        phoneStr,
                        '',
                        '',
                        3,
                        1,
                        creatorId,
                        creatorId,
                        currentTime,
                        currentTime,
                        course_year,
                        newFaculty,
                        newGender
                    ];
                }));
                // console.log("values", values)
                const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
                const q = `INSERT INTO SysUser (email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time, course_year, faculty_id, gender) VALUES ${placeholders}`;

                const flattenedValues = values.flat();
                db.query(q, flattenedValues, (err, result) => {
                    if (err) {
                        console.error("Error inserting users into database:", err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } catch (err) {
                console.error("Error processing users data:", err);
                reject(err);
            }
        });
    }

    createTeachers = async (teachers, creatorId) => {
        this.deleteKey('allTeachers')

        return new Promise(async (resolve, reject) => {
            try {
                const values = await Promise.all(teachers.map(async (teachers) => {
                    const { 'Học Hàm': hocHam, 'Họ và Tên': hoVaTen, Email, Phone, 'Khoa': faculty, 'Khóa': course_year, Gender } = teachers;
                    const nickname = `${hocHam} ${hoVaTen}`;
                    const phoneStr = String(Phone);
                    //password 3 số cuối sdt+ Ten(inhoa chữ đầu) + khóa (Guang vien)
                    const last3DigitsOfPhone = phoneStr.slice(-3);
                    const ten = hoVaTen.split(' ').pop();
                    const firstNameNormalized = ten.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const passwordPlain = `${last3DigitsOfPhone}${firstNameNormalized.charAt(0).toUpperCase() + firstNameNormalized.slice(1)}${course_year}`;
                    const passwordHashed = await bcrypt.hash(passwordPlain, 10);

                    const newFaculty = facultyList[faculty]
                    const newGender = genderList[Gender]
                    return [
                        Email,
                        passwordHashed,
                        nickname,
                        phoneStr,
                        2,
                        1,
                        creatorId,
                        course_year,
                        newFaculty,
                        newGender
                    ];
                }));
                const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, GETDATE() , ?, ?, ?)').join(',');
                const q = `INSERT INTO SysUser (email, password, nickname, phone, role_id, status, creator_id, create_time, course_year, faculty_id, gender) VALUES ${placeholders}`;
                const flattenedValues = values.flat();

                db.query(q, flattenedValues, (err, result) => {
                    if (err) {
                        console.error("Error inserting users into database:", err);
                        reject(err);
                    } else {
                        db.query('EXEC GenerateTeacherUsername', (err, procedureResult) => {
                            if (err) {
                                console.error("Error executing stored procedure:", err);
                                reject(err);
                            } else {
                                resolve({ insertResult: result, procedureResult });
                            }
                        });
                    }
                });
            } catch (err) {
                console.error("Error processing users data:", err);
                reject(err);
            }
        });
    }
    updateAvatarUser(user_id, avatar_path) {
        console.log(user_id, avatar_path);
        user_id = sql.Int(user_id);
        avatar_path = sql.VarChar(avatar_path);

        return new Promise((resolve, reject) => {
            const q = 'update sysuser SET avatar_path = ? WHERE user_id = ?';
            const params = [avatar_path, user_id]
            db.query(q, params, (err, result) => {
                if (err) { reject(err); }
                resolve(result);
            })

        });
    }

    getTeacherIDByMSGV(MSGV) {
        return new Promise((resolve, reject) => {
            const q = 'select user_id from sysuser where username = ?'
            db.query(q, [MSGV], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].user_id);
                }
            })
        });
    }
    changePassword(user_id, newPassword) {
        // new password was hashed
        user_id = sql.Int(user_id);
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        return new Promise((resolve, reject) => {
            const q = 'update sysuser set password = ?, update_time = ? where user_id = ?';
            const params = [newPassword, currentTime, user_id];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject("Not found user");
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getImageAndNicknameByUsername(username) {
        return new Promise((resolve, reject) => {
            const q = 'select avatar_path, nickname, username from sysUser where username = ? and status = ?';
            db.query(q, [username, 1], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getSomeInfo(user_id) {
        return new Promise((resolve, reject) => {
            const q = 'select su.avatar_path, su.nickname, su.username, su.faculty_id,fa.faculty_name   from sysUser as su INNER JOIN Faculty as fa on su.faculty_id = fa.faculty_id where user_id = ? and status = ?';
            db.query(q, [user_id, 1], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    lockAccount(user_id, updater_id, type = 1) {
        return new Promise((resolve, reject) => {
            const q = 'UPDATE SysUser SET status = 0, updater_id = ?, update_time = GETDATE() WHERE user_id = ?';
            db.query(q, [updater_id, user_id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    switch (type) {
                        case 1: {
                            this.deleteKey('allAdmins')
                            resolve(rows);
                            break;
                        }
                        case 2: {
                            this.deleteKey('allTeachers')
                            resolve(rows);
                            break;
                        }
                        case 3: {
                            // console.log('delete')
                            this.deleteKey('allUsers')
                            resolve(rows);
                            break;
                        }
                        default: {
                            this.deleteKey('allAdmins')
                            resolve(rows);
                            break;
                        }
                    }

                }
            });
        });
    }

    unLockAccount(user_id, updater_id, type = 1) {
        return new Promise((resolve, reject) => {
            const q = 'UPDATE SysUser SET status = 1, updater_id = ?, update_time = GETDATE() WHERE user_id = ?';
            db.query(q, [updater_id, user_id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    switch (type) {
                        case 1: {
                            this.deleteKey('allAdmins')
                            resolve(rows);
                            break;
                        }
                        case 2: {
                            this.deleteKey('allTeachers')
                            resolve(rows);
                            break;
                        }
                        case 3: {
                            this.deleteKey('allUsers')
                            resolve(rows);
                            break;
                        }
                        default: {
                            this.deleteKey('allAdmins')
                            resolve(rows);
                            break;
                        }
                    }
                }
            });
        });
    }
    getFacultyByUserId(user_id) {
        return new Promise((resolve, reject) => {
            const q = `SELECT sy.faculty_id, fa.faculty_name FROM SysUser sy RIGHT JOIN faculty fa ON sy.faculty_id = fa.faculty_id WHERE sy.user_id = ?;`;
            db.query(q, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0])
                }
            })
        })
    }
    updateUser(oldKey, user) {

    }
    deleteUser(key) {

    }
    updatePassword(username, email, hashedPassword) {
        return new Promise((resolve, reject) => {
                const q = `UPDATE SysUser SET password = ? WHERE username = ? AND email = ?`;

            const params = [hashedPassword, username, email];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = new UserModel;