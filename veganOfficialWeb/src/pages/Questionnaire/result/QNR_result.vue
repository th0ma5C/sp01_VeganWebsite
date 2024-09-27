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

            <div class="gptRes">
                <div class="content">
                    <h2>營養建議</h2>
                    <p>鷹村先生，根據您選擇的完全素食飲食習慣、清爽的口味偏好，以及Omega-3、抗氧化物、維生素的需求，我們為您提供以下建議：
                    </p>
                    <h2>營養分析</h2>
                    <ul>
                        <li><strong>Omega-3：</strong>由於完全素食者無法從魚類中攝取Omega-3，建議您多攝取亞麻籽、奇亞籽和南瓜籽這類植物來源的Omega-3脂肪酸，對心血管健康非常有益。
                        </li>
                        <li><strong>抗氧化物：</strong>抗氧化物可以幫助對抗自由基，減少身體氧化壓力。莓果類如藍莓、草莓以及深綠色蔬菜如菠菜，都是豐富的抗氧化物來源。
                        </li>
                        <li><strong>維生素：</strong>對於維生素，尤其是維生素C和維生素E，可多攝取富含這些維生素的食材如橙子、奇異果、酪梨等，來促進免疫力及皮膚健康。
                        </li>
                    </ul>
                    <h2>食材推薦</h2>
                    <ul>
                        <li><strong>Omega-3
                                來源：</strong>亞麻籽、奇亞籽、南瓜籽</li>
                        <li><strong>抗氧化物來源：</strong>藍莓、草莓、菠菜
                        </li>
                        <li><strong>維生素來源：</strong>橙子、奇異果、酪梨
                        </li>
                    </ul>
                    <h2>每日卡路里建議</h2>
                    <p>根據您的每日卡路里需求（1800卡），建議選擇低卡且富含營養的食材，並適當控制油脂和糖分的攝取。多食用蔬果及全穀類食材，以達到均衡飲食的效果。
                    </p>
                </div>
            </div>

            <div class="guideContent">
                根據分析結果，推薦以下搭配給您~
            </div>
        </div>

        <div class="recommendList">
            <div class="salad" ref="saladContainer" :style="{
                opacity: showSaladContainer ? 1 : 0
            }">
                <transition-group name="listSlideUp">
                    <Product_template
                        v-for="(item, index) in saladRank"
                        :key="index" :item="item" :style="{
                            transitionDelay: index * 150 + 'ms',
                        }"
                        v-show="rankComplete && showSaladContainer">
                    </Product_template>
                </transition-group>
            </div>

            <div class="smoothies" ref="smoothiesContainer"
                :style="{
                    opacity: showSmoothiesContainer ? 1 : 0
                }">
                <transition-group name="listSlideUp">
                    <Product_template
                        v-for="(item, index) in smoothiesRank"
                        :key="index" :item="item" :style="{
                            transitionDelay: index * 150 + 'ms',
                        }"
                        v-show="rankComplete && showSmoothiesContainer">
                    </Product_template>
                </transition-group>
            </div>
        </div>

        <button class="viewCart">
            查看購物車
        </button>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 結果頁面樣式 完成表單功能 會員 購物車 關於
 * doing 數據太多或太少的情況
 * ?重新整理頁面、數據會消失
 * ?結果本地儲存
 */

import Product_template from '@/components/Product/Product_template.vue';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { useMenuStore } from '@/store/menuStore';
import { ref, onMounted, watch, computed, reactive, nextTick } from 'vue';
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
// watch(saladList, (nVal) => {
//     console.log(nVal);
// }, { immediate: true, deep: true })
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


function findRecommend(arrays: MenuItem[][]): MenuItem[] {
    const countMap = new Map<MenuItem, number>();
    const threshold = 1;

    arrays.flat().forEach(item => {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    });

    function getResult() {
        return Array.from(countMap).filter(([item, count]) => count > threshold);
    }

    const result = getResult();
    // console.log(result.length);

    return Array.from(countMap).filter(([item, count]) => count > 3).map(([item]) => item);
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

const rankComplete = ref(false);
watch([saladRank, smoothiesRank], (nVal) => {
    // console.log(nVal);
    if (nVal.every(item => item.length > 1)) {
        rankComplete.value = true;
    }
}, { immediate: true })

// 顯示動畫
const saladContainer = ref<null | HTMLDivElement>(null);
const smoothiesContainer = ref<null | HTMLDivElement>(null);
const showSaladContainer = ref(false);
const showSmoothiesContainer = ref(false);

function observer(target: HTMLElement, options?: IntersectionObserverInit) {
    function observerCb(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
        console.log(entries);
        entries.forEach((item) => {
            // console.dir(window.getComputedStyle(item.target).transitionDelay);
            if (item.boundingClientRect.height == 0 || !item.isIntersecting) return
            if (item.target.classList.contains('salad')) {
                showSaladContainer.value = true;
            } else if (item.target.classList.contains('smoothies')) {
                showSmoothiesContainer.value = true;
            }
        })
    }

    const observer = new IntersectionObserver(observerCb, options);

    observer.observe(target)
}

// function setObserver() {
//     if (!saladContainer.value || !smoothiesContainer.value) return

//     const options = (position?: number) => ({
//         root: null,
//         rootMargin: "0px 0px 0px 0px",
//         threshold: 0.3,
//     })
//     observer(saladContainer.value, options());

//     observer(smoothiesContainer.value, options());
// }

watch([saladContainer, smoothiesContainer], ([nVal1, nVal2]) => {
    if (!nVal1 || !nVal2) return
    const options = (position?: number) => ({
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0.3,
    })
    observer(nVal1, options());

    observer(nVal2, options());
})
// watch([saladRank, foo], (nVal) => {
//     console.log(rankComplete.value);
//     console.log(nVal);
// }, { immediate: true })


// 重新測驗
const Router = useRouter();
function retest() {
    QNR_isDone.value = false;
    Router.back();
}

// 打字效果


// 生命週期
onMounted(() => {
    // console.log(questionnaireStore.QNR_result.info);
    // setObserver();
})


</script>

<style scoped lang="scss">
* {
    outline: 1px solid black;
}

.resultContainer {
    // @include WnH(100%, calc(100% - 100px));
    width: 100%;
    background-color: $primaryBacColor;
    position: absolute;
    top: 100px;
    left: 0;
    // text-align: center;
}

.restart {
    @include WnH(4rem, 24px);
    user-select: none;
    cursor: pointer;
    text-align: center;
    opacity: .5;
    transition: opacity .2s ease;
    margin-left: 1rem;

    &:hover {
        opacity: 1;
    }
}


.topText {
    margin-top: 3rem;
    text-align: center;

    h1 {
        font-size: 2rem;
        font-weight: 600;
    }

    .gptRes {
        border: 1px solid black;
        border-radius: 1rem;
        background-color: white;
        width: 60%;
        margin: 2rem auto;
        padding: 1rem;
    }

    .content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: start;
        gap: .5rem;

        h2 {
            font-size: 1.25rem;
            font-weight: 450;
        }

        p {
            padding-left: 2.5rem;
            font-variation-settings: 'wght' 450;
        }

        li {
            padding-left: 2.5rem;
            font-variation-settings: 'wght' 450;
        }
    }

    .guideContent {
        margin-top: 1rem;
        font-size: 1.5rem;
        font-variation-settings: 'wght' 500;
    }
}

@keyframes slideUp {
    from {
        opacity: .5;
        transform: translateY(10%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.recommendList {
    &>div {
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-top: 3rem;
    }
}

.salad {}

.viewCart {}

.listSlideUp-enter-active,
.listSlideUp-leave-active {
    transition: transform .3s ease, opacity .3s ease;
}

.listSlideUp-enter-from,
.listSlideUp-leave-to {
    opacity: 0;
    transform: translateY(10%);
}

.listSlideUp-enter-to,
.listSlideUp-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>