const request = require('supertest');
const app = require('../src/app');

describe('Get Profile,Get profile error, Check exist user,Get Some information', () => {

    let accessToken;
    let refreshToken;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: '52000655',
                password: '607Duy0655'
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.message).toBe('Login success.');
        expect(loginResponse.body.accessToken).toBeDefined();
        expect(loginResponse.body.refreshToken).toBeDefined();

        // Lưu token để sử dụng trong các test sau
        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.body.refreshToken;

    });

    it('should return status 200 with message "Get Profile Successfully" and metadata is defined', async () => {
        const response = await request(app)
            .post('/api/v1/users/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Get Profile Successfully');
        expect(response.body.metadata).toBeDefined();
    });

    it('should return status 403 when not have token', async () => {
        const response = await request(app)
            .post('/api/v1/users/profile')

        expect(response.status).toBe(403);
    });

    it('Check exist user', async () => {
        const response = await request(app)
            .post('/api/v1/users/checkExistUser')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send({ username: '52000655' })

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Get Image and nickname Successfully")
        expect(response.body.metadata).toBeDefined();
    });
    it('getSomeinfo should return 200 and message is "Get User Info Successfully"', async () => {
        const response = await request(app)
            .post('/api/v1/users/getSomeinfo')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Get User Info Successfully")
        expect(response.body.metadata).toBeDefined();
    });

});

