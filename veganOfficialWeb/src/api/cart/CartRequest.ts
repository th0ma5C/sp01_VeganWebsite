import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { ResData } from './type'

// 儲存cart
const reqSaveCartList = (params: any, token: string | null) => {
    return request.post('/cart/saveList', {
        data: {
            cart: params
        }
    }, {
        headers: {
            Authorization: token
        }
    })
}

// get member cart
const reqGetMemberCart = (token: string | null) => {
    return request.get<any, ResData>('/cart/getList', {
        headers: {
            Authorization: token
        }
    })
}

// after created order, reset cart
const reqResetMemberCart = (token: string | null) => {
    return request.delete('/cart/resetList', {
        headers: {
            Authorization: token
        }
    })
}


export {
    reqSaveCartList,
    reqGetMemberCart,
    reqResetMemberCart
}