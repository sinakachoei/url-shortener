const redis = require('redis');
const redisConfig = require('../config/redis');

const client = redis.createClient(redisConfig.PORT);

module.exports = {
    async get(key) {
        return await client.get(key);
    },

    async set(key, value) {
        await client.set(key, value);
    },
    client,
};
