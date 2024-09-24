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
import { isReactive, isRef, onMounted, watch, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

// questionnaireStore
const questionnaireStore = useQuestionnaireStore();
const { QNR_result, QNR_isDone, localStorageKey } = storeToRefs(questionnaireStore);
// const { info: { userName, gender, birth }, habit, flavor, ingredients, food, calories } = QNR_result.value;


// menuStore
const menuStore = useMenuStore();
const { saladList, smoothieList } = storeToRefs(menuStore);

// 顯示推薦
const genderRank = computed(() => {
    const gender = new RegExp(`^${QNR_result.value.info.gender}`, 'g');

    const saladRank = saladList.value.filter((item) => {
        return item.tags.some((item) => gender.test(item))
    })

    const smoothiesRank = smoothieList.value.filter((item) => {
        return item.tags.some((item) => gender.test(item))
    })

    return [saladRank, smoothiesRank]
});
const ageRank = computed(() => {
    if (saladList.value.length == 1 || smoothieList.value.length == 1) return;

    const age = new Date().getFullYear() - QNR_result.value.info.birth[0]!;

    const saladRank = saladList.value.filter((item) => {
        const scope = item.tags[1].split('-');
        return age >= Number(scope[0]) && age <= Number(scope[1])
    })

    const smoothiesRank = smoothieList.value.filter((item) => {
        const scope = item.tags[1].split('-');
        return age >= Number(scope[0]) && age <= Number(scope[1])
    })

    return [saladRank, smoothiesRank]
});
const habitRank = computed(() => {
    if (!QNR_result.value.habit) return;

    const habit = QNR_result.value.habit;

    const saladRank = saladList.value.filter((item) => {
        return item.tags.includes(habit)
    })

    const smoothiesRank = smoothieList.value.filter((item) => {
        return item.tags.includes(habit)
    })

    return [saladRank, smoothiesRank]
});
const flavorRank = computed(() => {
    if (!QNR_result.value.flavor) return;

    const flavor = QNR_result.value.flavor;

    const saladRank = saladList.value.filter((item) => {
        return item.tags.includes(flavor)
    })

    const smoothiesRank = smoothieList.value.filter((item) => {
        return item.tags.includes(flavor)
    })

    return [saladRank, smoothiesRank]
});
function cal_Similarity(targetArr: string[], DBarr: string[]) {
    const targetArrSet = new Set(targetArr);
    const DBarrSet = new Set(DBarr);
    let similarity = 0;
    targetArrSet.forEach((item) => {
        if (DBarrSet.has(item)) {
            similarity++
        }
    })
    return similarity
}
function sortSimilarity(targetArr: string[], DBarr: string[]) {
    return targetArr.map((item) => {
        return {
            item,
            score: cal_Similarity(targetArr, DBarr)
        }
    }).sort((a, b) => a.score - b.score).map((item) => item.item)
}

// const ingredientsRank = computed(() => {
//     if (!QNR_result.value.ingredients) return;

//     const ingredients = QNR_result.value.ingredients;

//     const saladRank = saladList.value.filter((item) => {
//         ingredients.forEach((params) => {

//         })
//     })

//     const smoothiesRank = smoothieList.value.filter((item) => {
//     })

//     return [saladRank, smoothiesRank]
// });



const showSalad = computed(() => {
    return habitRank.value
})

watch(showSalad, (nv) => {
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