<template>
    <div class="tabContainer">
        <div class="btnContainer">
            <button @click="changeTab(1)">新品</button>
            <button @click="changeTab(2)">熱銷</button>
            <button @click="changeTab(3)">專屬分析</button>
        </div>
        <div class="tabs">
            <div class="tab" v-show="show == 1">
                111
            </div>
            <div class="tab" v-show="show == 2">
                222
            </div>
            <div class="tab" v-show="show == 3">
                333
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 分頁動畫完成、swiper導入、icon?
 */
import { ref } from 'vue';

let show = ref(1)
function changeTab(n: number) {
    show.value = n;
}

</script>

<style scoped lang="scss">
.tabContainer {
    @include flex-center-center;
    @include main-part;

    align-items: normal;
    flex-direction: column;

    .btnContainer {

        button {
            background-color: transparent;
            border-bottom: none;
        }
    }

    .tabs {
        border: 1px solid black;
    }
}
</style>