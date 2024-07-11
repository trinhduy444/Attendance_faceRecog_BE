require('dotenv').config();
const userModel = require('../models/UserModel');
const { generateJWTToken } = require('../helpers/TokenHelpers');
const {ForbidenError} = require('../utils/response/ErrorResponse');

class AdminController {
    createUsers(req,res){
        console.log(JSON.stringify(req.user));
        if(req.user?.role_id !== 1 ) return new ForbidenError('You are not allowed')
    }
}

module.exports = new AdminController;