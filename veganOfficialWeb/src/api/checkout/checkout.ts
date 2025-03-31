import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

interface EC_Form_response {
    state: string,
    form: string
}

// 綠界
const fetchECorderForm = (params: string) => {
    return request.post<any, EC_Form_response>('/checkout/ECorderForm', {
        orderId: params
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