require('dotenv').config();
const { ForbiddenError } = require('../core/ErrorResponse');
const { cloudinary, CLOUDINARY_FOLDER2 } = require('../config/CloudinaryConfig');
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

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        socket.on('faceRecog', async (image) => {
            var imageData = await canvas.loadImage(image);

            // Detect all faces
            var detections = await faceapi.detectAllFaces(imageData).withFaceLandmarks().withFaceDescriptors();

            for (var i = 0; i < detections.length; i++) {
                const result = await esClient.search({
                    index: 'faces',
                    _source: 'face_name',
                    query: {
                        script_score: {
                            script: {
                                source: 'cosineSimilarity(params.query_vector, "face_encoding")',
                                params: {
                                    query_vector: Array.from(detections[i].descriptor)
                                }
                            },
                            query: {
                                match_all: {}
                            },
                        }
                    },
                    sort: {
                        _score: {
                            order: 'desc'
                        }
                    },
                    size: 1
                });
                const hits = result.hits.hits;
                var label = 'Unknown';
                if (hits.length != 0) {
                    if (hits[0]._score >= 0.9) {
                        label = hits[0]._source.face_name;
                    }
                }
                detections[i].detection._className = label;
            }
            socket.emit('faceRecog', detections);
        });
    });
};