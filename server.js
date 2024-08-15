require('dotenv').config();
const http = require('http');
const serverUtil = require('./src/utils/ServerUtil');
const { closeRedis } = require('./src/config/RedisConfig');

const PORT = serverUtil.normalizePort(process.env.PORT || '5000');
const app = require('./src/app')
// initRedis();

const server = http.createServer(app);

// Listen to IIFE
// const server = (() => {
//     app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT} press Ctrl-C to terminate.`) });
// })()

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT} press Ctrl-C to terminate.`);
});

process.on('SIGINT', () => {
    closeRedis();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});