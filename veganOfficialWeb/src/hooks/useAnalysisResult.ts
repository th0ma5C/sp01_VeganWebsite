import { ref, onMounted, watch, computed, reactive, nextTick, onBeforeMount, watchEffect, useTemplateRef, toValue } from 'vue';
import type { Ref } from 'vue';
import { useMenuStore } from '@/store/menuStore';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';
import type { Form } from '@/store/type/QNR_type'

export function useAnalysisResult(QNR_result: Ref<Form>, threshold: number = 1, showAmount: number = 6) {
    // menuStore
    const menuStore = useMenuStore();
    const { saladList, smoothieList, isLoaded } = storeToRefs(menuStore);

    function filterByTag(
        catalog: 'salad' | 'smoothies',
        tagIndex: number | null,
        condition: (tag: string | string[]) => boolean) {
        const list = catalog == 'salad' ? saladList.value : smoothieList.value;
        if (tagIndex) {
            return list.filter(item => condition(item.tags[tagIndex]));
        }
        return list.filter(item => condition(item.tags));
    }

    function calc_similarity(target: string[], origin: string[]): number {
        let count = 0;
        origin.forEach((item) => {
            if (target.includes(item)) {
                count++
            }
        })
        return count
    }

    function rank_similarity(target: string[],
        originObj: Ref<MenuItem[]>
    ): MenuItem[] {
        return originObj.value.map((item) => {
            return {
                array: item,
                rank: calc_similarity(target, item.ingredients)
            }
        }).sort((a, b) => {
            return b.rank - a.rank
        }).map((item) => item.array)
    }

    const genderRank = computed(() => {
        const gender = new RegExp(`^${QNR_result.value.info.gender}`, 'g');

        const saladRank = filterByTag('salad', 0, tag => gender.test(tag as string));
        const smoothiesRank = filterByTag('smoothies', 0, tag => gender.test(tag as string));

        return [saladRank, smoothiesRank]
    });

    const ageRank = computed(() => {
        if (!isLoaded.value) return [];

        const age = new Date().getFullYear() - QNR_result.value.info.birth[0]!;

        const saladRank = filterByTag('salad', 1, tag => {
            const scope = (tag as string).split('-');
            return age >= Number(scope[0]) && age <= Number(scope[1]);
        });
        const smoothiesRank = filterByTag('smoothies', 1, tag => {
            const scope = (tag as string).split('-');
            return age >= Number(scope[0]) && age <= Number(scope[1]);
        });

        return [saladRank, smoothiesRank]
    });

    const habitRank = computed(() => {
        if (!QNR_result.value.habit) return []

        const habit = QNR_result.value.habit;

        const saladRank = filterByTag('salad', null, tag => tag.includes(habit));
        const smoothiesRank = filterByTag('smoothies', null, tag => tag.includes(habit));

        return [saladRank, smoothiesRank]
    });

    const flavorRank = computed(() => {
        if (!QNR_result.value.flavor) return []

        const flavor = QNR_result.value.flavor;

        const saladRank = filterByTag('salad', null, tag => tag.includes(flavor));
        const smoothiesRank = filterByTag('smoothies', null, tag => tag.includes(flavor));

        return [saladRank, smoothiesRank]
    });


    const ingredientsRank = computed(() => {
        if (!QNR_result.value.ingredients) return []

        const ingredients = QNR_result.value.ingredients;

        const saladRank = rank_similarity(ingredients, saladList).slice(0, 5);
        const smoothiesRank = rank_similarity(ingredients, smoothieList).slice(0, 5);

        return [saladRank, smoothiesRank]
    });

    const foodRank = computed(() => {
        if (!QNR_result.value.food) return []

        const food = QNR_result.value.food;

        const saladRank = saladList.value.filter((item) => {
            if (item.main) return food.includes(item.main)
        })
        const smoothiesRank = smoothieList.value.filter((item) => {
            if (item.main) return food.includes(item.main)
        })

        return [saladRank, smoothiesRank]
    });

    const caloriesRank = computed(() => {
        if (!QNR_result.value.calories || !isLoaded.value) return []

        const numReg = /\D/g;
        const calories = QNR_result.value.calories?.replace(numReg, '');

        const saladRank = filterByTag('salad', 4, tag => {
            const funnel = (tag as string).replace(numReg, '');
            return calories >= funnel
        })
        const smoothiesRank = filterByTag('smoothies', 4, tag => {
            const funnel = (tag as string).replace(numReg, '');
            return calories >= funnel
        })

        return [saladRank, smoothiesRank]
    });


    function findRecommend(arrays: MenuItem[][]): MenuItem[] {
        const countMap = new Map<MenuItem, number>();

        arrays.flat().forEach(item => {
            if (!item) return
            countMap.set(item, (countMap.get(item) || 0) + 1);
        });

        function getResult() {
            const list = Array.from(countMap)
                .filter(([item, count]) => count > threshold)
                .sort((a, b) => b[1] - a[1]);

            if (list.length > 0 && list.length < showAmount) {
                threshold--;
                return getResult();
            }

            if (list.length > showAmount) return list.slice(0, showAmount);

            return list.slice(0);
        }

        let result = getResult();

        return result.map(([item]) => item);
    }

    const saladRank = computed(() => {
        if (!isLoaded.value) return [...saladList.value]

        const allSaladRanks = [
            genderRank.value[0],
            ageRank.value[0],
            habitRank.value[0],
            flavorRank.value[0],
            ingredientsRank.value[0],
            foodRank.value[0],
            caloriesRank.value[0],
        ];
        return findRecommend(allSaladRanks);
    });

    const smoothiesRank = computed(() => {
        if (!isLoaded.value) return [...smoothieList.value]

        const allSmoothiesRanks = [
            genderRank.value[1],
            ageRank.value[1],
            habitRank.value[1],
            flavorRank.value[1],
            ingredientsRank.value[1],
            foodRank.value[1],
            caloriesRank.value[1],
        ];

        return findRecommend(allSmoothiesRanks);
    });

    return {
        saladRank,
        smoothiesRank
    }
}
