import request from '@/utils/request/requests'
import type * as menuType from './type'

enum API {
    newList_URL = '/menu/newCatalog',
    hotList_URL = '/menu/hotCatalog',
    graphQL = '/graphql'
}

// 首頁菜單圖片
const reqGetNewMenu = (params?: any) => request.get<any, menuType.MenuItem[]>(API.newList_URL, params);
const reqGetHotMenu = (params?: any) => request.get<any, menuType.MenuItem[]>(API.hotList_URL, params);

// 菜單頁
const reqMenu = (params?: any) => request.post<any, menuType.MenuQueryResponse>(API.graphQL, params);


export {
    reqGetHotMenu,
    reqGetNewMenu,
    reqMenu
}