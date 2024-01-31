<template>
    <div class="container">
        <div class="marquee">
            <button class="btn-prev">&lt;</button>
            <button class="btn-next" @click="next">&gt;</button>
            <div class="swiper" :style="{ left: left }"
                ref="slide">
                <p v-for="(item, index) in swiper" :key="index">
                    {{ item.title }} </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const swiper = [
    { title: '最新美味上架！立即探索我們最新的素食餐盒和果昔，品嚐獨特的素食美味。' },
    { title: '最新消息、特別優惠、限量商品和精彩活動都在這裡！。' },
    { title: '過敏原報告，查看我們食物過敏警報，確保您點的安心。' },
    { title: 'APP限定好康：下載我們的APP，即刻獲得專屬優惠及最新活動資訊。' },
    { title: '加入會員，享專屬優待！加入我們的會員計畫，即刻享有限定優惠和會員專屬好康。' },
]

let left = ref(0)
let slide = ref()
function next() {
    console.log(slide.value.offsetWidth);
}


</script>

<style lang="scss" scoped>
.container {

    &::before {
        content: '';
        display: block;
        height: 107px;
        width: 100%;
    }

    .marquee {
        @include flex-center-center;
        @include main-part;

        position: relative;
        justify-content: space-between;
        overflow: hidden;

        .btn-prev {
            position: absolute;
            left: 6rem;
            z-index: 2;
        }

        .btn-next {
            position: absolute;
            right: 6rem;
            z-index: 2;
        }

        .swiper {
            display: flex;
            position: relative;

            p {
                text-align: center;
                margin: 0;
                min-width: 100%;
            }
        }
    }
}
</style>