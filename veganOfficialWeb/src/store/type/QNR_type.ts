type Birth = [number | null, number | null, number | null];
interface Info {
    userName: string;
    gender: string;
    birth: Birth;
}
interface Form {
    info: Info,
    habit: null | string,
    flavor: null | string,
    ingredients: string[],
    food: string[],
    calories: null | string
}

export type {
    Birth,
    Info,
    Form
}