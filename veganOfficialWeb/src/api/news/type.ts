
interface NewsItem {
    date: Date,
    title: string,
    content: string,
    label: string,
}
type NewsRes = NewsItem[];

export type {
    NewsItem,
    NewsRes,
};