const express = require('express');
const router = express.Router();

const coupon = {
    vegan50: 50,
    vegan100: 100
}

function findCoupon(code) {
    return Object.hasOwn(coupon, code)
}

router.post('/getCoupon', (req, res) => {
    const { code } = JSON.parse(req.body.data);

    if (!findCoupon(code)) {
        return res.status(400).json({
            message: '折扣碼輸入錯誤'
        })
    }

    // 返回結果
    res.status(200).json({
        message: '折扣成功',
        data: {
            code,
            value: coupon[code]
        }
    });
})


module.exports = router;
