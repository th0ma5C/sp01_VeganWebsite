import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

interface ECFormResponse {
    state: string,
    form: string
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

const fetchLinePayUrl = (orderId: string) => {
    return request.post<any, LinePayUrlRes>('/checkout/LinePayUrl', {
        orderId
    })
}

export {
    fetchECorderForm,
    ECpayAPIconfig,
    fetchLinePayUrl
}