import request from '@/utils/request/requests';
import type * as resType from './type';

const reqGetQuestionnaire = (params?: any) => request.get<any, resType.Questionnaire[]>('/api/questionnaire', params);

export {
    reqGetQuestionnaire,
}