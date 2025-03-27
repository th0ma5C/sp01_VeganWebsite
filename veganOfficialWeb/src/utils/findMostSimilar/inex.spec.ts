import { describe, it, expect } from 'vitest'
import getTopFiveMostSimilarity from './index'

describe('getTopFiveMostSimilarity', () => {
    it('should return empty array when no other arrays', () => {
        const arr = [['a', 'b']]
        expect(getTopFiveMostSimilarity(arr, ['a', 'b'])).toEqual([])
    })

    it('should return correct top positions', () => {
        const arrays = [
            ['a', 'b', 'c'],
            ['a', 'b'],          // sim = 0.66
            ['a'],               // sim = 0.33
            ['d', 'e', 'f'],     // sim = 0
            ['a', 'b', 'c'],     // sim = 1
            ['a', 'c'],          // sim = 0.66
            ['c'],               // sim = 0.33
        ]

        const target = ['a', 'b', 'c']

        const result = getTopFiveMostSimilarity(arrays, target)
        // 注意：會 slice(1, 6)，代表跳過第一個（應該是 target 本身）

        // 排名應該是 sim 排序後的前五個（不包含自己）
        // 預期 [4 (1), 1 (0.66), 5 (0.66), 2 (0.33), 6 (0.33)]，跳過 0
        expect(result).toEqual([4, 1, 5, 2, 6])
    })
})
