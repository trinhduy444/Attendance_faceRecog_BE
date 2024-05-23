const sql = require('msnodesqlv8');
// Init pool
const pool = new sql.Pool({
    connectionString: `server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Uid=${process.env.DB_USER};Pwd=${process.env.DB_PWD};Trusted_Connection=No;Driver={${process.env.DB_DRIVER}}`
})
pool.open();

// Catch connection error
pool.on('error', (err) => {
    console.log(err);
})
module.exports = pool;