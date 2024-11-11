require('dotenv').config();
const http = require('http');
const serverUtil = require('./src/utils/ServerUtil');
const { closeRedis } = require('./src/config/RedisConfig');
const { Server } = require('socket.io');

const FRONTEND_URL = serverUtil.normalizePort(process.env.FRONTEND_URL || 'http://localhost:3000');
const PORT = serverUtil.normalizePort(process.env.PORT || '5000');
const app = require('./src/app')

const server = http.createServer(app);

// Set up face recognition socket
const io = new Server(server, {
    maxHttpBufferSize: 1e8, // 100 MB
    cors: {
        origin: FRONTEND_URL
    }
});
require('./src/sockets/FaceRecogSocket')(io);

// Listeining to port
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT} press Ctrl-C to terminate.`);
});

// Close Redis when shut down server
process.on('SIGINT', () => {
    closeRedis();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});