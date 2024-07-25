'use strict';
const classRoomModel = require('../models/ClassRoomModel');
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');

class ClassRoomController {
    createRoom(req, res) {
        const user_id = req.user.user_id;
        if (!user_id) throw new ForbiddenError("You not allowed")

        const { building, classroom, capacity, floor, description, status } = req.body;

        const classroom_code = building + "" + floor + "" + classroom;

        classRoomModel.createRoom(classroom_code, capacity, floor, description, status, user_id).then((room) => {
            return res.status(201).json({
                status: 201,
                message: `Đã tạo phòng ${classroom_code} thành công`,
            })


        }).catch((error) => {
            return res.json({
                status: 400,
                message: "Không thể tạo phòng, phòng đã tồn tại"
            })
        });
    }
    createRooms = async (req, res) => {
        const user_id = req.user.user_id;
        if (!user_id) return res.status(403).json({ message: "You are not allowed" });
        const { rooms } = req.body;

        try {
            const result = await classRoomModel.createRooms(rooms, user_id);
            res.status(201).json({ status: 201, message: "Rooms processed successfully", created: result.arraySuccess, skipped: result.arrayFail });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "An error occurred while creating rooms" });
        }
    };


    getClassRooms = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("You not allowed")
            const limit = parseInt(req.query.limit) || 10;
            const skip = parseInt(req.query.skip) || 0;

            const rooms = await classRoomModel.getClassRooms(limit, skip);
            return res.status(200).json({
                status: 200,
                message: "Get rooms successfully",
                metadata: rooms,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
    getClassRoomsFilter = async (req, res) => {
        try {
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("You not allowed")
            const { building, capacity } = req.body;
            const rooms = await classRoomModel.getClassRoomsFilter(building, capacity);
            return res.status(200).json({
                status: 200,
                message: "Get rooms successfully",
                metadata: rooms,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
    getShiftEmpty = async (req, res) => {
        try {
            const code = req.query.classroom || 'A101'
            const user_id = req.user.user_id;
            if (!user_id) throw new ForbiddenError("You not allowed")
            const shifts = await classRoomModel.getShiftEmpty(code);
            return res.status(200).json({
                status: 200,
                message: "Get empty shift successfully",
                metadata: shifts,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
}

module.exports = new ClassRoomController();