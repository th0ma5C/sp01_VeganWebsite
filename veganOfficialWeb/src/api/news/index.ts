import request from '@/utils/request/requests'
import type * as newsType from './type'

// 首頁新聞列表
export const reqNewsList = (params?: any) => request.get<any, newsType.NewsRes>('/api/news/newsList', { params });