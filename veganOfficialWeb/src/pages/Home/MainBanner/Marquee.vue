<template>
    <div class="container">
        <div class="marquee">
            <button class="btn-prev"
                @click="throttleChangeSwiper(0)">&lt;
            </button>
            <button class="btn-next"
                @click="throttleChangeSwiper(1)">&gt;
            </button>
            <transition-group name="swiper" tag="div" ref="div"
                class="swiper" :style="swiperStyle">
                <p v-for="(item, index) in swiper"
                    :key="item.title" :class="[
                        { 'dragging': isDown },
                        {}
                    ]">
                    {{ item.title }}
                </p>
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue';
import { useSwiper } from '@/hooks/useSwiper';

interface SwiperItem {
    title: string;
}

const swiper: Ref<SwiperItem[]> = ref([
    { title: '最新美味上架！立即探索我們最新的素食餐盒和果昔，品嚐獨特的素食美味。' },
    { title: '最新消息、特別優惠、限量商品和精彩活動都在這裡！。' },
    { title: '過敏原報告，查看我們食物過敏警報，確保您點的安心。' },
    { title: 'APP限定好康：下載我們的APP，即刻獲得專屬優惠及最新活動資訊。' },
    { title: '加入會員，享專屬優待！加入我們的會員計畫，即刻享有限定優惠和會員專屬好康。' },
])

// 切換、自動輪播、拖曳
const div = ref(); //拖曳物件之容器
const { throttleChangeSwiper, currentItem, isDown, swiperStyle } = useSwiper(div, swiper, 5000)

// 生命鉤子

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
        max-width: 76rem;
        margin: 0 auto;
        position: relative;
        justify-content: space-between;
        overflow: hidden;

        .btn-prev {
            position: absolute;
            left: 0;
            z-index: 2;
        }

        .btn-next {
            position: absolute;
            right: 0;
            z-index: 2;
        }

        .swiper {
            will-change: transform;
            display: flex;
            position: relative;

            .no {}

            p {
                text-align: center;
                margin: 0;
                min-width: 100%;
                line-height: 3rem;
            }

            p:first-child,
            p:last-child {
                opacity: 0;
            }

            .swiper-move {
                transition: transform 1s ease;
            }

            .dragging {
                transition: none !important;
            }
        }
    }
}
</style>