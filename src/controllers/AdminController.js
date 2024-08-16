require('dotenv').config();
const userModel = require('../models/UserModel');
const { ForbiddenError } = require('../core/ErrorResponse');
const { cloudinary, CLOUDINARY_FOLDER } = require('../config/CloudinaryConfig');
const streamifier = require('streamifier');
const path = require('path');
const { getInfoData } = require('../utils/index');

class AdminController {
    getUsers = async (req, res) => {

        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const users = await userModel.getAllUsers();
        // console.log(users)
        return res.status(200).json({
            status: 200,
            message: "Get Users Successfully",
            metadata: users,
        })
    };
    getUsersDetail = async (req, res) => {
        const { faculty_id, inputFilter, type, genderFilter } = req.body;
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const users = await userModel.getAllUsersDetail(faculty_id, inputFilter, type, genderFilter);
        // console.log(users)
        return res.status(200).json({
            status: 200,
            message: "Get Users Successfully",
            metadata: users,
        })
    };
    getTeachers = async (req, res) => {
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const teachers = await userModel.getAllTeachers();
        // console.log(users)
        return res.status(200).json({
            status: 200,
            message: "Get Teachers Successfully",
            metadata: teachers,
        })
    };
    getAllAdmins = async (req, res) => {
        if (req.user?.role_id !== 1 && req.user.user_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const admins = await userModel.getAllAdmins();
        // console.log(users)
        return res.status(200).json({
            status: 200,
            message: "Get Admins Successfully",
            metadata: admins,
        })
    };
    createAdmin = (req, res) => {
        const { email, username, password, nickname, phone } = req.body;
        if (req.user?.role_id !== 1 && req.user.user_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        userModel.createAdmin(email, username, password, nickname, phone, req.user.user_id)
            .then((admin) => {
                console.log(admin)
                return res.status(201).json({
                    status: 201,
                    message: 'Admin created successfully'
                })
            }).catch((err) => {
                console.error(err)
                return res.status(500).json({ message: 'Error while creating admin', error: err });
            });

    };
    createUsers = async (req, res) => {
        const { users } = req.body;
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(403).json({ status: 403, message: 'Invalid users' });
        }

        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }

        try {
            await userModel.createUsers(users, req.user.user_id);
            return res.status(201).json({
                status: 201,
                message: "Users created successfully"
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Error creating users",
                error: error.message
            });
        }
    }
    createTeachers = async (req, res) => {
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const { teachers } = req.body;
        if (!Array.isArray(teachers) || teachers.length === 0) {
            return res.status(403).json({ status: 403, message: 'Invalid teachers' });
        }
        // console.log(teachers)
        // return res.status(201).json({
        //     status: 201,
        //     message: "Teachers created successfully"
        // });
        try {
            await userModel.createTeachers(teachers, req.user.user_id);
            return res.status(201).json({
                status: 201,
                message: "Teachers created successfully"
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Error creating teachers",
                error: error.message
            });
        }
    }
    uploadImage = async (req, res) => {
        try {
            const user_id = req.body.user_id;
            if (!user_id) throw new ForbiddenError('Please provide a user');

            if (req.user?.role_id !== 1) throw new ForbiddenError('You are not allowed');

            if (!req.file) {
                return res.status(400).json({ message: 'Không có file nào được upload' });
            }

            const userUpload = await userModel.getUserById(user_id);
            if (!userUpload) throw new ForbiddenError("User to upload not found");

            const customPublicId = `${userUpload[0].username}_attendanceSystem_${userUpload[0].phone}`;

            const uploadOptions = {
                folder: CLOUDINARY_FOLDER,
                public_id: customPublicId,
                overwrite: true,
                resource_type: "auto"
            };

            const streamUpload = (file, options) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        options,
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req.file, uploadOptions);
            if (result) {
                await userModel.updateAvatarUser(user_id, result.secure_url);
                return res.status(201).json({
                    status: 201,
                    message: "Successfully uploaded",
                    url: result.secure_url,
                    public_id: result.public_id
                });
            } else {
                return res.status(500).json({ message: 'Lỗi khi upload ảnh' });
            }


        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi upload ảnh', error: error.message });
        }
    };

    uploadImages = async (req, res) => {
        try {
            if (req.user?.role_id !== 1) throw new ForbiddenError('You are not allowed');

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'Không có file nào được upload' });
            }
            const streamUpload = (file, options) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        options,
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const results = [];

            for (const file of req.files) {
                const username = path.parse(file.originalname).name; // Lấy tên file không có phần mở rộng

                const userUpload = await userModel.getUserByUsername(username);
                if (!userUpload) {
                    results.push({ username, status: 'Không tìm thấy user' });
                    continue; // Bỏ qua file này và tiếp tục với file tiếp theo
                }
                const customPublicId = `${userUpload[0].username}_attendanceSystem_${userUpload[0].phone}`;
                const uploadOptions = {
                    folder: CLOUDINARY_FOLDER,
                    public_id: customPublicId,
                    overwrite: true,
                    resource_type: "auto"
                };

                try {
                    const result = await streamUpload(file, uploadOptions);
                    await userModel.updateAvatarUser(userUpload[0].user_id, result.secure_url);
                    results.push({
                        username,
                        status: 201,
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                } catch (error) {
                    results.push({ username, status: 'Lỗi khi upload', error: error.message });
                }
            }

            return res.status(201).json({
                message: "Upload completed",
                results: results
            });

        } catch (error) {
            res.status(400).json({ status: 500, message: 'Lỗi khi xử lý upload ảnh', error: error.message });
        }
    };
    getTeachersByFaculty = async (req, res) => {
        try {
            if (req.user?.role_id !== 1) {
                throw new ForbiddenError('You are not allowed');
            }
            const faculty_id = parseInt(req.params.faculty_id) || 10010
            const teachers = await userModel.getAllTeachersByFaculty(faculty_id);
            // console.log(users)
            return res.status(200).json({
                status: 200,
                message: "Get Teachers Successfully",
                metadata: teachers,
            })
        } catch (err) {
            res.status(500).json({ message: 'Error when getting Teachers By Faculty', error: err.message });

        }

    };
    lockAccount(req, res) {
        try {
            const { user_id } = req.params;
            if (req.user?.role_id !== 1 && req.user.user_id !== 1) {
                throw new ForbiddenError('You are not allowed');
            }
            userModel.lockAccount(user_id, req.user.user_id,1).then((data) => {
                if (data) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Lock Account Success',
                    });
                } else {
                    return res.status(204).json({
                        status: 204,
                        message: 'Lock Account Failed',
                    });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error when locking account', error: err.message });
        }
    }

    unLockAccount(req, res) {
        try {
            const { user_id } = req.params;
            if (req.user?.role_id !== 1 && req.user.user_id !== 1) {
                throw new ForbiddenError('You are not allowed');
            }
            userModel.unLockAccount(user_id, req.user.user_id, 1).then((data) => {
                if (data) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Unlock Account Success',
                    });
                } else {
                    return res.status(204).json({
                        status: 204,
                        message: 'Unlock Account Failed',
                    });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error when unlocking account', error: err.message });
        }
    }

    lockUserAccount(req, res) {
        try {
            const { user_id,role_id } = req.params;
            console.log( user_id,role_id)
            if (req.user?.role_id !== 1) {
                throw new ForbiddenError('You are not allowed');
            }
            userModel.lockAccount(user_id, req.user.user_id,parseInt(role_id)).then((data) => {
                if (data) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Lock Account Success',
                    });
                } else {
                    return res.status(204).json({
                        status: 204,
                        message: 'Lock Account Failed',
                    });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error when locking account', error: err.message });
        }
    }

    unLockUserAccount(req, res) {
        try {
            const { user_id,role_id } = req.params;
            if (req.user?.role_id !== 1) {
                throw new ForbiddenError('You are not allowed');
            }
            userModel.unLockAccount(user_id, req.user.user_id,parseInt(role_id)).then((data) => {
                if (data) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Unlock Account Success',
                    });
                } else {
                    return res.status(204).json({
                        status: 204,
                        message: 'Unlock Account Failed',
                    });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error when unlocking account', error: err.message });
        }
    }

}

module.exports = new AdminController;