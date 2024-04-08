const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET new catalog */
router.get('/newCatalog', (req, res) => {
    const imagesDirectory = path.join(__dirname, '../../public/images/menu/homeCatalog');

    // 讀取資料夾內所有文件的名稱
    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: '無法讀取圖片資料夾' });
        }

        // 建立圖片URL清單
        const imagesUrls = files.map(file => {
            return `/images/menu/homeCatalog/${file}`;
        });
        res.json(imagesUrls);
    });
});
/* GET hot catalog */
router.get('/hotCatalog', (req, res) => {
    const imagesDirectory = path.join(__dirname, '../../public/images/menu/homeCatalog');

    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: '無法讀取圖片資料夾' });
        }

        const imagesUrls = files.map(file => {
            return `/images/menu/homeCatalog/${file}`;
        }).reverse();
        res.json(imagesUrls);
    });
});

module.exports = router;
