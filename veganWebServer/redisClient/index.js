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

// (async () => {
//     try {
//         await client.connect();
//     } catch (err) {
//         console.error('Failed to connect to Redis:', err);
//     }
// })();

module.exports = client;
