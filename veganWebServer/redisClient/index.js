const { createClient } = require('redis');

// 创建 Redis 客户端
const client = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

// 处理连接事件
client.on('connect', () => {
    console.log('Connected to Redis');
});

// 处理错误事件
client.on('error', (err) => {
    console.error('Redis Error:', err);
});

// 确保客户端连接
(async () => {
    try {
        await client.connect(); // 新版 Redis 客户端需要显式调用 connect() 方法
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = client;
