// Path
const path = require('path');

const serverUtil = require(path.join(__dirname, 'utils', 'ServerUtil.js'));
const port = serverUtil.normalizePort(process.env.PORT || '5000');

// Require
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const express = require('express');
const sqlConnection = require('./utils/SqlConnection');
const app = express();

app.use('/', (req, res) => {
    res.send('Attendance Face API');
});

sqlConnection.getConnectionPool().connect().then((pool) => {
    app.locals.db = pool;
    app.listen(port, () => { console.log(`Server started on http://localhost:${port} press Ctrl-C to terminate.`) });
}).catch((err) => {
    console.error('Error creating connection pool', err);
});