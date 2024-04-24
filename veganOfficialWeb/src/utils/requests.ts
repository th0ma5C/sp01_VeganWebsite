import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';

const customAdapter: AxiosAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
    const reqRetry = async (retryCount = 0): Promise<AxiosResponse<any>> => {
        try {
            return await axios({ ...config, adapter: axios.defaults.adapter });
        } catch (error) {
            const maxRetries = 3;
            if (retryCount < maxRetries) {
                const retryDelay = Math.pow(2, retryCount) * 1000;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reqRetry(retryCount + 1).then(resolve).catch(reject);
                    }, retryDelay);
                });
            }
            throw error;
        }
    };

    // 初始调用
    return reqRetry();
};

const requests = axios.create({
    // 基礎路徑
    baseURL: '/api',
    // 超時時間
    //timeout: 5000,
    onDownloadProgress: (progressEvent) => {
    },
    adapter: customAdapter
});

// 請求攔截器
requests.interceptors.request.use((config) => {
    return config;
})

// 響應攔截器
requests.interceptors.response.use((res) => {
    return res.data;
}, (err) => {
    return Promise.reject(/*new Error('failed!')*/ err);
})

export default requests;