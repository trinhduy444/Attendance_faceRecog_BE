'use strict';
const sql = require('msnodesqlv8');
const db = require('../utils/SqlConnection');

class KeyStoreModel {
    getUserByRefreshTokenUsing(refreshTokenUsing) {
        return new Promise((resolve, reject) => {
            const q = 'SELECT * FROM keyStore WHERE refreshTokenUsing = ?';
            const params = [refreshTokenUsing];

            db.query(q, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    createKeyStore(user_id, privateKey, publicKey, refreshTokenUsing) {
        return new Promise((resolve, reject) => {
            const q = 'INSERT INTO keyStore (user_id, privateKey, publicKey, refreshTokenUsing, create_time, update_time) VALUES (?, ?, ?, ?, GETDATE(), GETDATE())';
            const params = [user_id, privateKey, publicKey, refreshTokenUsing];
            db.query(q, params, (err, result) => {
                if (err) {
                    const updateQuery = 'UPDATE keyStore SET privateKey = ?, publicKey = ?, refreshTokenUsing = ?, update_time = GETDATE() WHERE user_id = ?';
                    const updateParams = [privateKey, publicKey, refreshTokenUsing, user_id];
                    db.query(updateQuery, updateParams, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    resolve(result);
                }
            });
        });
    }
    deleteKeyStoreByRefreshTokenUsing(refreshTokenUsing) {
        const q = 'DELETE keyStore WHERE refreshTokenUsing = ?';
        const params = [refreshTokenUsing];

        return new Promise((resolve, reject) => {
            db.query(q, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = new KeyStoreModel();