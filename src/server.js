// Path
const path = require('path');

const serverUtil = require('./utils/ServerUtil');
const port = serverUtil.normalizePort(process.env.PORT || '5000');
const FRONTEND_URL = serverUtil.normalizePort(process.env.FRONTEND_URL || 'http://localhost:3000');

// Require
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

//Security Define
const cors = require("cors");


const express = require('express');
const app = express();
app.use(express.json());

const apiRouter = require('./routes/ApiRouter');
// Security Implementations
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Attendance Face API');
});

// API Router
app.use('/api', apiRouter);

// Catch 404 error
app.use((req, res) => {
    return res.status(404).json({
        'status': 404,
        'message': 'Not Found.',
        'data': {}
    });
});

// Listen to port
app.listen(port, () => { console.log(`Server started on http://localhost:${port} press Ctrl-C to terminate.`) });