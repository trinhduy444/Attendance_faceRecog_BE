const request = require('supertest');
const app = require('../src/app');

describe('Post Auth Controller Tests and CheckPassword', () => {

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

    it('should return status 200 and message "Password correct"', async () => {
        const response = await request(app)
            .post('/api/v1/auth/checkPassword')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send({
                password: '607Duy0655'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password correct');
    });

    it('should return status 401 and message "Wrong password"', async () => {
        const response = await request(app)
            .post('/api/v1/auth/checkPassword')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send({
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Wrong password');
    });

    it('should return status 403 for missing password', async () => {
        const response = await request(app)
            .post('/api/v1/auth/checkPassword')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send({});

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Please enter a password.");  
    });
});


describe('POST isLogin Student', () => {
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

        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.body.refreshToken;

    });
    it('should return status 200 and message "Authenticated" when the user is logged in', async () => {
        const response = await request(app)
            .post('/api/v1/auth/isLogin')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Authenticated');
    });

    it('should return status 403 when "Not Authenticate"', async () => {
        const response = await request(app)
            .post('/api/v1/auth/isLogin');
        
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Not Authenticate');
    });
});

describe('POST isAdmin', () => {
    let accessToken;
    let refreshToken;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: 'admin2',
                password: '123Admin456'
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.message).toBe('Login success.');
        expect(loginResponse.body.accessToken).toBeDefined();
        expect(loginResponse.body.refreshToken).toBeDefined();

        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.body.refreshToken;

    });
    it('should return status 200 and message "OK" when the user is admin', async () => {
        const response = await request(app)
            .post('/api/v1/auth/isAdmin')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OK');
    });
});

describe('POST isTeacher', () => {
    let accessToken;
    let refreshToken;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: 'GV10011181',
                password: '421Ngan2023'
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.message).toBe('Login success.');
        expect(loginResponse.body.accessToken).toBeDefined();
        expect(loginResponse.body.refreshToken).toBeDefined();

        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.body.refreshToken;

    });
    it('should return status 200 and message "OK" when the user is teacher', async () => {
        const response = await request(app)
            .post('/api/v1/auth/isTeacher')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OK');
    });
});