require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateJWTToken(userid) {
    const token = jwt.sign({ 'user_id': userid }, process.env.JWT_PRIVATE_KEY, { expiresIn: 3 * 60 * 60 });
    return token;
}

function verifyJWTToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        return decoded.user_id;
    } catch (err) {
        return null;
    }
}

module.exports = {generateJWTToken, verifyJWTToken};