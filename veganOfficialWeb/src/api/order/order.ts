import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

const reqCreateOrder = (params: any) => {
    return request.post('/api/order/createOrder', {
        ...params
    })
}


export {
    reqCreateOrder
}