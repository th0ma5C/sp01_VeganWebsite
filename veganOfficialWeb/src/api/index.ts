import Request from '@/utils/requests'

export const reqGetMenu = (data?: any) => Request.get('/api/menu/newCatalog', data)