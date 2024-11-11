const { Client, HttpConnection } = require('@elastic/elasticsearch');

const host = process.env.ES_HOST || '127.0.0.1';
const port = process.env.ES_PORT || '9200';

const client = new Client({
    node: `https://${host}:${port}`,
    auth: {
        username: process.env.ES_USER,
        password: process.env.ES_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = client;