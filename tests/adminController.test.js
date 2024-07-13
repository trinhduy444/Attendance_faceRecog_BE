const request = require('supertest');
const app = require('../src/server');

describe('POST /api/v1/admin/createUsers', () => {
    it('should return status 401 and message "Unauthorized user."', async () => {
        const responseLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: '52000655',
                password: '123456'
            });
        
        const token = responseLogin.body.data.token;

        const response = await request(app)
            .post('/api/v1/admin/createUsers')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized user.');
    });

});
