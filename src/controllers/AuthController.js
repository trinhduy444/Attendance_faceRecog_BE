require('dotenv').config();
const bcrypt = require('bcrypt');
const userModel = require('../models/UserModel');
const keyStoreModel = require('../models/KeyStoreModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');
const createKeys = require('../utils/createKeyUtil');
const { createTokenPair } = require('../auth/authUtil');
const { getInfoData } = require('../utils/index');
const isPasswordValid = require('../utils/checkPasswordUtil');
class AuthController {
    login = async (req, res) => {
        var { username, password } = req.body;
        username = username || '';
        password = password || '';

        userModel.getUserByUsername(username)
            .then(async (user) => {
                if (user.length) {
                    user = user[0];
                    // Compare hash password
                    const isMatchPassword = await bcrypt.compare(password, user.password)
                    if (!isMatchPassword) {
                        return res.json({
                            status: 401,
                            message: "Invalid password",

                        })
                    }

                    const { privateKey, publicKey } = createKeys();

                    const { user_id, nickname, email, phone, role_id } = user;

                    const { accessToken, refreshToken } = await createTokenPair(
                        { user_id, nickname, email, phone, role_id }, privateKey, publicKey
                    )
                    keyStoreModel.createKeyStore(user.user_id, privateKey, publicKey, refreshToken).then((key) => {
                        res.cookie("refreshToken", refreshToken, {
                            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None',
                            secure: true
                        });
                        return res.status(200).json({
                            status: 200,
                            message: "Login success.",
                            metadata: getInfoData({ fields: ["user_id", "nickname", "email", "phone", "role_id"], object: user }),
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        })
                    }).catch((err) => {
                        throw new InternalError(err.message);
                    });
                } else {
                    return res.json({
                        status: 401,
                        message: "Invalid username",

                    })
                    // throw new UnauthorizedError("Invalid username");
                }
            }).catch((err) => {
                return res.json({
                    status: 401,
                    message: "Invalid username",

                })
            });
    }

    loginGoogle = async (req, res) => {
        if (req.user) {
            const user = req.user
            const { privateKey, publicKey } = createKeys();
            const { user_id, nickname, email, phone, role_id } = user;

            const { accessToken, refreshToken } = await createTokenPair(
                { user_id, nickname, email, phone, role_id }, privateKey, publicKey
            )
            keyStoreModel.createKeyStore(user.user_id, privateKey, publicKey, refreshToken).then((key) => {
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None',
                    secure: true
                });
                // return res.redirect(process.env.FRONTEND_URL + `?token=${accessToken}`);
                const userData = {
                    status: 200,
                    message: "Login success.",
                    metadata: JSON.stringify({
                        user_id: user.user_id,
                        nickname: user.nickname,
                        email: user.email,
                        phone: user.phone,
                        role_id: user.role_id
                    }),
                    accessToken: accessToken,
                    refreshToken: refreshToken

                }
                const queryParams = new URLSearchParams(userData).toString();
                res.redirect(`http://localhost:3000/?${queryParams}`);
            }).catch((err) => {
                throw new InternalError(err.message);
            });
        } else {
            throw new UnauthorizedError('Not authorized');
        }
    }
    logout(req, res) {
        const { refreshToken } = req.cookies
        req.session.destroy();
        if (refreshToken) {
            // console.log("You here")
            keyStoreModel.deleteKeyStoreByRefreshTokenUsing(refreshToken);
            res.clearCookie('refreshToken', { httpOnly: true, secure: true })
            return res.status(200).json({
                status: 200,
                message: "Logout successfully."
            })
        }

        return res.status(200).json({
            status: 200,
            message: "Logout successfully."
        })
    }
    loginFailure(req, res) {
        throw new ForbiddenError('Not authorized');
    }
    checkTokenValid(req, res) {
        const token = req.params.token;
    }
    checkPasswordValid(req, res) {
        const user_id = req.user.user_id;
        const password = req.body.password;
        if (!user_id) {
            return res.json({
                status: 401,
                message: "User not authorized",
            });
        }
        userModel.getUserById(user_id).then(async (user) => {
            const isMatchPassword = await bcrypt.compare(password, user[0].password);
            if (!isMatchPassword) {
                return res.json({
                    status: 401,
                    message: "Wrong password",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Password correct"
            });
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        });
    }


    changePassword = async (req, res) => {
        const user_id = req.user.user_id;
        const newPassword = req.body.newPassword;
        if (!newPassword) throw new ForbiddenError('Not found new password');

        if (!isPasswordValid(newPassword)) return res.json({ status: 401, message: "Password has least 8 characters, 1 Uppercase and 1 number character" });
        if (!user_id) throw new ForbiddenError('Not authorized');

        const passwordHashed = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUND));
        const isOk = await userModel.changePassword(user_id, passwordHashed)
        if (!isOk) throw new BadRequestError('Invalid password')

        return res.status(201).json({
            status: 201,
            message: "Change password successfully"
        })
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
