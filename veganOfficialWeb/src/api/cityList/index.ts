import axios from 'axios';
import type { TownResponse } from './type'

const request = axios.create({
    baseURL: 'https://openapi.land.moi.gov.tw/WEBAPI/LandQuery',
});

request.interceptors.response.use((res) => {
    return res.data;
}, (err) => {
    return Promise.reject(err);
})

enum API {
    queryCity = '/QueryCity',
    queryTown = '/QueryTown',
}

interface QueryParams {
    "CITY": string | null
}

const cityParm = {
    "CITY": null
}

const getCityList = (params: QueryParams = cityParm) => request.post(API.queryCity, params);
const getTownList = (params: string) => request.post<string, TownResponse>(API.queryTown, params);

export {
    type QueryParams,
    getCityList,
    getTownList
}