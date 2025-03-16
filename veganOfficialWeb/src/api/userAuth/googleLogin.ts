import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';
import type { AuthResData } from './type'

const mock = {
    "joinPrivacyPolicy": true,
    "username": "th",
    "email": "thomas@gmail.com",
    "password": "thomasthomas",
    "confirmPassword": "thomasthomas"
}

interface LoginUrlRes {
    state: string,
    authUrl: string
}

interface LoginRes {
    token: string,
    result: {
        state: string,
        message: string
    }
}

const reqGoogleLoginUrl = () => {
    return request.get<any, LoginUrlRes>('/OAuth/google-loginUrl')
}

const reqGoogleLogin = (params: any) => {
    return request.post<any, LoginRes>('/OAuth/google-login', {
        ...params
    })
}


export {
    reqGoogleLoginUrl,
    reqGoogleLogin
}