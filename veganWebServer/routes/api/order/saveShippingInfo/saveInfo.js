// 保存結帳資訊
// const User = require('@models/User');
const ShippingInfo = require('@models/ShippingInfoModel');

async function saveShippingInfo(data) {
    try {
        return await ShippingInfo.create(data)
    } catch (error) {
        console.error("Error saving shipping info");
        throw error;
    }
}

async function deleteShippingInfo(userID) {
    try {
        return await ShippingInfo.deleteOne({ userID })
    } catch (error) {
        console.error("Error delete shipping info");
        throw error;
    }
}

async function editShippingInfo(data) {
    try {
        const { __v, ...filterData } = data;
        return await ShippingInfo.findByIdAndUpdate(
            data._id,
            { ...filterData, $inc: { __v: 1 } },
            { new: true }
        )
    } catch (error) {
        console.error("Error edit shipping info");
        throw error;
    }
}

async function getShippingInfo(userID) {
    try {
        return await ShippingInfo.findOne({ userID });
    } catch (error) {
        console.error("Error get shipping info");
        throw error;
    }
}

module.exports = {
    saveShippingInfo,
    deleteShippingInfo,
    editShippingInfo,
    getShippingInfo
}