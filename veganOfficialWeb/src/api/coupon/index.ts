import request from '@/utils/request/requests';
import type { CouponCode } from './type';

const reqFetchCoupon = (params: CouponCode) => {
    return request.post('/api/coupon/getCoupon', {
        data: JSON.stringify(params)
    })
}

export {
    reqFetchCoupon,
    type CouponCode
}