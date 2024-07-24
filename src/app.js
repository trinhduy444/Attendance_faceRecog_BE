// Path
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const serverUtil = require('./utils/ServerUtil');

const FRONTEND_URL = serverUtil.normalizePort(process.env.FRONTEND_URL || 'http://localhost:3000');
// Require
const express = require('express');
const app = express();
const cors = require("cors");
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const {errorHandler} = require('./core/ErrorResponse')

// Init Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());


// Security Implementations
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());


// Init API Router
const apiRouter = require('./routes/ApiRouter');
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Attendance Face API');
});


// Hanling Error
app.use((req, res) => {
    return res.status(404).json({
        'status': 404,
        'message': 'Not Found.',
        'data': {}
    });
});


module.exports = app;