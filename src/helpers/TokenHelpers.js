require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateJWTToken(userid,role_id) {
    const token = jwt.sign({ 'user_id': userid, 'role_id':role_id }, process.env.JWT_PRIVATE_KEY, { expiresIn: 3 * 60 * 60 });
    return token;
}

function verifyJWTToken(token) {
    const decoded = jwt.decode(token);
    return decoded;
}



module.exports = { generateJWTToken, verifyJWTToken };