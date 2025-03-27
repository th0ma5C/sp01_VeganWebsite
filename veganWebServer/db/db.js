const redis = require('../redisClient');
const updateRedis = require('../scripts/updateRedis');
const { scheduleTokenRefresh, refreshGCPToken, autoRefreshToken } = require('../scripts/refreshOAuth');

module.exports = (success, error) => {
    if (typeof error != 'function') {
        error = () => {
            console.log('連接失敗');
        }
    }

    const mongoose = require('mongoose');
    const { defaultDB } = require('../config/config');
    const defaultUri = `mongodb://${defaultDB.DBHOST}:${defaultDB.DBPORT}/${defaultDB.DBNAME}`;
    // const backupUri = `mongodb://${backupDB.DBHOST}:${backupDB.DBPORT}/${backupDB.DBNAME}`;

    mongoose.set('strictQuery', true);

    const uris = [defaultUri];
    let connected = false;

    (async () => {
        for (let uri of uris) {
            try {
                await mongoose.connect(uri);
                console.log(`${uri}連接成功`);

                if (!redis.isOpen) {
                    await redis.connect();
                }
                console.log('Redis activated');

                await updateRedis();

                // await refreshGCPToken();
                // await scheduleTokenRefresh();
                // await autoRefreshToken();

                success();
                connected = true;

                break;

            } catch (err) {
                console.log(`連接失敗: ${uri}`, err);

                if (!connected) {
                    error()
                };
            }
        }

        mongoose.connection.once('close', () => {
            console.log('連接關閉');
        });
    })()

    // (async function () {
    //     try {
    //         await mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)
    //         console.log('連接成功');
    //         success();
    //     } catch (error) {
    //         console.log(error);
    //         error();
    //     }

    //     mongoose.connection.once('close', () => {
    //         console.log('連接關閉');
    //     });
    // })()

    // mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
    // mongoose.connection.once('open', () => {
    //     console.log('連接成功');
    //     success();
    // });
    // mongoose.connection.on('error', () => {
    //     error();
    // });

}