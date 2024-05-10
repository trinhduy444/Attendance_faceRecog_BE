const sql = require('mssql/msnodesqlv8');
const sqlConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
        type: process.env.DB_TYPE,
        options: {
            user: process.env.DB_USER,
            password: process.env.DB_PWD
        }
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        trustedConnection: true
    }
}

class SqlConnection {
    constructor() {
        this.connection = new sql.ConnectionPool(sqlConfig);
    }
    
    getConnectionPool() {
        return this.connection;
    }
}

module.exports = new SqlConnection;