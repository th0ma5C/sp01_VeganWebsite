// 保存結帳資訊
const User = require('@models/User');

async function saveShippingInfo(userId, info) {
    try {
        // const user = await User.findById(userId);
        // if (user) {
        //     user.shippingInfo = info;
        //     await user.save();
        // }
        await User.findByIdAndUpdate(
            userId,
            { $set: { 'shippingInfo': info } },
            { runValidators: true, upsert: true }
        );
        return
    } catch (error) {
        console.error("Error saving shipping info");
        throw error;
    }
}

module.exports = {
    saveShippingInfo
}