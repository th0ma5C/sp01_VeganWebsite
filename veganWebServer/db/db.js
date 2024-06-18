module.exports = (success, error) => {
    if (typeof error != 'function') {
        error = () => {
            console.log('連接失敗');
        }
    }

    const mongoose = require('mongoose');
    const { DBHOST, DBPORT, DBNAME } = require('../config/config');

    mongoose.set('strictQuery', true);

    (async function () {
        try {
            await mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)
            console.log('連接成功');
            success();
        } catch (error) {
            console.log(error);
            error();
        }

        mongoose.connection.once('close', () => {
            console.log('連接關閉');
        });
    })()

    // mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
    // mongoose.connection.once('open', () => {
    //     console.log('連接成功');
    //     success();
    // });
    // mongoose.connection.on('error', () => {
    //     error();
    // });

}