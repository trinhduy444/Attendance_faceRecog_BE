const userModel = require('../models/UserModel');

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
                    'test': data
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
}

module.exports = new UserController;