const dns = require('dns');
const { promisify } = require("util");

const resolve4Async = promisify(dns.resolve4);

// const allowedDomains = process.env.ALLOWED_EC_DOMAINS ? process.env.ALLOWED_EC_DOMAINS.split(',') : [];

const ipResolver = ({
    clientIp,
    domains,
    ips
}) => {
    if (domains) {
        return domains.map(async (domain) => {
            try {
                const addresses = await resolve4Async(domain);
                return addresses.includes(clientIp);
            } catch (error) {
                console.error(`解析域名 ${domain} 時出錯:`, error);
                return false;
            }
        })
    } else if (ips) {
        return ips.map((ip) => ip === clientIp);
    } else {
        return [false]
    }
}

const isIpAllowed = async (params) => {
    try {
        const results = await Promise.all(ipResolver({ ...params }),);
        return results.includes(true);
    } catch (error) {
        console.error("發生錯誤:", error);
        return false;
    }
}


module.exports = isIpAllowed

// (async () => {
//     const foo = ['147.92.159.209', '147.92.159.21', '147.92.159.68']
//     const res = await isIpAllowed({
//         clientIp: '147.92.159.6',
//         ips: foo
//     })
//     console.log(res);
// })()

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
