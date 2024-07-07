require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./SqlConnection');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value;
        // check user existence in database
        pool.query('select * from sysuser where email = ?', [email], (err, results) => {
            if (err) return done(err);

            if (results.length > 0) {
                return done(null, results[0]);
            } else {
                return done(null, false, { message: 'User does not exist' });
            }
        });
    }
));


passport.serializeUser((user, done) => {
    // console.log(user);
    done(null, user.user_id);
});

passport.deserializeUser((user_id, done) => {
    pool.query('SELECT * FROM sysuser WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});


module.exports = passport;
