const jwt = require('jsonwebtoken');
const keyStoreModel = require('../models/KeyStoreModel');
const { UnauthorizedError, ForbiddenError, BadRequestError } = require('../core/ErrorResponse');
class AuthMiddleware {
    isLogin = async (req, res, next) => {
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
        const users = await keyStoreModel.getUserByRefreshTokenUsing(refreshToken);
        const user = users[0];
        // console.log(">>>>>>> user",user);
        if (!user) throw new ForbiddenError("KeyStore invalid");

        const payload = jwt.verify(accessToken.split(" ")[1], user.publicKey);
        req.user = payload;
        next();
    }

    isAdmin(req, res, next) {
        // this.isLogin(req, res, next)

        if (req.user.role_id != 1) {
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
        if (req.user.role_id != 1 && req.user.role_id != 2) {
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
