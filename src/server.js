const express = require('express');
const app = express();

var port = normalizePort(process.env.PORT || '5000');

app.listen(port, () => { console.log(`Server started on http://localhost:${port} press Ctrl-C to terminate.`) });