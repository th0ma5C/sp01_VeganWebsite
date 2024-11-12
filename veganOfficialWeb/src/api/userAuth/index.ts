import request from '@/utils/request/requests';
import type { AxiosError } from 'axios';

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
    return request.post('/api/auth/login', {
        ...params
    })
}


export {
    reqUserRegister,
    reqUserLogin
}