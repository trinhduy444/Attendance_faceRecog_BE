const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');

class AuthMiddleware {
    isLogin(req, res, next) {
        // Get header
        let token = req.headers.authorization || '';

        // Get Bearer token content
        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
        }

        if (token) {
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
                }).catch ((err) => {
                    return res.status(500).json({
                        'status': 500,
                        'message': err,
                        'data': {}
                    });
                });
            });
        } else {
            return res.status(401).json({
                'status': 401,
                'message': 'Bearer token required.',
                'data': {}
            });
        }
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