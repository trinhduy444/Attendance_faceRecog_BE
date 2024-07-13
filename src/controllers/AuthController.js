require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const keyStoreModel = require('../models/KeyStoreModel');
const { generateJWTToken } = require('../helpers/TokenHelpers');
const { UnauthorizedError, BadRequestError } = require('../core/ErrorResponse');
const createKeys = require('../utils/createKeyUtil');
const { createTokenPair } = require('../auth/authUtil');
const { getInfoData } = require('../utils/index');
class AuthController {
    login = async (req, res) => {
        var { username, password } = req.body;
        username = username || '';
        password = password || '';

        userModel.getUserByUsername(username)
            .then((user) => {
                if (user.length) {
                    user = user[0];
                    // Compare hash password
                    bcrypt.compare(password, user.password, async (err, result) => {
                        if (err) throw new BadRequestError(err.message);

                        const { privateKey, publicKey } = createKeys();

                        const { user_id, nickname, email, phone, role_id } = user;

                        const { accessToken, refreshToken } = await createTokenPair(
                            { user_id, nickname, email, phone, role_id }, privateKey, publicKey
                        )


                        keyStoreModel.createKeyStore(user.user_id, privateKey, publicKey, refreshToken).then((key) => {
                            res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                            return res.status(200).json({
                                code: '200',
                                message: "Login success.",
                                shop: getInfoData({ fields: ["user_id", "nickname", "email", "phone", "role_id"], object: user }),
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            })
                        }).catch(err => res.status(400).json({ code: 400, message: "You're signed in somewhere else" }));
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
            const token = generateJWTToken(req.user.user_id, req.user.role_id);
            res.redirect(process.env.FRONTEND_URL + `?token=${token}`);
        } else {
            res.status(403).json({ error: true, message: 'Not authorized' })
        }
    }
    logout(req, res) {
        const { refreshToken } = req.cookies
        if (refreshToken) {
            keyStoreModel.deleteKeyStoreByRefreshTokenUsing(refreshToken);
            res.clearCookie('refreshToken', { httpOnly: true, secure: true })
            return res.status(200).json({
                status: 200,
                message: "Logout successfully."
            })
        }

        req.session.destroy();
        return res.status(200).json({
            status: 200,
            message: "Logout successfully."
        })
    }
    loginFailure(req, res) {
        return res.status(403).json({
            'status': 403,
            'message': 'Login Failure',
        });
    }
    checkTokenValid(req, res) {
        const token = req.params.token;


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
