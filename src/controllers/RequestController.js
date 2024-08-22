const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const requestModel = require('../models/RequestModel');

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

            res.status(201).json({
                status: 201,
                message: 'Request created successfully',
                data: createRequest,
            });
        } catch (error) {
            console.error(error);
            throw error;
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
    }

    // getAllNotifications = async (req, res) => {
    //     try {
    //         const user_id = req.user.user_id;
    //         if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");

    //         const notifications = await notifyModel.getAllNotifications();
    //         return res.status(200).json({
    //             status: 200,
    //             message: 'Get all notifications successfully',
    //             metadata: notifications
    //         })

    //     } catch (err) {
    //         console.error(err);
    //         throw err
    //     }
    // }
    // hideNotifications = async (req, res) => {
    //     try {
    //         const user_id = req.user.user_id;
    //         if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");
    //         const { notify_id } = req.params
    //         if (!notify_id) throw new BadRequestError("Not found notification")
    //         const result = await notifyModel.hideNotification(notify_id, user_id);
    //         if (result) {
    //             return res.status(201).json({
    //                 status: 201,
    //                 message: 'Hide notification successfully',

    //             })
    //         } else {
    //             return res.status(200).json({
    //                 status: 200,
    //                 message: 'Hide notification failed',
    //             })
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         throw err
    //     }
    // }
    // showNotifications = async (req, res) => {
    //     try {
    //         const user_id = req.user.user_id;
    //         if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");
    //         const { notify_id } = req.params
    //         if (!notify_id) throw new BadRequestError("Not found notification")
    //         const result = await notifyModel.showNotification(notify_id, user_id);
    //         if (result) {
    //             return res.status(201).json({
    //                 status: 201,
    //                 message: 'Show notification successfully',

    //             })
    //         } else {
    //             return res.status(200).json({
    //                 status: 200,
    //                 message: 'Show notification failed',
    //             })
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         throw err
    //     }
    // }
    // viewNotification = async (req, res) => {
    //     try {
    //         const user_id = req.user.user_id;
    //         if (!user_id) throw new ForbiddenError("You are not allow to view notifications");
    //         const { notify_id } = req.params
    //         if (!notify_id) throw new BadRequestError("Not found notification")
    //         console.log(notify_id, user_id)

    //         const result = await notifyModel.viewNotification(notify_id, user_id);
    //         if (result) {
    //             return res.status(201).json({
    //                 status: 201,
    //                 message: 'View notification successfully',

    //             })
    //         } else {
    //             return res.status(200).json({
    //                 status: 200,
    //                 message: 'Cannot view notification',
    //             })
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         throw err
    //     }
    // }
}

module.exports = new RequestController();
