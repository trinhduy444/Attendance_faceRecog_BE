const request = require('supertest');
const app = require('../src/app');

describe('Get Information Course Group by id', () => {

    it('should return status 200 with message "Get Info Course Group Successfully" and metadata is defined', async () => {
        const response = await request(app)
            .get('/api/v1/courses/getInfoCourseGroup/146')


        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Get Info Course Group Successfully');
        expect(response.body.metadata).toBeDefined();
    });

});

