// Path
const path = require('path');

const serverUtil = require(path.join(__dirname, 'utils', 'ServerUtil.js'));

// Require
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const express = require('express');
const app = express();
const port = serverUtil.normalizePort(process.env.PORT || '5000');

app.use('/', (req, res) => {
    res.send('Attendance Face API');
});

app.listen(port, () => { console.log(`Server started on http://localhost:${port} press Ctrl-C to terminate.`) });