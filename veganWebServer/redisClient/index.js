// const session = require('express-session');
// const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const client = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

module.exports = client;
