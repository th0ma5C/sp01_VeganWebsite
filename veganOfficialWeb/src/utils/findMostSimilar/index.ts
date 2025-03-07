function jaccardSimilarity(arr1: string[], arr2: string[]) {

    const unionSize = new Set([...arr1, ...arr2]).size;
    const intersectionSize = new Set(
        arr1.filter((item) => arr2.includes(item))
    ).size

    return (intersectionSize / unionSize)
}

function calcSimilarity(arrays: string[][], targetArr: string[]) {
    const map = arrays.map((arr, index) => {
        if (arr === targetArr) return null

        return {
            position: index,
            similarity: jaccardSimilarity(arr, targetArr)
        }
    })

    return map.filter((item) => item != null)
}

function getTopFiveMostSimilarity(arrays: string[][], targetArr: string[]) {
    let map = calcSimilarity(arrays, targetArr) as {
        position: number;
        similarity: number;
    }[];

    map = map.sort((a, b) => {
        return b.similarity - a.similarity
    }).slice(1, 6);

    const result = map.map((item) => {
        return item.position
    })

    return result
}

export default getTopFiveMostSimilarity