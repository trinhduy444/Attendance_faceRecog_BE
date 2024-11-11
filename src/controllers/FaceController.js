require('dotenv').config();
const userModel = require('../models/UserModel');
const faceModel = require('../models/FaceModel');
const { ForbiddenError } = require('../core/ErrorResponse');
const { cloudinary, CLOUDINARY_FOLDER4 } = require('../config/CloudinaryConfig');
const streamifier = require('streamifier');
const path = require('path');
const canvas = require('canvas');

// Face Recognition
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('@vladmandic/face-api');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Elasticsearch init
const esClient = require('../config/ElasticsearchConfig');

const init = async() => {
    // Load model weight
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./src/facerecogModels'),
        faceapi.nets.faceLandmark68Net.loadFromDisk('./src/facerecogModels'),
        faceapi.nets.faceRecognitionNet.loadFromDisk('./src/facerecogModels')
    ]);
}

init();

class FaceController {
    getAllUserFacesByUserId = async (req, res) => {
        if (req.user?.role_id !== 1) {
            throw new ForbiddenError('You are not allowed');
        }
        const userId = req.params.userId || 0; 

        const faces = await faceModel.getAllUserFacesByUserId(userId);
        
        return res.status(200).json({
            status: 200,
            message: "Get User Faces Successfully",
            data: faces,
        })
    };

    /*
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

    }
    */

    uploadFaces = async (req, res) => {
        const userId = req.body.userId || 0;
        try {
            // Check role
            if (req.user?.role_id !== 1) throw new ForbiddenError('You are not allowed.');

            // Check files
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 400, message: 'Không có file nào được upload.' });
            }

            // Upload file function
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
            
            userModel.getUserById(userId).then(async (user) => {
                var cout = 0;
                const results = [], faces = [], descriptors = [];
                if (user.length == 0) {
                    return res.status(400).json({ status:400, message: 'Người dùng không tồn tại.' });
                } else {
                    // Face feature extraction
                    for (var i = 0; i < req.files.length; i++) {
                        const faceImg = await canvas.loadImage(req.files[i].buffer);
                        const faceDetection = await faceapi.detectSingleFace(faceImg).withFaceLandmarks().withFaceDescriptor();
                        if (faceDetection) {
                            faces.push(req.files[i]);
                            descriptors.push(Array.from(faceDetection.descriptor));
                            cout++;
                        }
                    }
                    
                    if (cout != 0) {
                        for (var i = 0; i < cout; i++) {
                            try {
                                // Upload user face to Cloudinary
                                const customPublicId = await faceModel.getNewRandomUuid();
                                const uploadOptions = {
                                    folder: CLOUDINARY_FOLDER4,
                                    public_id: customPublicId,
                                    overwrite: true,
                                    resource_type: 'auto'
                                };
                                const result = await streamUpload(faces[i], uploadOptions);
                                const face = {
                                    student_id: userId,
                                    face_image_path: result.secure_url,
                                    uuid: customPublicId,
                                    status: 1
                                };

                                // Index face feature vector to Elasticsearch
                                await esClient.index({
                                    index: 'faces',
                                    id: customPublicId,
                                    document: {
                                        face_name: user[0].username,
                                        face_encoding: Array.from(descriptors[i])
                                    }
                                });

                                // Add face url to database
                                await faceModel.addUserFaces(face, req.user?.user_id);
                                results.push({
                                    username: user[0].username,
                                    status: 201,
                                    url: result.secure_url,
                                    public_id: result.public_id
                                });
                            } catch (error) {
                                results.push({ username: user[0].username, status: 'Lỗi khi upload.', error: error.message });
                            }
                        }
                    }
                }

                if (results.length == 0) {
                    return res.status(400).json({ status: 400, message: 'Không tồn tại hình ảnh khuôn mặt hợp lệ.' });
                }

                return res.status(201).json({
                    message: 'Upload completed',
                    results: results
                });
            });
        } catch (error) {
            return res.status(400).json({ status: 500, message: 'Lỗi khi xử lý upload ảnh.', error: error.message });
        }
    };
}

module.exports = new FaceController;