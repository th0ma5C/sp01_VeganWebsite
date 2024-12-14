interface AuthResData {
    message: string,
    state?: string,
    username?: string,
    token?: string,
    isGuest: boolean,
    userID: string | null,
}

export type {
    AuthResData
}