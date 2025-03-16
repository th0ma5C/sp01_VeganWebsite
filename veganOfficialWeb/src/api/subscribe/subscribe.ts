import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

interface SubscribeRes {
    message: string,
    state: 'confirm' | 'denied'
}

const reqSubscribe = (params?: any) => {
    return request.post<any, SubscribeRes>('/subscribe/send-subscribeEmail', {
        ...params
    })
}

export {
    reqSubscribe
}