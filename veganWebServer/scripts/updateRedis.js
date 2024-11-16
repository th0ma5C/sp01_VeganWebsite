const redisClient = require('../redisClient');
const Stocks = require('../models/stockModel');

module.exports = async (params) => {
    try {
        console.log('Starting cache update...');

        // 查詢所有商品
        const stocks = await Stocks.find();

        // 使用 Redis Multi 寫入數據
        const multi = redisClient.multi();
        stocks.forEach((item) => {
            multi.set(`product:${item._id}`, item.price, { EX: 86400 }); // 1d
        });

        await multi.exec();
        console.log('Cache update completed.');

    } catch (err) {
        console.error('Error updating cache:', err);
    }
}
