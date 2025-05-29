import axios from 'axios';
import type { AxiosResponse } from 'axios';

const request = axios.create({
    baseURL: 'https://zip5.5432.tw',
});

request.interceptors.response.use((res) => {
    return res.data;
}, (err) => {
    return Promise.reject(err);
})

const api = '/zip5json.py';

interface Res {
    "adrs": string,
    "new_adrs": string,
    "new_adrs2": string,
    "zipcode": string,
    "dataver": string,
    "new_adrs6": string,
    "new_adrs6_2": string,
    "zipcode6": string,
    "dataver6": string
}

const getPostalCode = (params: any) => {
    return request.get<any, Res>(api, { params })
}

export {
    getPostalCode
}