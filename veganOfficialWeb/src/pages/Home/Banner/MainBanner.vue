<template>
    <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        pagination-dynamic-bullets="true" :speed="1000"
        :centeredSlides="true" :autoplay="{
            delay: 7750,
            disableOnInteraction: false,
        }" :injectStyles="injectStyles" class="mainBanner"
        @swipertouchmove="swiperOndrag"
        @swipertouchend="swiperEndDrag">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <div class="swiper-wrapper"
                @click="titleOnclick(img.title)">
                <div class="swiper-slide">
                    <div class="title"
                        data-swiper-parallax="-500">
                        <h1>{{ img.title }}</h1>
                        <p>{{ img.text }}</p>
                    </div>
                </div>
                <div class="text" data-swiper-parallax="0">
                    <a href="" @click.prevent>
                        <img :src="`/imgs/MainBanner/${img.url}.jpg`"
                            alt="">
                    </a>
                </div>
            </div>
        </swiper-slide>
    </swiper-container>
</template>
<script lang="ts" setup>
import { useToastStore } from '@/store/toastStore';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';


const imgs = [
    {
        url: '1',
        title: '專屬分析',
        text: '快來看看屬於你的餐盒與果席的搭配'
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
];
let injectStyles = [
    `
    :host{
        --swiper-pagination-bullet-width: 10px;
        --swiper-pagination-bullet-height: 10px;
        --swiper-pagination-color: #FCFAF2;    
    }
    `
];

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
        case imgs[0].title:
            routeAnalyst()
            break;
        case imgs[1].title:
            routeMenu()
            break;
        case imgs[2].title:
            routeAbout()
            break;
        case imgs[3].title:
            routeShare()
            break;
        case imgs[4].title:
            routeApp()
            break;
        default:
            break;
    }
}

const slideRef = useTemplateRef<HTMLElement[]>('slideRef');
watch(() => slideRef.value, (nVal) => {
    //     if (nVal && slideRef.value) {
    //         slideRef.value.forEach((item) => {
    //             item.addEventListener('mouseup', (e) => {
    //                 const { textContent } = e.target as HTMLElement;
    //                 if (textContent) {
    //                     titleOnclick(textContent);
    //                 }
    //             })
    //         })
    //     }
})

onMounted(() => {
})

</script>
<style lang="scss" scoped>
.mainBanner {
    padding: 0 1rem;
    margin: 0 auto;
    max-width: $primaryWidth;
    height: 872px;
}

.title {
    z-index: 2;
    color: $primaryBacColor;
    position: absolute;
    top: 10%;
    left: 5%;
    border-radius: 1rem;
    padding: .25rem .5rem;

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

    @media screen and (max-width: 1440px) {

        a,
        img {
            height: 776px;
        }
    }

    a,
    img {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
}
</style>