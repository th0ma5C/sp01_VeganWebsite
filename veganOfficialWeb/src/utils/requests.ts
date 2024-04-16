import axios from "axios";

const requests = axios.create({
    // 基礎路徑
    baseURL: '/api',
    // 超時時間
    timeout: 5000,
    onDownloadProgress: (progressEvent) => {
    }
});

// 請求攔截器
requests.interceptors.request.use((config) => {
    return config;
})

// 響應攔截器
requests.interceptors.response.use((res) => {
    return res.data;
}, (err) => {
    return Promise.reject(new Error('failed!'));
})

export default requests;