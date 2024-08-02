// mongo 配置文件
const defaultDB = {
    DBHOST: '127.0.0.1',
    DBPORT: 27017,
    DBNAME: 'veganWebDB'
}
const backupDB = {
    DBHOST: '192.168.0.106',
    DBPORT: 27017,
    DBNAME: 'veganWebDB'
}

module.exports = {
    defaultDB,
    backupDB
}
