'use strict';
require('dotenv').config();
const redis = require('redis');

// Tạo các trạng thái kết nối Redis
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONECT: 'reconnecting',
    ERROR: 'error'
};

// Khởi tạo đối tượng Redis client
let client = {};

// Xử lý các sự kiện kết nối Redis
const handleEventConnection = ({ conectionRedis }) => {
    conectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('Redis: Connected');
    });
    conectionRedis.on(statusConnectRedis.END, () => {
        console.log('Redis: Connection ended');
    });
    conectionRedis.on(statusConnectRedis.RECONECT, () => {
        console.log('Redis: Reconnecting');
    });
    conectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`Redis error: ${err}`);
    });
};

// Khởi tạo kết nối Redis
const initRedis = () => {
    const instanceRedis = redis.createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
    });

    client.instanceConnect = instanceRedis;
    handleEventConnection({
        conectionRedis: instanceRedis
    });

    instanceRedis.connect().then(() => {
        console.log('Redis client connected');
    }).catch((err) => {
        console.error('Redis client connection error:', err);
    });
};

// Lấy instance Redis
const getRedis = () => {
    if (!client.instanceConnect) {
        throw new Error('Redis client is not initialized');
    }
    return client.instanceConnect;
};
// Đóng kết nối Redis
const closeRedis = () => {
    if (client.instanceConnect) {
        client.instanceConnect.quit((err, response) => {
            if (err) {
                console.error('Error closing Redis connection:', err);
            } else {
                console.log('Redis connection closed:', response);
            }
        });
    }
};

module.exports = { initRedis, getRedis, closeRedis };
