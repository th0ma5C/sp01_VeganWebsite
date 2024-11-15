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

interface RegisterForm {
    joinPrivacyPolicy: boolean,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

interface LoginForm {
    email: string,
    password: string,
}


const reqUserRegister = (params: RegisterForm) => {
    return request.post('/api/auth/register', {
        ...params
    })
}

const reqUserLogin = (params: LoginForm) => {
    return request.post<any, AuthResData>('/api/auth/login', {
        ...params
    })
}

const reqGetUser = () => request.get<any, AuthResData>('/api/auth/profile');

const reqSendVerifyEmail = (params?: any) => {
    return request.post('/api/auth//send-verifyEmail', {
        ...params
    })
}

const reqUserLogout = () => {
    return request.post<any, AuthResData>('api/auth/logout')
}


export {
    reqUserRegister,
    reqUserLogin,
    reqUserLogout,
    reqGetUser,
    reqSendVerifyEmail
}