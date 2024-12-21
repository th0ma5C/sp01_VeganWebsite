import request from '@/utils/request/requests';
import type * as resType from './type';
import mockResponse from '@/mock/data/GPT_response/GPT_res.json'

interface SurveyResponse {
    result: {
        info: {
            userName: string,
            gender: string,
            birth: [number, number, number],
        },
        habit: string,
        flavor: string,
        ingredients: string[],
        food: string[],
        calories: string
    }
}

const reqGetQuestionnaire = (params?: any) => request.get<any, resType.Questionnaire[]>('/api/questionnaire/getQuestionnaire', params);

// member save survey result
const reqSaveSurveyResult = (result: any, token?: string) => {
    return request.post('/api/questionnaire/saveResult', {
        data: {
            result
        }
    }, {
        headers: {
            Authorization: token
        },
    })
}

// member get saved survey result
const reqGetSavedResult = (token?: string) => {
    return request.get<any, SurveyResponse>('/api/questionnaire/result', {
        headers: {
            Authorization: token
        }
    })
}

// get GPT response
const getGPTAnalyze = () => {
    return mockResponse
}

export {
    reqGetQuestionnaire,
    reqSaveSurveyResult,
    reqGetSavedResult,
    getGPTAnalyze
}