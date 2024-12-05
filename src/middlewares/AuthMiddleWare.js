const jwt = require('jsonwebtoken');
const keyStoreModel = require('../models/KeyStoreModel');
const { UnauthorizedError, ForbiddenError, BadRequestError } = require('../core/ErrorResponse');
class AuthMiddleware {
    isLogin = async (req, res, next) => {
        try {
            //if login by GG next()
            if (req.user) return next();
            // Get header
            const accessToken = req.headers.authorization;
            if (!accessToken?.startsWith("Bearer ")) throw new ForbiddenError("Token invalid"); // 403
            // handle refresh token
            const { refreshToken } = req.cookies
            if (!refreshToken) throw new BadRequestError("refreshToken doesn't exist on cookies");
            // console.log("AT", accessToken)
            // console.log("RT", refreshToken)
            const keyStore = await keyStoreModel.getUserByRefreshTokenUsing(refreshToken);
            if (!keyStore) throw new ForbiddenError("KeyStore invalid");

            const payload = jwt.verify(accessToken.split(" ")[1], keyStore[0].publicKey);
            req.user = payload;
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    isAdmin(req, res, next) {
        
        if (req.user.role_id != 1 && req.user.role_id != 4 ) {            
            return res.status(401).json({
                'status': 401,
                'message': 'Unauthorized user.',
                'data': {}
            });
        }
        return next();
    }

    isRootAdmin(req, res, next) {
        if (req.user.role_id !== 4) {
            return res.status(401).json({
                'status': 401,
                'message': 'Unauthorized user.',
                'data': {}
            });
        }
        return next();
    }

    isTeacher(req, res, next) {
        if (req.user.role_id != 2) {
            return res.status(401).json({
                'status': 401,
                'message': 'Unauthorized user.',
                'data': {}
            });
        }
        return next();
    }

    isTeacherOrAdmin(req, res, next) {
        if (req.user.role_id != 1 && req.user.role_id != 2 && req.user.role_id != 4) {
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
