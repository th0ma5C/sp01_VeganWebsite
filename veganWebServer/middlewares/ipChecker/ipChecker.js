const dns = require('dns');
const { promisify } = require("util");

const resolve4Async = promisify(dns.resolve4);

// const allowedDomains = ['postgate.ecpay.com.tw', 'postgate-stage.ecpay.com.tw'];
const allowedDomains = process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : [];

const ipResolver = (clientIp) => {
    return allowedDomains.map(async (domain) => {
        try {
            const addresses = await resolve4Async(domain);
            return addresses.includes(clientIp);
        } catch (err) {
            console.error(`解析域名 ${domain} 時出錯:`, err);
            return false;
        }
    })
}

const isIpAllowed = async (clientIp) => {
    try {
        const results = await Promise.all(ipResolver(clientIp));
        return results.includes(true);
    } catch (error) {
        console.error("發生錯誤:", error);
        return false;
    }
}

// (async () => {
//     const res = await ipChecker('175.99.72.1')
//     console.log(res);
// })()

module.exports = isIpAllowed

// 解析域名並比對 IP 是否在白名單中
// function ipChecker(clientIp, callback) {
//     const domainPromises = allowedDomains.map(domain => {
//         return new Promise((resolve, reject) => {
//             dns.resolve4(domain, (err, addresses) => {
//                 if (err) {
//                     reject(`解析域名 ${domain} 時出錯: ${err}`);
//                 } else {
//                     // 如果客戶端 IP 在該域名解析的 IP 列表中，則允許
//                     if (addresses.includes(clientIp)) {
//                         resolve(true);
//                     } else {
//                         resolve(false);
//                     }
//                 }
//             });
//         });
//     });

//     // 當至少有一個域名匹配時，返回 true
//     Promise.all(domainPromises)
//         .then(results => {
//             if (results.includes(true)) {
//                 callback(true);
//             } else {
//                 callback(false);
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             callback(false);
//         });
// }


/**
    app.get('/api/some-endpoint', (req, res) => {
        const clientIp = req.ip; // 獲取請求來源 IP

        isIpAllowed(clientIp, (allowed) => {
            if (allowed) {
                res.send('IP 匹配，請求成功');
            } else {
                res.status(403).send('IP 不在白名單中，禁止訪問');
            }
        });
    });

    app.listen(port, () => {
        console.log(`伺服器運行在 http://localhost:${port}`);
    });
*/
