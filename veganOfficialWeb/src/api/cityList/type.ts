interface TownResponse {
    STATUS: number,
    MESSAGE: string | null,
    RETURNROWS: number,
    RESPONSE: [{
        CITY: string,
        TOWN: [{
            "UNIT": string,
            "CODE": string,
            "NAME": string
        }]
    }]
}

export type {
    TownResponse
}