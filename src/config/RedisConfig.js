// const redis = require('redis');
// const rateLimit = require('express-rate-limit');
// const RedisStore = require('rate-limit-redis');
// const redisClient = redis.createClient();

// const limiter = rateLimit({
//     store: new RedisStore({
//         client: redisClient
//     }),
//     windowMs: 15 * 60 * 1000, 
//     max: 100 // 100 requests per 15 minutes
// });

// module.exports = limiter;