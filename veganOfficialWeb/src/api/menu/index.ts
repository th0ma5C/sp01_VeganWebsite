import request from '@/utils/request/requests'
import type { MenuRes } from './type'

enum API {
    newList_URL = '/api/menu/newCatalog',
    hotList_URL = '/api/menu/hotCatalog',
    graphQL = '/api/graphql'
}

// 首頁菜單圖片
export const reqGetNewMenu = (params?: any) => request.get<any, MenuRes>(API.newList_URL, params);
export const reqGetHotMenu = (params?: any) => request.get<any, MenuRes>(API.hotList_URL, params);

// 菜單頁
export const reqMenu = (params?: any) => request.post<any, MenuRes>(API.graphQL, params);
// export const reqMenu = async ({ query, variables = {} }) => {
//     try {
//         const response = await request.post(API.graphQL, {
//             query,
//             variables,
//         });
//         // console.log(response);
//         if (response.data.errors) {
//             throw new Error(response.data.errors.map(error => error.message).join(', '));
//         }
//         return response.data.data;
//     } catch (error) {
//         console.error('Error fetching menu:', error);
//         throw error;
//     }
// };