import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { OrderResData } from './type'

// 驗證價格
const reqVerifyItemPrice = (params: any) => {
    return request.post<any, OrderResData>('/api/order/verifyPurchaseOrder', { ...params })
}

// 建立訂單
const reqCreateOrder = (params: any) => {
    return request.post('/api/order/createOrder', {
        ...params
    })
}

// 刪除訂單


// 修改訂單


// 查詢訂單




export {
    reqVerifyItemPrice,
    reqCreateOrder
}