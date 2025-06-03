import request from '@/utils/request/requests';
import type * as resType from './type';

// interface SurveyResponse {
//     result: {
//         info: {
//             userName: string,
//             gender: string,
//             birth: [number, number, number],
//         },
//         habit: string,
//         flavor: string,
//         ingredients: string[],
//         food: string[],
//         calories: string,
//         createdAt: string
//     }
// }

// interface Node {
//     tag?: string,
//     content?: string,
// }

// interface GPT_RES {
//     result: Node[]
// }

const reqGetQuestionnaire = (params?: any) => request.get<any, resType.Questionnaire[]>('/questionnaire/getQuestionnaire', params);

// member save survey result
const reqSaveSurveyResult = (result: any, token?: string, params: string = '') => {
    return request.post(`/questionnaire/saveResult/${params}`, {
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
const reqGetSavedResult = (params: string, token?: string,) => {
    return request.get<any, resType.SurveyResponse>(`/questionnaire/result/${params}`, {
        headers: {
            Authorization: token
        }
    })
}

// get GPT response
const getGPTAnalyze = (params: any) => {
    return request.post<any, resType.GPT_RES>('/questionnaire/gpt-analyze', {
        surveyResult: { ...params }
    })
}

// member reset survey result
const resetSurveyResult = (userId: string) => {
    return request.delete(`/questionnaire/result/${userId}`)
}

export {
    reqGetQuestionnaire,
    reqSaveSurveyResult,
    reqGetSavedResult,
    getGPTAnalyze,
    resetSurveyResult
}