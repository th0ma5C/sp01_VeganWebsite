import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const request = axios.create({
    baseURL: 'https://payment-stage.ecpay.com.tw',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

request.interceptors.response.use((res) => {
    return res.data;
}, (err) => {
    return Promise.reject(err);
});

const api = '/Cashier/AioCheckOut/V5';

const fetchECpayAPI = (params: any) => {
    return request.post(api, {
        ...params
    })
}



export {
    fetchECpayAPI
}