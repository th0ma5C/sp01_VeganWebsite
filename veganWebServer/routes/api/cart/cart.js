const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('@models/User');
const Menu = require('@models/MenuModel');
const { validateRegister, validateLogin, authToken, authJWT, authUser } = require('@middlewares/userValidator');

// 儲存user cart
router.post('/saveList', authUser, async (req, res) => {
    const { userID } = req.user;
    const cart = req.body.data.cart;
    const cartIDs = cart.map(el => el.item);
    try {
        const allItemsExist = await Menu.exists({
            items: { $elemMatch: { _id: { $in: cartIDs } } }
        });

        if (!allItemsExist) {
            if (cart.length == 0) {
                await User.updateOne(
                    { _id: userID },
                    { $set: { cart: [] } },
                    { runValidators: true, upsert: true }
                );
                return res.status(200).json({ msg: 'member cart cleared' });
            }
            return res.status(404).json({ error: `One or more menu items not found` });
        }

        await User.updateOne(
            { _id: userID },
            { $set: { cart } },
            { runValidators: true, upsert: true }
        );

        res.status(200).json({ message: 'Cart updated successfully', state: 'confirm' });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Internal server error' });
    }
})

// 獲取user cart
router.get('/getList', authUser, async (req, res) => {
    const { userID } = req.user;
    try {
        const { cart } = await User.findById(userID).select('cart');
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });
        }
        res.json({ cart, state: 'confirm' });
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// user 送出訂單後 reset cart
router.delete('/resetList', authUser, async (req, res) => {
    const { userID } = req.user;
    try {
        await User.updateOne(
            { _id: userID },
            { $set: { cart: [] } },
            { runValidators: true, upsert: true }
        );

        res.status(200).json({ message: 'Cart clear successfully', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Internal server error' });
    }
})

module.exports = router;