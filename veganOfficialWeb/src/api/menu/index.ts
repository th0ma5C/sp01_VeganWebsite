import request from '@/utils/request/requests'
import type { MenuRes } from './type'

export const reqGetNewMenu = (params?: any) => request.get<any, MenuRes>('/api/menu/newCatalog', { params });
export const reqGetHotMenu = (params?: any) => request.get<any, MenuRes>('/api/menu/hotCatalog', { params });