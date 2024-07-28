const { BadRequestError, ForbiddenError } = require('../core/ErrorResponse');
const postModel = require('../models/PostModel')
class PostController {
    createPost = async (req, res) => {
        try {
            const course_group_id = parseInt(req.params.course_group_id);
            const teacher_id = req.user.user_id;
            const isCreated = await postModel.checkIsTeacherInGroup(teacher_id, course_group_id);
            if (!isCreated && req.user.user_id !== 1) {
                throw new ForbiddenError("You are not allowed to create a post");
            }

            const { title, content, file_link } = req.body;
            const result = await postModel.createPost(course_group_id, teacher_id, title, content, file_link);

            if (result) {
                return res.status(201).json({
                    status: 201,
                    message: 'Created post successfully',
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Cannot create post! Something went wrong',
            });
        } catch (err) {
            // Xử lý lỗi chung và gửi phản hồi
            if (err instanceof ForbiddenError) {
                return res.status(403).json({
                    status: 403,
                    message: err.message
                });
            }

            return res.status(500).json({
                status: 500,
                message: `Cannot create post! Something went wrong: ${err.message}`,
            });
        }
    };
    getAllPostValid = async (req, res) => {
        const course_group_id = parseInt(req.params.course_group_id);
        try {
            const posts = await postModel.getAllPostValid(course_group_id)
            if (posts) {
                return res.status(200).json({
                    status: 200,
                    message: 'Get All Posts Successfully',
                    metadata: posts
                });
            }
            return res.status(200).json({
                status: 400,
                message: 'Something wrong cannot get posts'
            });
        } catch (err) {

            return res.status(500).json({
                status: 500,
                message: `Something went wrong: ${err.message}`,
            });
        }
    }
    setPostInvalid = async (req, res) => {
        const post_id = parseInt(req.params.post_id);
        try {
            const teacher_id = req.user.user_id;
            const isCreated = await postModel.checkIsCreated(post_id, teacher_id);
            if (!isCreated && req.user.user_id !== 1) {
                throw new ForbiddenError("You are not allowed to create a post");
            }
            const setPost = await postModel.setPostInvalid(post_id, teacher_id);
            if (!setPost) throw new BadRequestError("Something went wrong!")
            return res.status(200).json({
                status: 200,
                message: "Post Deleted Successfully",
            })

        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: `Something went wrong: ${err.message}`,
            });
        }
    }
    updatePost = async (req, res) => {
        const post_id = parseInt(req.params.post_id);
        // console.log(`Update post ${post_id}`);
        try {
            const teacher_id = req.user.user_id;
            const isCreated = await postModel.checkIsCreated(post_id, teacher_id);
            if (!isCreated && req.user.user_id !== 1) {
                throw new ForbiddenError("You are not allowed to create a post");
            }
            const { title, content, file_link } = req.body
            // console.log({ title, content, file_link })
            await postModel.updatePost(post_id, teacher_id, title, content, file_link);
            return res.status(200).json({
                status: 200,
                message: "Post Editted Successfully",
            })

        } catch (err) {
            console.log("error when editting",err);
            return res.status(500).json({
                status: 500,
                message: `Something went wrong: ${err.message}`,
            });
        }
    };

}

module.exports = new PostController;