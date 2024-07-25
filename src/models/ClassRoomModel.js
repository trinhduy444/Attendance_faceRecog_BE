const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class ClassRoomModel {
    createRoom(classroom_code, capacity, floor, desciption = "", status = 0, user_id) {
        return new Promise((resolve, reject) => {
            const q = 'INSERT INTO Classroom (classroom_code, capacity, floor, description, status, creator_id, updater_id, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, getdate(), getdate())';
            const params = [classroom_code, capacity, floor, desciption, status, user_id, user_id];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    db.query('EXEC InsertClassRoomWithShifts @classroom_code = ?', [classroom_code], (err, result) => {
                        if (err) {
                            console.error('Error executing stored procedure:', err);
                            reject(err);
                        } else {
                            resolve(classroom_code);
                        }
                    });
                }
            });
        });
    }

    checkRoomExists = (classroom_code) => {
        return new Promise((resolve, reject) => {
            const q = 'SELECT COUNT(*) AS count FROM Classroom WHERE classroom_code = ?';
            const params = [classroom_code];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].count > 0);
                }
            });
        });
    };

    createRooms = async (rooms, user_id) => {
        const arrayFail = [];
        const arraySuccess = [];

        for (const room of rooms) {
            const { 'Tòa': building, 'Số phòng': roomNumber, 'Tầng': floor, 'Số lượng người': capacity, 'Miêu tả': description } = room;
            const classroom_code = `${building}${floor}${roomNumber}`;
            const exists = await this.checkRoomExists(classroom_code);
            if (exists) {
                arrayFail.push(classroom_code);
            } else {
                await this.createRoom(classroom_code, capacity, floor, description || '', 0, user_id);
                arraySuccess.push(classroom_code);
            }
        }
        return { arrayFail, arraySuccess };
    };


    getClassRooms(limit, skip) {
        return new Promise((resolve, reject) => {
            const q = 'SELECT * FROM Classroom ORDER BY classroom_code ASC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY';
            const params = [skip, limit];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getClassRoomsFilter(building, capacity) {
        return new Promise((resolve, reject) => {
            let q = 'SELECT * FROM Classroom where status = 0'
            const params = [];
            if (building) {
                q += 'and classroom_code like ?'
                params.push(`[${building}]%`)
            }
            if (capacity) {
                q += ' AND capacity >= ?';
                params.push(capacity);
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
    getShiftEmpty(classroom_code) {
        return new Promise((resolve, reject) => {
            let q = 'SELECT shift_code FROM ClassroomShift where status = 0 and classroom_code = ?'
            const params = [classroom_code];
            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const shiftCodes = rows.map(row => row.shift_code);
                    resolve(shiftCodes);
                }
            });
        });
    }

    setRoomNotEmpty(shift_code, classroom_code) {
        return new Promise((resolve, reject) => {
            const q = 'update ClassRoomShift set status = 1 where shift_code = ? and classroom_code = ? ';
            const params = [shift_code, classroom_code];
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = new ClassRoomModel();