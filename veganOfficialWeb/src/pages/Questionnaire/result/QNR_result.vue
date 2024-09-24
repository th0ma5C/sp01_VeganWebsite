<template>
    <div class="resultContainer">
        <div class="restart">
            <button @click="retest">重新測驗</button>
        </div>

        <div class="topText">
            <h1>
                {{ userName }}，您的專屬分析完成了！
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
import { isReactive, isRef, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

// questionnaireStore
const questionnaireStore = useQuestionnaireStore();
const { QNR_result, QNR_isDone } = storeToRefs(questionnaireStore);
const { info: { userName, gender, birth }, habit, flavor, ingredients, food, calories } = QNR_result.value;
console.log(QNR_result.value);

// menuStore
const menuStore = useMenuStore();
const { saladList, smoothieList } = menuStore;


// 重新測驗
const Router = useRouter();
function retest() {
    QNR_isDone.value = false;
    Router.back();
}

// 生命週期
onMounted(() => {
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