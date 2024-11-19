export default function (arr: string[], folder: string) {
    return arr.map(item => new URL(`/src/assets/img/${folder}/${item}`, import.meta.url).href)
}