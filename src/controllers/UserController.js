const userModel = require('../models/UserModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');

class UserController {
    getUserById(req, res) {
        const { userId } = req.params;

        userModel.getUserById(userId)
            .then((user) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive user success.',
                    'data': {
                        'user': user[0]
                    }
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }

    getAllUserPagination(req, res) {
        let { otherJoins, otherFields, order, search, page, limit } = req.query;
        otherJoins = otherJoins || '';
        otherFields = otherFields || '';
        order = order || '';
        search = search || '';
        page = page || 1;
        limit = limit || 20;

        userModel.getAllUsersPagination(otherJoins, otherFields, order, search, page, limit)
            .then((data) => {
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive users success.',
                    'data': {
                        'users': data[0],
                        'pageInfo': data[1]
                    }
                });
            }).catch((err) => {
                return res.status(500).json({
                    'status': 500,
                    'message': err,
                    'data': {}
                });
            });
    }
    getProfile(req, res) {
        const user_id = req.user.user_id;
        if (!user_id) throw new UnauthorizedError("User not found")
        userModel.getUserById(user_id).then((user) => {
            if (user.length === 0) {
                return res.status(401).json({
                    status: 401,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Get Profile Successfully",
                metadata: user[0]
            });
        }).catch((err) => {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        })

    }
    getSomeInfo = async (req, res) => {
        const user_id = req.user.user_id;
        if (!user_id) throw new UnauthorizedError("Pls login!")
        try {
            const user = await userModel.getSomeInfo(user_id);
            
            if(user.length > 0){
                return res.status(200).json({ status: 200, message: "Get User Info Successfully", metadata: user[0] })

            }else{
                return res.status(200).json({ status: 404, message: "Get User Info Fail" })

            }
        } catch (err) {
            console.error(err);
            return res.status(400).json({ status: 500, message: err.message });

        }

    }
    getImageAndNicknameByUsername = async (req, res) => {
        try {
            const { username } = req.body;
            if (!username) throw new ForbiddenError("Username must be provided")
            const user = await userModel.getImageAndNicknameByUsername(username);
            return res.status(200).json({ status: 200, message: "Get Image and nickname Successfully", metadata: user[0] })
        } catch (err) {
            return res.status(400).json({ status: 500, message: err.message });
        }

    }
    checkExistUser = async (req, res) => {
        try {
            const { username } = req.body;
            if (!username) throw new ForbiddenError("Username must be provided")
            const result = await userModel.checkExistUser(username);
            if (!result) {
                return res.status(200).json({ status: 200, message: "Get Image and nickname Successfully", metadata: result })

            }
            return res.status(200).json({ status: 200, message: "Get Image and nickname Successfully", metadata: result })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ status: 500, message: err.message });
        }

    }

    getUserFaces(req, res) {
        let { userId } = req.params;
        userId = userId || 0;

        userModel.getUserFaces(userId)
            .then((faces) => {
                console.log(faces)
                return res.status(200).json({
                    'status': 200,
                    'message': 'Receive user faces success.',
                    'data': {
                        'faces': faces
                    }
                });
            }).catch((err) => {
                console.error(err)
                return res.status(403).json({
                    'status': 403,
                    'message': err,
                    'data': {}
                });
            });
    }
}

module.exports = new UserController;