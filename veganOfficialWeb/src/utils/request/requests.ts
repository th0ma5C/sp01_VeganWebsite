import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import * as NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const customAdapter: AxiosAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
    const maxRetries = 3;
    const delay = 5000;

    const reqRetry = async (retryCount = 0): Promise<AxiosResponse<any>> => {
        try {
            return await axios({ ...config, adapter: axios.defaults.adapter });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                // if (status >= 500 && status < 600 || status == 404 || status == 401) {
                //     throw error;
                // }
                if (status !== 400) {
                    throw error;
                }
            }

            if (retryCount < maxRetries) {
                const retryDelay = Math.pow(2, retryCount) * delay;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reqRetry(retryCount + 1).then(resolve).catch(reject);
                    }, retryDelay);
                });
            }
            throw error;
        }
    };

    return reqRetry();
};

const urlPrefix = import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_API_BASE_URL;

const requests = axios.create({
    baseURL: urlPrefix + '/api',
    adapter: customAdapter,
    withCredentials: true
});

// 請求攔截器
requests.interceptors.request.use((config) => {
    NProgress.start()
    return config;
})

// 響應攔截器
requests.interceptors.response.use((res) => {
    NProgress.done()
    return res.data;
}, (err) => {
    NProgress.done()
    return Promise.reject(/*new Error('failed!')*/ err);
})

export default requests;