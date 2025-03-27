import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

// const request = axios.create({
//     baseURL: 'https://payment-stage.ecpay.com.tw',
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// });

// request.interceptors.response.use((res) => {
//     return res.data;
// }, (err) => {
//     return Promise.reject(err);
// });

// const api = '/Cashier/AioCheckOut/V5';

interface EC_Form_response {
    state: string,
    form: string
}

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


export {
    fetchECorderForm,
    ECpayAPIconfig
}