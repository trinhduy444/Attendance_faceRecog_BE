const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const authController = require('../../controllers/AuthController');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

// Login
router.post('/login', authController.login);
router.get('/login/success', authController.loginGoogle);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/v1/auth/failure' }),authController.loginGoogle);

//Logout and failure
router.use('/logout', authController.logout);
router.get('/failure', authController.loginFailure);

//Check authentication
router.get('/protected', isLoggedIn, (req, res) => {
    let nickname = req.user.nickname;
    res.send(`Hello ${nickname}`);
})

module.exports = router;