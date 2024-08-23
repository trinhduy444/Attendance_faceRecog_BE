require('dotenv').config();
const bcrypt = require('bcrypt');
const userModel = require('../models/UserModel');
const keyStoreModel = require('../models/KeyStoreModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');
const createKeys = require('../utils/createKeyUtil');
const { createTokenPair } = require('../auth/authUtil');
const { getInfoData } = require('../utils/index');
const isPasswordValid = require('../utils/checkPasswordUtil');
const sendMail = require('../config/nodeMailerConfig');
const { forgotPasswordMail } = require('../helpers/mailContentHelper')

const JWT = require("jsonwebtoken");
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
                    if (user.status === false) {
                        return res.json({
                            status: 401,
                            message: "Accound denied, pls contact with administrator",
                        });
                    }

                    const { privateKey, publicKey } = createKeys();

                    const { user_id, nickname, email, phone, role_id, username } = user;

                    const { accessToken, refreshToken } = await createTokenPair(
                        { user_id, nickname, email, phone, role_id, username }, privateKey, publicKey
                    )
                    keyStoreModel.createKeyStore(user.user_id, privateKey, publicKey, refreshToken).then((key) => {
                        res.cookie("refreshToken", refreshToken, {
                            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None',
                            secure: true
                        });
                        return res.status(200).json({
                            status: 200,
                            message: "Login success.",
                            metadata: getInfoData({ fields: ["user_id", "nickname", "email", "phone", "role_id", "username"], object: user }),
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
            const { user_id, nickname, email, phone, role_id, username } = user;

            const { accessToken, refreshToken } = await createTokenPair(
                { user_id, nickname, email, phone, role_id, username }, privateKey, publicKey
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
                        username: user.username,
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
        if (!password) {
            return res.status(403).json({
                status: 403,
                message: "Please enter a password."
            });
        }
        if (!user_id) {
            return res.status(401).json({
                status: 401,
                message: "User not authorized",
            });
        }
        userModel.getUserById(user_id).then(async (user) => {
            const isMatchPassword = await bcrypt.compare(password, user[0].password);
            if (!isMatchPassword) {
                return res.status(401).json({
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
    refreshAccessToken = async (req, res) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw new BadRequestError("No RT in cookie");

        const keyStore = await keyStoreModel.findKeyStoreByRefreshTokenUsing(refreshToken)
        if (!keyStore) throw new BadRequestError("KeyStore save refresh token dost not exist");

        const { privateKey, publicKey } = keyStore;
        const payload = JWT.verify(refreshToken, privateKey);
        if (!payload) throw new BadRequestError("Verify Token Error");
        const { user_id, nickname, email, phone, role_id, username } = payload;

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await createTokenPair(
            { user_id, nickname, email, phone, role_id, username }, privateKey, publicKey
        )
        const result = await keyStoreModel.updateRefreshTokenUsing(user_id, newRefreshToken);
        if (!result) throw new BadRequestError("Refresh token cannot be updated");

        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ user: payload, message: 'Refresh Token Successfully', newAT: newAccessToken })
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
    isLogin = async (req, res) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken?.startsWith("Bearer ")) return res.status(403).json({ status: 403, message: "Not Authenticate" });
            const { refreshToken } = req.cookies
            if (!refreshToken) return res.status(403).json({ status: 403, message: "Not Authenticate" });


            const users = await keyStoreModel.getUserByRefreshTokenUsing(refreshToken);
            const user = users[0];
            if (!user) return res.status(403).json({ status: 403, message: "Not Authenticate" });

            return res.status(200).json({ status: 200, message: "Authenticated" });

        } catch (error) {
            return res.status(403).json({ status: 403, message: "Not Authenticate" });
        }

    }
    isAdmin = async (req, res) => {
        try {
            if (req.user.role_id != 1) {
                return res.status(403).json({
                    'status': 403,
                    'message': 'Not Admin',
                    'data': {}
                });
            }
            return res.status(200).json({ status: 200, message: 'OK' });
        } catch (error) {
            return res.status(403).json({ status: 403, message: "Not Admin" });
        }

    }
    isTeacher = async (req, res) => {
        try {
            if (req.user.role_id != 2) {
                return res.status(403).json({
                    'status': 403,
                    'message': 'Not Teacher',
                    'data': {}
                });
            }
            return res.status(200).json({ status: 200, message: 'OK' });
        } catch (error) {
            return res.status(403).json({ status: 403, message: "Not Teacher" });
        }

    }
    isAdminOrTeacher = async (req, res) => {
        try {
            const role_id = req.user.role_id
            if (role_id !== 1 && role_id !== 2) {
                return res.status(403).json({
                    'status': 403,
                    'message': 'Not Admin or Teacher',
                    'data': {}
                });
            }
            return res.status(200).json({ status: 200, message: 'OK' });
        } catch (error) {
            return res.status(403).json({ status: 403, message: "Not Admin or Teacher" });
        }

    }
    forgotPassword = async (req, res) => {
        const { username, email } = req.body;
        if (!username || !email) throw new BadRequestError("Invalid username or email")

        const exist = await userModel.checkExistUserByUsernameAndEmail(username, email);
        if (!exist) {
            return res.status(403).json({ status: 403, message: "User does not exist" });

        } else {
            const token = JWT.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '10min' });
            const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetPassword/${token}`;
            const title = 'THAY ĐỔI MẬT KHẨU TRONG HỆ THỐNG!'
            const content = forgotPasswordMail(username, resetPasswordUrl)
            await sendMail(title, content, email)
            return res.status(200).json({
                status: 200,
                message: "Password reset link has been sent.",
            });
        }
    }
    resetPassword = async (req, res) => {
        const { token, newPassword } = req.body;
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            
            const { username, email } = decoded;

            const user = await userModel.checkExistUserByUsernameAndEmail(username, email);
            if (!user) {
                return res.status(403).json({ status: 403, message: "Invalid token or user does not exist" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await userModel.updatePassword(username, email, hashedPassword);
            if (result === true) {

                return res.status(200).json({ status: 200, message: "Password has been successfully updated" });
            } else {
                return res.status(403).json({ status: 403, message: "Fail to update Password, try again!" });

            }
        } catch (err) {
            console.error(err);
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        }
    };
}

module.exports = new AuthController;
