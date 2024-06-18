import request from '@/utils/request/requests'
import type { NewsRes } from './type'

// 首頁新聞列表
export const reqNewsList = (params?: any) => request.get<any, NewsRes>('/api/news/newsList', { params });