require('dotenv').config();
const { ForbiddenError, UnauthorizedError, BadRequestError, InternalError } = require('../core/ErrorResponse');
const courseModel = require('../models/CourseModel');
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({ node: 'http://localhost:9200' });
class RecogController {
    syncFaceDataToElasticsearch = async (req, res) => {
        try {
            let { courseGroupId } = req.params;

            // Lấy danh sách sinh viên từ DB
            const students = await courseModel.getCourseGroupStudentListInfo(courseGroupId);

            // Chia nhỏ dữ liệu thành các batch nhỏ
            const chunkedStudents = this.chunkArray(students, 100);  // Chia nhỏ dữ liệu thành các batch 100 bản ghi mỗi lần

            for (const studentBatch of chunkedStudents) {
                const body = studentBatch.flatMap((student) => [
                    { index: { _index: 'face-recognition', _id: student.student_username } },
                    {
                        username: student.student_username,
                        student_avatar_path: student.student_avatar_path,
                        course_group_id: courseGroupId,
                    },
                ]);

                // Thực hiện bulk request
                try {
                    const { body: bulkResponse } = await client.bulk({ refresh: true, body });
                    console.log('Bulk Response:', bulkResponse);

                    // Kiểm tra nếu có lỗi trong quá trình indexing
                    if (bulkResponse && bulkResponse.errors) {
                        console.error('Errors during bulk indexing:', bulkResponse.errors);
                        return res.status(500).json({ message: 'Error syncing face data.' });
                    } else {
                        console.log(`Successfully indexed ${studentBatch.length} records`);
                    }
                } catch (error) {
                    // Nếu lỗi trong bulk request, log chi tiết lỗi
                    console.error('Bulk request failed with error:', error);
                    return res.status(500).json({ message: 'Error syncing face data.', error });
                }
            }

            return res.status(200).json({ message: 'Face data synced successfully.' });
        } catch (error) {
            // Lỗi trong phần lấy dữ liệu từ DB hoặc các lỗi khác
            console.error('Error syncing face data to Elasticsearch:', error);
            res.status(500).json({ message: 'Error syncing face data.', error });
        }
    };
    chunkArray = (array, size) => {
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    };

    findClosestVector = async (req, res) => {
        // validate input
        let inputVector = req.body.inputVector;
        if (typeof inputVector === 'string') {
            try {
                inputVector = JSON.parse(inputVector);
            } catch (err) {
                throw new BadRequestError("Input vector không phải là JSON hợp lệ.");
            }
        }

        if (typeof inputVector === 'object' && !Array.isArray(inputVector)) {
            inputVector = Object.values(inputVector);
        }

        if (!Array.isArray(inputVector) || inputVector.length !== 128) {
            throw new BadRequestError("Input vector không hợp lệ, cần là mảng có 128 phần tử.");
        }

        // Find process
        try {
            // Truy vấn tất cả các vectors trong Elasticsearch
            const { hits } = await elasticClient.search({
                index: 'face-recognition',
                size: 10000,
                _source: ['mssv', 'vector', 'studentId']
            });

            if (!hits.total.value) {
                throw new Error('Không tìm thấy vector nào trong Elasticsearch');
            }

            let closestMSSV = null;
            let closestId = null;
            let minDistance = Infinity;
            
            // Duyệt qua tất cả các vector và tính khoảng cách
            for (const hit of hits.hits) {
                const { mssv, studentId, vector } = hit._source;
                const distance = this.calculateEuclideanDistance(inputVector, vector);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestMSSV = mssv;
                    closestId = studentId
                }
            }

            // Trả về kết quả với ngưỡng < 0.38
            if (minDistance < 0.38) {
                return res.status(200).json({
                    message: 'Find closest successfully',
                    mssv: closestMSSV, studentId: closestId, distance: minDistance
                });
            } else {
                return res.status(203).json({ message: 'Không tìm thấy vector phù hợp', distance: minDistance });
            }
        } catch (error) {
            console.error('Lỗi khi tìm nhãn:', error.message);
            throw error;
        }
    }
    findClosestKNN = async (req, res) => {
        let inputVector = req.body.inputVector;
        const k = req.body.k || 5; // Số lượng kết quả gần nhất cần tìm
    
        if (typeof inputVector === 'string') {
            try {
                inputVector = JSON.parse(inputVector);
            } catch (err) {
                throw new BadRequestError("Input vector không phải là JSON hợp lệ.");
            }
        }
    
        if (typeof inputVector === 'object' && !Array.isArray(inputVector)) {
            inputVector = Object.values(inputVector);
        }
    
        if (!Array.isArray(inputVector) || inputVector.length !== 128) {
            throw new BadRequestError("Input vector không hợp lệ, cần là mảng có 128 phần tử.");
        }
    
        try {
            // Truy vấn K-NN trong Elasticsearch
            const { hits } = await elasticClient.search({
                index: 'face-recognition',
                size: k, // Lấy k kết quả gần nhất
                body: {
                    query: {
                        knn: {
                            "vector": {
                                "field": "vector", // Trường chứa vector trong Elasticsearch
                                "query_vector": inputVector,
                                "k": k
                            }
                        }
                    }
                }
            });
    
            if (!hits.total.value) {
                throw new Error('Không tìm thấy vector nào trong Elasticsearch');
            }
    
            // Trả về kết quả K-NN
            const closestResults = hits.hits.map(hit => {
                const { mssv, studentId, vector } = hit._source;
                const distance = this.calculateEuclideanDistance(inputVector, vector);
                return { mssv, studentId, distance };
            });
    
            return res.status(200).json({
                message: 'Find closest K-NN successfully',
                results: closestResults
            });
        } catch (error) {
            console.error('Lỗi khi tìm K-NN:', error.message);
            throw error;
        }
    };
    
    // Hàm tính khoảng cách Euclidean
    calculateEuclideanDistance = function (vec1, vec2) {
        return Math.sqrt(vec1.reduce((sum, v, i) => sum + Math.pow(v - vec2[i], 2), 0));
    }

    // Hàm tính khoảng cách Cosin
    calculateCosineSimilarity = function (vec1, vec2) {
        // if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
        //     throw new Error("Hai vector phải có cùng chiều và là mảng.");
        // }
    
        // Tính tích vô hướng (dot product)
        const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    
        // Tính độ dài (norm) của từng vector
        const magnitudeA = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
        const magnitudeB = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    
        if (magnitudeA === 0 || magnitudeB === 0) {
            throw new Error("Độ dài của vector không được bằng 0.");
        }
    
        // Tính Cosine Similarity
        console.log(dotProduct / (magnitudeA * magnitudeB));
        
        return dotProduct / (magnitudeA * magnitudeB);
    };
    
}

module.exports = new RecogController;