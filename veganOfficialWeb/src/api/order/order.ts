import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { OrderResData } from './type'

// 驗證價格
const reqVerifyItemPrice = (params: any) => {
    return request.post<any, OrderResData>('/api/order/verifyPurchaseOrder', { ...params })
}

// user shipping info
const reqGetUserShippingInfo = (token: string | null) => {
    return request.get<any, OrderResData>('/api/order/getShippingInfo', {
        headers: {
            Authorization: token
        }
    })
}

// 建立訂單
const reqCreateOrder = (params: any, token?: string) => {
    return request.post<any, OrderResData>('/api/order/createOrder', {
        ...params
    }, {
        headers: {
            Authorization: token
        }
    })
}

// 查詢訂單
const reqGetUserOrder = (token: string | null) => {
    return request.get<any, OrderResData>('/api/order/userOrderList', {
        headers: {
            Authorization: token
        }
    })
}

// 取消訂單
const reqCancelUserOrder = (token: string | null, orderID: string) => {
    return request.patch<any, OrderResData>(`/api/order/${orderID}`, null, {
        headers: {
            Authorization: token
        }
    })
}

// 修改訂單


export {
    reqVerifyItemPrice,
    reqGetUserShippingInfo,
    reqCreateOrder,
    reqGetUserOrder,
    reqCancelUserOrder
}