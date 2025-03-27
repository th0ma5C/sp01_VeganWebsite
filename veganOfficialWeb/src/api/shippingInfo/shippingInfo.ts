import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { ShippingInfo } from '../order/type';

interface InfoRes {
    result: ShippingInfo,
    state: string
}

const saveShippingInfo = (params: Partial<ShippingInfo>, token: string) => {
    return request.patch<any, InfoRes>('/order/saveShippingInfo', {
        ...params
    }, {
        headers: {
            Authorization: token
        }
    })
}

const deleteShippingInfo = (token: string) => {
    return request.delete('/order/saveShippingInfo', {
        headers: {
            Authorization: token
        }
    })
}


export {
    saveShippingInfo,
    deleteShippingInfo
}