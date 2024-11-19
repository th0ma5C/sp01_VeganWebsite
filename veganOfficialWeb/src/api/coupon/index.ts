import request from '@/utils/request/requests';
import type { CouponCode } from './type';

interface CouponRes {
    data?: {
        code: string,
        value: number
    },
    message: string
}

const reqFetchCoupon = (params: CouponCode) => {
    return request.post<any, CouponRes>('/api/coupon/getCoupon', {
        data: JSON.stringify(params)
    })
}

export {
    reqFetchCoupon,
    type CouponCode
}