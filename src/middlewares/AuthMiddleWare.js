const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const { UnauthorizedError } = require('../utils/response/ErrorResponse');
class AuthMiddleware {
    isLogin(req, res, next) {
        //if login by GG next()
        if (req.user) return next();
        // Get header
        let token = req.headers.authorization || '';


        if (!token?.startsWith("Bearer ")) throw new UnauthorizedError('Token is required')
        // Get Bearer token content
        token = token.substring(7, token.length)

        // Verify token
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Invalid token.',
                    'data': {}
                });
            }

            const userId = decoded.user_id || -1;
            userModel.getUserById(userId)
                .then((user) => {
                    if (user.length) {
                        user = user[0];
                        if (!user.status) {
                            return res.status(401).json({
                                'status': 401,
                                'message': 'User no longer available.',
                                'data': {}
                            });
                        }
                        req.user = user;
                        return next();
                    }

                    return res.status(401).json({
                        'status': 401,
                        'message': 'User no longer exists.',
                        'data': {}
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        'status': 500,
                        'message': err,
                        'data': {}
                    });
                });
        });

    }

    isAdmin(req, res, next) {
        if (req.user.role_id != 1) {
            return res.status(401).json({
                'status': 401,
                'message': 'Unauthorized user.',
                'data': {}
            });
        }
        return next();
    }



}

module.exports = new AuthMiddleware;