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
    return request.post('/auth/register', {
        ...params
    })
}

const reqUserLogin = (params: LoginForm) => {
    return request.post<any, AuthResData>('/auth/login', {
        ...params
    })
}

const reqGetUser = () => request.get<any, AuthResData>('/auth/profile');

const reqCheckUserVerified = () => request.get<any, AuthResData>('/auth/checkUserVerified');

const reqSendVerifyEmail = (params?: any) => {
    return request.post<any, AuthResData>('/auth//send-verifyEmail', {
        ...params
    })
}

const reqUserLogout = () => {
    return request.post<any, AuthResData>('/auth/logout')
}

const reqRedirectLogin = (params: any) => {
    return request.post<any, AuthResData>('/auth/tokenLogin', null, {
        headers: {
            Authorization: params.token
        }
    })
}

const reqForgetPasswordEmail = (params: Record<string, string>) => {
    return request.post('/auth/forgetPassword', {
        ...params
    })
}

const reqResetPassword = (params: Record<string, string>) => {
    return request.patch('/auth/resetPassword', {
        ...params
    })
}


export {
    reqUserRegister,
    reqUserLogin,
    reqUserLogout,
    reqGetUser,
    reqSendVerifyEmail,
    reqRedirectLogin,
    reqForgetPasswordEmail,
    reqResetPassword,
    reqCheckUserVerified
}