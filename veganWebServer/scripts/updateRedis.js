const redisClient = require('../redisClient');
const Stocks = require('../models/StockModel');

module.exports = async (params) => {
    try {
        console.log('Starting cache update...');

        // 查詢所有商品
        const stocks = await Stocks.find();

        // 使用 Redis Multi 寫入數據
        const multi = redisClient.multi();
        stocks.forEach((item) => {
            multi.set(`${item.name}`, item.price, { EX: 43200 }); // 12 hr
        });

        await multi.exec();
        console.log('Cache update completed.');

    } catch (err) {
        console.error('Error updating cache:', err);
    }
}
