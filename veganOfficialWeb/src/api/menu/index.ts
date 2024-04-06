import mockRequest from '@/utils/mockRequests'

export const reqGetMenu = (data: any) => mockRequest.get('/api/home', data)