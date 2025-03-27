interface Questionnaire {
    question: string | null,
    options: string[] | [],
    tag: string
}

interface Node {
    tag?: string,
    content?: string,
}

interface GPT_RES {
    result: Node[]
}

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
        calories: string,
        createdAt: string
    }
}

export type { Questionnaire, Node, GPT_RES, SurveyResponse }