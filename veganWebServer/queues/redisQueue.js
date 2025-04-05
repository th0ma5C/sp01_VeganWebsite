// @queues/cacheQueue.js
require('module-alias/register');
const Queue = require('bull');
const updateRedis = require('@scripts/updateRedis');

// 建立 queue，使用 Redis 作為 backend
const cacheQueue = new Queue('cacheUpdateQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
    },
});

// 任務處理邏輯：更新整包 Redis
cacheQueue.process(async (job) => {
    console.log('Processing cache update job...');
    await updateRedis();
    console.log('Cache update finished.');
});

module.exports = cacheQueue;
