require('dotenv').config();

const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');
const bcrypt = require('bcrypt');
const facultyList = {
    "Công Nghệ Thông Tin": 10010,
    "Quản Trị Kinh Doanh": 10011,
    "Điện - Điện tử": 10012,
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
        return new Promise((resolve, reject) => {
            const q = 'select user_id, email, username, nickname, phone, avatar_path, course_year, gender, faculty.faculty_name from sysuser left join faculty On SysUser.faculty_id = faculty.faculty_id where role_id = 3';

            db.query(q, (err, rows) => {
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

    createUsers = async (users, creatorId) => {

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

    updateUser(oldKey, user) {

    }

    deleteUser(key) {

    }
}

module.exports = new UserModel;