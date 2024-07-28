'use strict';
require('dotenv').config();
const redis = require('redis');

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONECT: 'reconnecting',
    ERROR: 'error'
}
const handleEventConnection = ({
    conectionRedis
}) => {
    conectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`ConnectionRedis : connected`)
    })
    conectionRedis.on(statusConnectRedis.END, () => {
        console.log(`ConnectionRedis : ended`)
    })
    conectionRedis.on(statusConnectRedis.RECONECT, () => {
        console.log(`ConnectionRedis : reconnected`)
    })
    conectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`ConnectionRedis error::: ${err}`)
    })
}

const initRedist = () => {
    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis
    handleEventConnection({
        conectionRedis: instanceRedis
    })

}
const getRedist = () => client

const closeRedist = () => {
    if (client.instanceConnect) {
        client.instanceConnect.quit((err, response) => {
            if (err) {
                console.error('Error closing Redis connection:', err);
            } else {
                console.log('Redis connection closed:', response);
            }
        });
    }
}

module.exports = { initRedist, getRedist, closeRedist }
// // create a new cline
// const client = redis.createClient(
//     {
//         host: process.env.REDIS_HOST || 'localhost',
//         port: process.env.REDIS_PORT || 6379
//     }
// );
// client.on('error', err =>{
//     console.error("Redis Errror:::: ",err);
// })
// module.exports = client;