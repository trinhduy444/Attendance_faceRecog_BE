require('dotenv').config();
const serverUtil = require('./src/utils/ServerUtil');

const PORT = serverUtil.normalizePort(process.env.PORT || '5000');
const app = require('./src/app')
// Listen to IIFE
const server = (() => {
    app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT} press Ctrl-C to terminate.`) });
})()



// process.on(`SIGINT`, () => {
//     server.close(() => console.log(`Exit MSV eCommerce server`))
// })