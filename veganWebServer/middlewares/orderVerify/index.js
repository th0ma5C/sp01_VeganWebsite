const Stocks = require('@models/StockModel');
const redisQueue = require('@root/queues/redisQueue');
const redisClient = require('@root/redisClient');

/**
 * const lock = await redisClient.set('isCacheUpdating', 'true', {
            NX: true,
            EX: 300,
          });
          if (lock) {
            redisQueue.add({}, {
              removeOnComplete: true,
              removeOnFail: true,
            });
          }
          原子鎖
 */

async function checkStocks(list) {
    try {
        const checkList = await Promise.all(
            list.map(async (item, index) => {
                let checkPrice = await redisClient.get(item.name);
                if (!checkPrice) {
                    const stock = await Stocks.findOne({ name: item.name });
                    if (!stock) {
                        throw new Error(`Product not found: ${item.name}`);
                    }
                    checkPrice = stock.price
                    await redisClient.set(item.name, checkPrice, { EX: 93600 });

                    const isUpdating = await redisClient.get('isCacheUpdating');
                    if (!isUpdating) {
                        await redisClient.set('isCacheUpdating', 'true', { EX: 300 });
                        redisQueue.add({}, {
                            removeOnComplete: true,
                            removeOnFail: true
                        })
                    }
                }
                const checkSub = Number(checkPrice) * item.amount;
                return { name: item.name, checkSub };
            })
        )

        for (let index in list) {
            if (list[index].subtotal !== checkList[index].checkSub) {
                return false
            }
        }

        return true

    } catch (error) {
        console.error(error);
        throw new Error('Error checking stocks');
    }
}

async function checkOrder(req, res, next) {
    const order = req.body.order;
    try {
        if (!await checkStocks(order)) {
            return res.status(422).json({ message: '請重新建立訂單', state: 'denied' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(422).json({ message: '請重新建立訂單', state: 'denied' });
    }

}

async function checkSub(req, res, next) {
    try {
        const { orderList, freightFee, discountAmount, couponAmount, total } = req.body.order.purchaseOrder;
        let checkTotal = freightFee - (discountAmount + couponAmount);
        orderList.forEach((item) => {
            checkTotal += item.subtotal
        })
        if (checkTotal !== total) {
            return res.status(422).json({ message: '請重新建立訂單', state: 'denied' })
        }
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '伺服器錯誤, 請重新建立訂單', state: 'denied' });
    }
}



module.exports = {
    checkOrder,
    checkSub
}