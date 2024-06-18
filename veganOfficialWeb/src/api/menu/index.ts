import request from '@/utils/request/requests'
import type { MenuRes } from './type'

// 首頁菜單圖片
export const reqGetNewMenu = (params?: any) => request.get<any, MenuRes>('/api/menu/newCatalog', { params });
export const reqGetHotMenu = (params?: any) => request.get<any, MenuRes>('/api/menu/hotCatalog', { params });