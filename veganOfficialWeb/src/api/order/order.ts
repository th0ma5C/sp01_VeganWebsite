import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { OrderResData } from './type'

// 驗證價格
const reqVerifyItemPrice = (params: any) => {
    return request.post<any, OrderResData>('/api/order/verifyPurchaseOrder', { ...params })
}

// user shipping info
const reqGetUserShippingInfo = (token: string) => {
    return request.get<any, OrderResData>('/api/order/getShippingInfo', {
        headers: {
            Authorization: token
        }
    })
}

// 建立訂單
const reqCreateOrder = (params: any) => {
    return request.post<any, OrderResData>('/api/order/createOrder', {
        ...params
    })
}

// 查詢訂單
const reqGetUserOrder = (token: string) => {
    return request.get<any, OrderResData>('/api/order/userOrderList', {
        headers: {
            Authorization: token
        }
    })
}

// 刪除訂單


// 修改訂單




export {
    reqVerifyItemPrice,
    reqGetUserShippingInfo,
    reqCreateOrder,
    reqGetUserOrder
}