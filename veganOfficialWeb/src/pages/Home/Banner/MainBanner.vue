<template>
    <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }" :autoplay="{
            delay: 7750,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }" preventInteractionOnTransition="true"
        pagination-dynamic-bullets="true" :speed="1000"
        class="mainBanner" @swipertouchmove="swiperOndrag"
        @swipertouchend="swiperEndDrag" ref="swiperRef">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <div @click="titleOnclick(img.title)">
                <div>
                    <div class="title"
                        data-swiper-parallax="-500">
                        <h1>{{ img.title }}</h1>
                        <p>{{ img.text }}</p>
                    </div>
                </div>
                <div class="text" data-swiper-parallax="0">
                    <img rel="preload"
                        :src="genImgUrl(img.url)" alt="">
                </div>
            </div>
        </swiper-slide>
    </swiper-container>
</template>
<script lang="ts" setup>
import { useToastStore } from '@/store/toastStore';
import { debounce } from 'lodash-es';
import type { SwiperContainer } from 'swiper/element';
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';


const imgs = ref([
    {
        url: '1',
        title: '專屬分析',
        text: '快來看看屬於你的餐盒與果昔的搭配'
    },
    {
        url: '2',
        title: '新餐盒上市',
        text: '查看夏季新上市的餐盒與果昔'
    },
    {
        url: '3',
        title: '最新鮮的本地蔬食',
        text: '完整的食材履歷，讓您安心享用'
    },
    {
        url: '4',
        title: '好友分享拿優惠',
        text: '輸入好友推薦碼拿300元優惠券'
    },
    {
        url: '5',
        title: '專屬APP',
        text: '下載我們的APP，一鍵下單更方便'
    },
])

function genImgUrl(source: string) {
    return new URL(`/src/assets/img/MainBanner/${source}.webp`, import.meta.url).href
}

// store
const toastStore = useToastStore();


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

const routeAnalyst = routeTo('/questionnaire');
const routeMenu = routeTo('/menu');
const routeAbout = routeTo('/about', {
    query: { scroll: "FAQ" }
});
const routeShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toastStore.addNotification('已複製邀請連結');
}
const routeApp = () => {
    const url = 'https://www.microsoft.com/zh-tw/store/top-free/apps/pc';
    window.open(url, '_blank')?.focus();
}

const isDrag = ref(false);
function swiperOndrag() {
    if (!isDrag.value) isDrag.value = true
}
function swiperEndDrag() {
    if (isDrag.value) isDrag.value = false
}

function titleOnclick(target: string) {
    if (isDrag.value) {
        isDrag.value = false;
        return
    }
    switch (target) {
        case imgs.value[0].title:
            routeAnalyst()
            break;
        case imgs.value[1].title:
            routeMenu()
            break;
        case imgs.value[2].title:
            routeAbout()
            break;
        case imgs.value[3].title:
            routeShare()
            break;
        case imgs.value[4].title:
            routeApp()
            break;
        default:
            break;
    }
}

const swiperRef = useTemplateRef<SwiperContainer>('swiperRef');
const swiperOnresize = debounce(() => {
    if (swiperRef.value) {
        nextTick(() => {
            swiperRef.value?.swiper.update();
        })
    }
}, 500)

onMounted(() => {
    window.addEventListener('resize', swiperOnresize)
})

onUnmounted(() => {
    window.removeEventListener('resize', swiperOnresize)
})

</script>
<style lang="scss" scoped>
.mainBanner {
    padding: 0 1rem;
    margin: 0 auto;
    max-width: $primaryWidth;
    // height: 872px;
}

.title {
    z-index: 2;
    color: $primaryBacColor;
    position: absolute;
    top: 5%;
    left: 3%;
    border-radius: 1rem;
    padding: .25rem .5rem;
    max-width: 100%;

    h1 {
        font-size: 4rem;
        font-variation-settings: 'wght' 700;
        text-shadow:
            -1px -1px 0px $secondBacColor,
            -2px -1px 0px $secondBacColor,
            -3px -2px 0px $secondBacColor,
            -4px -2px 0px $secondBacColor,
            -5px -2px 1px $secondBacColor,
            -6px -2px 2px black;
    }

    p {
        font-size: 1.25rem;
        font-variation-settings: 'wght' 500;
        text-shadow:
            -1px -1px 0px $secondBacColor,
            -2px -1px 0px $secondBacColor,
            -3px -2px 1px $secondBacColor,
            -4px -2px 2px black;
    }
}

.text {
    cursor: pointer;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

swiper-container {
    swiper-slide {
        overflow: hidden;
    }

    &::part(bullet) {}

    &::part(bullet-active) {
        background-color: #FCFAF2;
        width: 10px;
        height: 10px;
    }
}

.swiper-pagination-bullet {
    width: 4px;
    height: 4px;
}

@include XLarge {
    .title {

        h1 {
            font-size: 5rem;
        }

        p {
            font-size: 2rem;
        }
    }
}

@include large {
    .title {

        h1 {
            font-size: 3.5rem;
        }

        p {
            // font-size: 1.75rem;
        }
    }
}

@include medium {

    swiper-container {
        &::part(bullet-active) {
            background-color: #FCFAF2;
            width: 8px;
            height: 8px;
        }
    }

    .title {

        h1 {
            font-size: 3rem;
        }

        p {
            font-size: 1rem;
        }
    }
}

@include small {
    swiper-container {
        &::part(bullet-active) {
            background-color: #FCFAF2;
            width: 6px;
            height: 6px;
        }
    }

    .title {
        top: 5%;
        left: 0%;

        h1 {
            font-size: 2.5rem;
        }

        p {
            // font-size: .75rem;
        }
    }

    .text img {
        object-fit: cover;
        object-position: center;
        max-width: none;
        max-height: 40vh;
        max-height: max(40vh, 60vw);
    }
}

@include small($width: 430px) {

    .title {
        left: -2%;

        h1 {
            // font-size: 1.5rem;
        }

        p {
            // font-size: .5rem;
        }
    }
}

@include small($width: 320px) {

    .title {
        top: 4%;
        left: -4%;

        h1 {
            // font-size: 1.25rem;
        }

        p {
            // font-size: .5rem;
        }
    }
}
</style>