// Path
const path = require('path');

const serverUtil = require('./utils/ServerUtil');
const port = serverUtil.normalizePort(process.env.PORT || '5000');

// Require
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const express = require('express');
const app = express();

const apiRouter = require('./routes/ApiRouter');

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