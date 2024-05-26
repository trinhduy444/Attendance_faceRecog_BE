const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');

class AuthController {
    login(req, res) {
        var { username, password } = req.body;
        username = username || '';
        password = password || '';
        
        userModel.getUserByUsername(username)
        .then((user) => {   
            if (user.length) {
                user = user[0];
                // Compare hash password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            'status': 500,
                            'message': err,
                            'data': {}
                        });
                    }
                    
                    if (result) {
                        // Create JWT Token
                        jwt.sign({ 'user_id': user.user_id }, process.env.JWT_PRIVATE_KEY, { expiresIn: 3 * 60 * 60 }, (err, token) => {
                            if (err) {
                                return res.status(500).json({
                                    'status': 200,
                                    'message': err,
                                    'data': {}
                                });
                            }
                            // Return JWT when login success
                            return res.status(200).json({
                                'status': 200,
                                'message': 'Login success.',
                                'data': {
                                    'token': token
                                }
                            });
                        });
                    } else {
                        return res.status(401).json({
                            'status': 401,
                            'message': 'Invalid username or password',
                            'data': {}
                        });
                    }
                });
            } else {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Invalid username or password',
                    'data': {}
                });
            }
        }).catch((err) => {
            return res.status(500).json({
                'status': 500,
                'message': err,
                'data': {}
            });
        });
    }
    
    // Temp code
    temp() {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUND);
        // Generate salt
        bcrypt.genSalt(saltRounds, (err, salt) => {
            console.log(salt)
            if (err) {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            }
            bcrypt.hash('123456', salt, (err, hash) => {
                console.log(hash)
                
            });
        });
    }
}

module.exports = new AuthController;