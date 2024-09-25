<template>
    <div class="resultContainer">
        <div class="restart">
            <button @click="retest">重新測驗</button>
        </div>

        <div class="topText">
            <h1>
                {{
                    QNR_result.info.userName
                }}，您的專屬分析完成了！
            </h1>

            <div class="content">
                根據分析結果，推薦以下搭配給您
            </div>
        </div>

        <div class="recommendList">
            <div class="salad">
                <div>
                    1
                </div>
                <div>
                    1
                </div>
                <div>
                    1
                </div>
            </div>
            <div class="salad">
                <div>
                    1
                </div>
                <div>
                    1
                </div>
                <div>
                    1
                </div>
            </div>
        </div>

        <button>
            查看購物車
        </button>
    </div>
</template>

<script setup lang="ts">
/**
 * ?重新整理頁面、數據會消失
 */

import Product_template from '@/components/Product/Product_template.vue';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { useMenuStore } from '@/store/menuStore';
import { isReactive, isRef, onMounted, watch, toRefs, computed, reactive } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';

// questionnaireStore
const questionnaireStore = useQuestionnaireStore();
const { QNR_result, QNR_isDone, localStorageKey } = storeToRefs(questionnaireStore);
// const { info: { userName, gender, birth }, habit, flavor, ingredients, food, calories } = QNR_result.value;


// menuStore
const menuStore = useMenuStore();
const { saladList, smoothieList, isLoaded } = storeToRefs(menuStore);

// 顯示推薦
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

function filterByRepetition(arrays: MenuItem[][]): MenuItem[] {
    const countMap = new Map<MenuItem, number>();

    arrays.flat().forEach(item => {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    });

    return Array.from(countMap).filter(([item, count]) => count > 2).map(([item]) => item);
}

const finalSaladRank = computed(() => {
    const allSaladRanks = [
        genderRank.value[0] || [],
        ageRank.value?.[0] || [],
        habitRank.value?.[0] || [],
        flavorRank.value?.[0] || [],
        ingredientsRank.value?.[0] || [],
        foodRank.value?.[0] || [],
        caloriesRank.value?.[0] || [],
    ];

    return filterByRepetition(allSaladRanks);
});

watch(finalSaladRank, (nv) => {
    console.log(nv);
}, { deep: true })



// 重新測驗
const Router = useRouter();
function retest() {
    QNR_isDone.value = false;
    Router.back();
}

// 生命週期
onMounted(() => {
    // console.log(questionnaireStore.QNR_result.info);
})


</script>

<style scoped lang="scss">
* {
    outline: 1px solid black;
}

.resultContainer {
    @include WnH(100%, calc(100% - 100px));
    background-color: $primaryBacColor;
    position: absolute;
    top: 100px;
    left: 0;
}

.topText {
    margin-top: 3rem;
    text-align: center;
}
</style>