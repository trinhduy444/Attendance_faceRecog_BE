const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class UserModel {
    // Get user by ID
    getUserById(userId) {
        userId = sql.Int(userId);
        return new Promise((resolve, reject) => {
            const q = 'select top 1 * from sysuser where user_id = ?';
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
            const q = 'select * from sysuser';
            
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
            let result = []
            db.query(q, params, (err, rows, output) => {
                if (err) reject(err);

                if (rows.length) result.push(rows);
                if (result.length == 2) {
                    resolve(result);
                }
            });
        });
    }

    addUser(user) {
        console.log(user);
    }

    changePassword(user) {
        
    }

    updateUser(oldKey, user) {

    }

    deleteUser(key) {

    }
}

module.exports = new UserModel;