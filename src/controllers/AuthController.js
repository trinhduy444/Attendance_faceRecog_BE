require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const { generateJWTToken } = require('../helpers/TokenHelpers');
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
                            try {
                                const token = generateJWTToken(user.user_id)
                                req.user = user;
                                return res.status(200).json({
                                    'status': 200,
                                    'message': 'Login success.',
                                    'data': {
                                        'token': token,
                                        'metadata': user
                                    }
                                });
                            } catch (err) {
                                return res.status(500).json({
                                    'status': 200,
                                    'message': err,
                                    'data': {}
                                });
                            }
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

    loginGoogle(req, res) {
        if (req.user) {
            const token = generateJWTToken(req.user.user_id);

            // return res.status(200).json({
            //     'status': 200,
            //     'message': 'Login successfully.',
            //     'data': {
            //         'token': token,
            //         'metadata': req.user
            //     }
            // });
            res.redirect(process.env.FRONTEND_URL+`?token=${token}`);
        }else{
            res.status(403).json({error: true, message: 'Not authorized'})
        }
        // console.log("Req.USER login: " + JSON.stringify(req.user));
    }
    logout(req, res) {
        req.session.destroy();
        // console.log("Req.USER logout: " + JSON.stringify(req.user));
        res.redirect(process.env.FRONTEND_URL+'/login');

    }
    loginFailure(req, res) {
        return res.status(403).json({
            'status': 403,
            'message': 'Login Failure',
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