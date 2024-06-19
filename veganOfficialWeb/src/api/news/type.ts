export interface NewsItem {
    date: Date;
    title: string;
    content: string;
    label: string;
}

export type NewsRes = NewsItem[];
