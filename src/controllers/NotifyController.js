const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const notifyModel = require('../models/NotifyModel');

class NotifyController {
    createNotification = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            const role_id = req.user.role_id;
            if (role_id !== 1 && role_id !== 2) {
                throw new ForbiddenError("You are not allowed here");
            }
            const { title, file_link, content, type, valueType } = req.body;
            // console.log({ title, file_link, content, type, valueType })
            const notify_id = await notifyModel.createNotification(title, file_link, content, user_id);

            await notifyModel.createReceived(type, valueType, notify_id, user_id);
            // console.log("notify id", notify_id);
            return res.status(201).json({
                status: 201,
                message: 'Notification created successfully',
                notify_id,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    };
    getAllNotificationsActiveByUser = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("Please login to receive notifications");
            const notifications = await notifyModel.getAllNotificationsActiveByUser(user_id);
            return res.status(200).json({
                status: 200,
                message: 'Get all notifications successfully',
                metadata: notifications
            })


        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message,
            });
        }
    }
    getAllNotifications = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");

            const notifications = await notifyModel.getAllNotifications();
            return res.status(200).json({
                status: 200,
                message: 'Get all notifications successfully',
                metadata: notifications
            })

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message,
            });
        }
    }
    hideNotifications = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");
            const { notify_id } = req.params
            if (!notify_id) throw new BadRequestError("Not found notification")
            const result = await notifyModel.hideNotification(notify_id, user_id);
            if (result) {
                return res.status(201).json({
                    status: 201,
                    message: 'Hide notification successfully',

                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Hide notification failed',
                })
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message,
            });
        }
    }
    showNotifications = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (user_id !== 1) throw new ForbiddenError("You are not allow to receive notifications");
            const { notify_id } = req.params
            if (!notify_id) throw new BadRequestError("Not found notification")
            const result = await notifyModel.showNotification(notify_id, user_id);
            if (result) {
                return res.status(201).json({
                    status: 201,
                    message: 'Show notification successfully',

                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Show notification failed',
                })
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message,
            });
        }
    }
    viewNotification = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("You are not allow to view notifications");
            const { notify_id } = req.params
            if (!notify_id) throw new BadRequestError("Not found notification")
            console.log(notify_id, user_id)

            const result = await notifyModel.viewNotification(notify_id, user_id);
            if (result) {
                return res.status(201).json({
                    status: 201,
                    message: 'View notification successfully',

                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Cannot view notification',
                })
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message,
            });
        }
    }
}

module.exports = new NotifyController();
