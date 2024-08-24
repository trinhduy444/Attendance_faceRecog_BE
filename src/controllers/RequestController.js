const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const requestModel = require('../models/RequestModel');
const { cloudinary, CLOUDINARY_FOLDER3 } = require('../config/CloudinaryConfig');
const streamifier = require('streamifier');
class RequestController {
    createAttendanceRequest = async (req, res) => {
        let { student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status } = req.body;

        student_id = student_id || 0;
        course_group_id = course_group_id || 0;
        attend_date = attend_date || null;
        attend_type = attend_type || 0;
        proof_image_path = proof_image_path || '';
        file_link = file_link || '';
        content = content || '';
        response = response || '';
        request_type = request_type || 0;
        status = status || 0;

        try {
            const request = { student_id, course_group_id, attend_date, attend_type, proof_image_path, file_link, content, response, request_type, status };
            const createRequest = await requestModel.createAttendanceRequest(request, req.user.user_id);

            return res.status(201).json({
                status: 201,
                message: 'Request created successfully',
                data: createRequest,
            });
        } catch (error) {
            console.error(error);
            return res.status(403).json({error})
        }
    };

    getAllRequestsByActiveUser = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            const role_id = req.user.role_id;
            // Check if user is login
            if (!user_id) throw new ForbiddenError("Please login to receive notifications");

            const requests = await requestModel.getAllRequestsByActiveUser(user_id, role_id);
            return res.status(200).json({
                status: 200,
                message: 'Get requests succes.',
                data: requests
            })
        } catch (err) {
            console.error(err);
            throw err
        }
    };

    approveAttendanceRequest = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            // Check if user is login
            if (!user_id) throw new ForbiddenError("Please login to use this function");

            const { request_id } = req.params;

            const request = await requestModel.updateAttendanceRequest(request_id, 2, user_id);
            if (request == 0) {
                return res.status(403).json({
                    status: 403,
                    message: 'Permission deny.',
                    data: {}
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Approve request success.',
                    data: {}
                });
            }
        } catch (err) {
            console.error(err);
            throw err
        }
    }

    rejectAttendanceRequest = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            // Check if user is login
            if (!user_id) throw new ForbiddenError("Please login to use this function");

            const { request_id } = req.params;

            const request = await requestModel.updateAttendanceRequest(request_id, 9, user_id);
            if (request == 0) {
                return res.status(403).json({
                    status: 403,
                    message: 'Permission deny.',
                    data: {}
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Reject request success.',
                    data: {}
                });
            }
        } catch (err) {
            console.error(err);
            throw err
        }
    }
    uploadImageRequest = async (req, res) => {
        try {
            const { request_id } = req.params;
            if (!request_id) throw new BadRequestError("Please provide a request")
            const user_id = req.user.user_id;

            const customPublicId = `requestImage_${request_id}`;

            const uploadOptions = {
                folder: CLOUDINARY_FOLDER3,
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

            requestModel.updateImageRequest(request_id, user_id, result.secure_url)
                .then((result) => {
                    if (result) {
                        return res.status(201).json({ link_anh: result.secure_url });

                    } else {
                        return res.status(500).json({ message: 'Lỗi khi upload ảnh' });

                    }
                }).catch((err) => {
                    return res.status(500).json({ message: 'Lỗi khi upload ảnh', error: err });
                });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi khi upload ảnh', error: error.message });
        }
    }
}

module.exports = new RequestController();
