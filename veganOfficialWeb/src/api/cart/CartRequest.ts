import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { ResData } from './type'

// interface ResData {
//     cart: {
//         item: string,
//         quantity: number,
//     }
// }

// 儲存cart
const reqSaveCartList = (params: any, token: string | null) => {
    return request.post('/api/cart/saveList', {
        headers: {
            Authorization: token
        },
        data: {
            cart: params
        }
    })
}

// get member cart
const reqGetMemberCart = (token: string | null) => {
    return request.get<any, ResData>('/api/cart/getList', {
        headers: {
            Authorization: token
        }
    })
}

// after created order, reset cart
const reqResetMemberCart = (token: string | null) => {
    return request.delete('/api/cart/resetList', {
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