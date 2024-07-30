const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const commentModel = require('../models/CommentModel')
class CommentController {
    createComment = async (req, res) => {
        const commenter_id = req.user.user_id;
        if (!commenter_id) throw new BadRequestError("Please login to comment")
        const { ref_id, ref_table, content } = req.body;
        if (!ref_table || !ref_id) throw new BadRequestError("Something went wrong, try again!")
        try {
            const comment = await commentModel.createComment(commenter_id, ref_table, ref_id, content)
            if (comment) {
                return res.status(201).json({
                    status: 201,
                    message: "Comment created"
                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: "Something went wrong, try again!"
                })

            }
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message
            });
        }

    }
    getAllComments = async (req, res) => {
        const { post_id } = req.params
        if (!post_id) throw new BadRequestError("Something went wrong, try again!")
        try {
            const comments = await commentModel.getAllComments(post_id)
            return res.status(200).json({
                status: 200,
                message: 'Get all comments successfully',
                metadata: comments
            })
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: err.message
            });
        }
    }

}

module.exports = new CommentController;