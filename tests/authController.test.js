const request = require('supertest');
const app = require('../src/server');

describe('POST /api/v1/auth/login', () => {
    it('should return status 200 and message "Login success."', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: '52000655',
                password: '123456'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login success.');
        expect(response.body.data.accessToken).toBeDefined();
    });

});
