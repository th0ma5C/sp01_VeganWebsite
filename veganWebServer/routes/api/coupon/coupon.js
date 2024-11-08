const express = require('express');
const router = express.Router();

const coupon = {
    vegan50: 50,
    vegan100: 100
}

function findCoupon(code) {

}

router.post('/checkCoupon', (req, res) => {
    const { code, discount } = req.body;

    // 簡單數據驗證
    if (!code || !discount) {
        return res.status(400).json({ error: '缺少 code 或 discount 欄位' });
    }

    // 假設進行了一些計算或邏輯處理
    const finalDiscount = discount * 0.9; // 假設折扣額度進行了一些簡單計算

    // 返回結果
    res.status(201).json({
        message: '折扣碼計算完成',
        data: { code, finalDiscount }
    });
})


module.exports = router;
