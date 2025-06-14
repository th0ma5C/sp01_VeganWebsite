<template>
    <div class="container">
        <div class="marquee">
            <button class="btn-prev"
                @click="throttleChangeSwiper(0)">
                <SvgIcon name="ButtonLeft" height="24px"
                    width="24px" color="#036313">
                </SvgIcon>
            </button>
            <button class="btn-next"
                @click="throttleChangeSwiper(1)">
                <SvgIcon name="ButtonRight" height="24px"
                    width="24px" color="#036313">
                </SvgIcon>
            </button>
            <div ref="divRef" class="carousel"
                :class="{ 'dragging': isDown }"
                :style="swiperStyle">
                <transition-group name="carousel">
                    <p v-for="({ id, title }) in showSwiper"
                        :key="id"
                        @mouseup="titleOnclick(title)">
                        {{ title }}
                    </p>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useSwiper } from '@/hooks/useSwiper';
import { useRouter } from 'vue-router';

const carousel = [
    { title: '最新美味上架！立即探索我們最新的素食餐盒和果昔，品嚐獨特的素食美味。' },
    { title: '過敏原報告，查看我們食物過敏警報，確保您點的安心。' },
    { title: 'APP限定好康：下載果漾APP，即刻獲得專屬優惠及最新活動資訊。' },
    { title: '加入會員，享專屬優待！加入我們的會員計畫，即刻享有限定優惠和會員專屬好康。' },
]

// 切換、自動輪播、拖曳
const divRef = useTemplateRef('divRef'); //拖曳物件之容器
const { throttleChangeSwiper, showSwiper, isDown, isDrag, swiperStyle } = useSwiper(divRef, carousel, 7500)

// 跳轉
const router = useRouter();

function routeTo(page: string, config?: Record<string, any>) {
    return () => {
        router.push({
            path: page,
            ...config
        });
    }
}

const routeMenu = routeTo('/menu');
const routeAbout = routeTo('/about', {
    query: { scroll: "FAQ" }
});
const routeApp = () => {
    const url = 'https://www.microsoft.com/zh-tw/store/top-free/apps/pc';
    window.open(url, '_blank')?.focus();
}
const routeMember = routeTo('/profile')

function titleOnclick(target: string) {
    if (isDrag.value) return

    switch (target) {
        case carousel[0].title:
            routeMenu();
            break;
        case carousel[1].title:
            routeAbout();
            break;
        case carousel[2].title:
            routeApp()
            break;
        case carousel[3].title:
            routeMember()
            break;

        default:
            break;
    }
}

onMounted(() => {
})

</script>

<style lang="scss" scoped>
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    overflow: hidden;
    max-width: 1920px;
    margin-inline: auto;

    .marquee {
        @include flex-center-center;
        max-width: 100%;
        margin: 0 1rem;
        position: relative;
        justify-content: space-between;
        overflow: hidden;

        button {
            border: none;
            background-color: $primaryBacColor;
            width: 36px;
            height: 100%;
            top: 0;
            transition: scale .15s;

            &:active div {
                translate: 1px 1px;
            }

            &:hover {
                scale: 1.2;
            }
        }

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

        .carousel {
            cursor: pointer;
            max-width: 100%;
            min-height: 3rem;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            will-change: transform;
            transition: transform 1s;

            p {
                display: block;
                text-align: center;
                // text-wrap: nowrap;
                margin: 0;
                width: 100%;
                min-width: 100%;
                padding-inline: 36px;
                overflow: hidden;
                font-variation-settings: 'wght' 400;
            }

            p:first-child,
            p:last-child {
                opacity: 0;
            }

            .carousel-move {
                transition: transform 1s ease;
            }
        }

        .dragging {
            transition: none !important;
        }
    }
}

@include medium {
    .container .marquee {
        .carousel {
            min-height: 2.75rem;

            p {
                font-size: 14px;
            }
        }

        button:active {
            filter: brightness(.95);
        }

        // .btn-prev {
        //     left: 4px;
        // }

        // .btn-next {
        //     right: 4px;
        // }
    }
}

@include small {
    .container .marquee .carousel {
        min-height: 2.5rem;

        p {
            font-size: 12px;
        }
    }
}
</style>