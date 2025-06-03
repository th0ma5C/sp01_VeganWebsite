import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

interface ECFormResponse {
    state: string,
    form: string
}

interface LinePayParams {
    orderId: string;
    transactionId: string;
}

// 綠界
const fetchECorderForm = (orderId: string) => {
    return request.post<any, ECFormResponse>('/checkout/ECorderForm', {
        orderId
    })
}

const ECpayAPIconfig = () => {
    return {
        action: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST'
    }
}

// line pay
interface LinePayUrlRes {
    state: string,
    url?: string,
    message?: string
}

interface LinePayResultRes {
    state: 'confirm' | 'denied';
    token?: string;
    message?: string
}

const fetchLinePayUrl = (orderId: string) => {
    return request.post<any, LinePayUrlRes>('/checkout/LinePayUrl', {
        orderId
    })
}

const fetchLinePayResult = (params: LinePayParams) => {
    return request.post<any, LinePayResultRes>('/checkout/LinePayPaymentResult', {
        ...params
    })
}

export {
    fetchECorderForm,
    ECpayAPIconfig,
    fetchLinePayUrl,
    fetchLinePayResult
}