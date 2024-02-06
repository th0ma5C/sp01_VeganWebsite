<template>
    <div class="container">
        <div class="marquee">
            <button class="btn-prev"
                @click="throttleChangeSwiper(0)">&lt;</button>
            <button class="btn-next"
                @click="throttleChangeSwiper(1)">&gt;</button>
            <transition-group name="swiper" tag="div"
                class="swiper" @mousedown="down"
                @mousemove="move" @mouseup="up"
                :style="{ transform: `translateX(-${left}%)` }">
                <p v-for="(item) in swiper" :key="item.title">
                    {{ item.title }} </p>
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import throttle from 'lodash/throttle';
import type { Ref } from 'vue'

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

// 點擊
let left = computed(() => (Math.floor((swiper.value.length) / 2)) * 100);
let clicking = true;

function changeSwiper(n: number) {
    if (clicking) {
        clicking = false
        if (n) {
            swiper.value.push(swiper.value.shift()!);
        } else {
            swiper.value.unshift(swiper.value.pop()!);
        }
        setTimeout(() => {
            clicking = true;
        }, 1000)
    }
}
const throttleChangeSwiper = throttle(changeSwiper, 1000);

// 自動輪播
function autoPlay() {
    return setInterval(() => {
        throttleChangeSwiper(1);
    }, 5000)
}

let interval = autoPlay();

function stopPlay() {
    clearInterval(interval)
}

// 拖曳
let isDown = false

function down(e) {
    stopPlay();
    isDown = true;
    console.log(e.clientX);

}

function move(e) {
    if (isDown) {
    }
}

function up() {
    autoPlay()
}

// 生命鉤子
onUnmounted(() => {
    stopPlay()
})

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
            will-change: transform;
            display: flex;

            p {
                text-align: center;
                margin: 0;
                min-width: 100%;
            }

            p:first-child,
            p:last-child {
                opacity: 0;
            }

            .swiper-move {
                transition: transform 1s ease;
            }

        }
    }
}
</style>