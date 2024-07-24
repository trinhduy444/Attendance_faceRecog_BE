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
                    resolve(classroom_code);
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
        const arraySucces = [];

        for (const room of rooms) {
            const { 'Tòa': building, 'Số phòng': roomNumber, 'Tầng': floor, 'Số lượng người': capacity, 'Miêu tả': description } = room;
            const classroom_code = `${building}${floor}${roomNumber}`;
            const exists = await this.checkRoomExists(classroom_code);
            if (exists) {
                arrayFail.push(classroom_code);
            } else {
                await this.createRoom(classroom_code, capacity, floor, description || '', 0, user_id);
                arraySucces.push(classroom_code);
            }
        }
        return { arrayFail, arraySucces };
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

}

module.exports = new ClassRoomModel();