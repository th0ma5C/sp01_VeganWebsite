<template>
    <div class="tabContainer">
        <div class="titleContainer">
            <div class="btnContainer"
                :style="{ '--lineMargin': lineMargin + 'px' }">
                <button @click="changeTab(index)"
                    v-for="(item, index) in menu"
                    :key="index">
                    <div class="clickZone"
                        :class="getTabClass(index)">
                        <SvgIcon :name="item.icon"
                            width="36" height="36"
                            color="#00430b">
                        </SvgIcon>
                        <transition tag="div" name="title">
                            <span v-show="show == index">{{
                                item.title }}</span>
                        </transition>
                    </div>
                    <SvgIcon :name="'CatalogSlash'"
                        width="36" height="36"
                        color="#00430b"
                        v-if="index == 0 || index == 1"
                        style="cursor: default;">
                    </SvgIcon>
                </button>
            </div>
            <router-link to="/menu">
                <div class="flipper"
                    @mouseenter="switchText($event)"
                    @mouseleave="switchText($event)">
                    <transition name="linkText">
                        <span class="linkText"
                            v-if="side == 'front'">
                            More
                        </span>
                        <span class="linkText" v-else>
                            完整菜單
                        </span>
                    </transition>
                </div>
            </router-link>
        </div>
        <transition-group tag="div" :name="transitionName"
            class="tabsContainer"
            @after-enter="updateSwiper(show)">
            <div class="tabs" v-for="(item, index) in menu"
                :key="index" :class="{
                    currSwiper: show == index
                }">
                <div class="tab">
                    <template
                        v-if="item.list.length > 0 && isLoaded">
                        <swiper-container ref="swiperRef"
                            :class="[`menuSwiper${index}`]"
                            :thumbs-swiper="`.menuSubSwiper${index}`"
                            loop="true" speed="750"
                            :rewind="false" effect="fade"
                            :fadeEffect="{
                                crossFade: true
                            }" :pagination="{
                                clickable: true,
                                dynamicBullets: true
                            }" :injectStyles="injectStyles"
                            :allowTouchMove="false"
                            :navigation-prev-el="`.prevBtn${index}`"
                            :navigation-next-el="`.nextBtn${index}`">
                            <swiper-slide
                                v-for="({ fileName, name, description }, index) in item.list"
                                :key="index">
                                <a href="" @click.prevent>
                                    <img :src="fileName!"
                                        alt=""
                                        @click="gotoProductPage(name ?? '')"
                                        @load="imgCounter"
                                        v-show="isLoaded">
                                    <div class="imgSkeleton"
                                        v-show="!isLoaded">
                                        <img src="@assets/img/Home/Catalog/salad.png"
                                            alt="">
                                    </div>
                                </a>
                                <div>
                                    <div class="tabContent"
                                        v-show="isLoaded">
                                        <h2>{{ name }}</h2>
                                        <p>{{ description }}
                                        </p>

                                    </div>
                                    <div class="textSkeleton"
                                        v-show="!isLoaded">
                                        <h2>Lorem, ipsum.
                                        </h2>
                                        <p>Lorem ipsum dolor
                                            sit
                                            amet.</p>
                                    </div>
                                </div>
                            </swiper-slide>

                            <template
                                v-if="index == 0 || index == 1 || (index == 2 && QNR_isDone)">
                                <div
                                    :class="['prevBtn', `prevBtn${index}`]">
                                    <SvgIcon name="Previous"
                                        width="36px"
                                        height="36px"
                                        color="#0d731e">
                                    </SvgIcon>
                                </div>
                                <div
                                    :class="['nextBtn', `nextBtn${index}`]">
                                    <SvgIcon name="Next"
                                        width="36px"
                                        height="36px"
                                        color="#0d731e">
                                    </SvgIcon>
                                </div>
                            </template>
                        </swiper-container>
                    </template>

                    <template v-if="item.list.length > 0">
                        <swiper-container
                            :class="[`menuSubSwiper${index}`]"
                            space-between="2"
                            :slides-per-view="item.list.length"
                            watch-slides-progress="true">

                            <swiper-slide
                                v-for="({ fileName }, index) in item.list"
                                :key="index"
                                :class="{ 'swiper-slide-thumb-active': index == 0 }">
                                <a href="" @click.prevent>
                                    <img :src="fileName!"
                                        alt=""
                                        v-show="isLoaded == true">
                                    <div class="imgSkeleton"
                                        v-show="isLoaded == false">
                                        <img src="@assets/img/Home/Catalog/salad.png"
                                            alt="">
                                    </div>
                                </a>
                            </swiper-slide>
                        </swiper-container>
                    </template>
                </div>
                <div
                    v-if="index == 2 && item.list.length == 0">
                    <Spinner v-show="!isResultCheck">
                    </Spinner>
                    <div class="analyzeLink"
                        v-show="isResultCheck && !QNR_isDone">
                        <router-link to="/questionnaire">
                            <span>
                                開始免費專屬分析
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="mobileMoreBtn" key="mobileMoreBtn">
                <router-link to="/menu">
                    <div class="flipper"
                        @mouseenter="switchText($event)"
                        @mouseleave="switchText($event)">
                        <transition name="linkText">
                            <span class="linkText front"
                                v-if="side == 'front'">
                                More
                            </span>
                            <span class="linkText rear"
                                v-else>
                                完整菜單
                            </span>
                        </transition>
                    </div>
                </router-link>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 
 * 
 * *0411解決切換動畫進出問題、swiper樣式問題 *0412解決服務端返回數據 *0418完成字體放本地、中英字體分離
 * *0423初步完成catalog skeleton、去背 *0424壓縮圖片、解決兩個swiper實例問題、選中效果
 * *0425vip測試連結按鈕 字體轉檔woff2 *0426讀取Skeleton
 * *0429改Skeleton邏輯、CSS Skeleton圖片預加載 *0501完整菜單連結hover、線條動畫
 * *0901swiper說明字樣
 * //請求超時進不了首頁(基本架構完成就進頁面) catalog讀取完成後出現動畫
 */
import { watch, onMounted, ref, reactive, useTemplateRef, nextTick, onBeforeMount, onUpdated } from 'vue';
import { reqGetNewMenu, reqGetHotMenu } from '@/api/menu'
import { useLoaderStore } from '@/store/loader';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';
import type { SwiperContainer } from 'swiper/element';
import { useQuestionnaireStore } from '@/store/questionnaireStore';

let menu = reactive([
    {
        name: 'new',
        icon: 'CatalogNew',
        title: '當季新品',
        list: [] as MenuItem[]
    },
    {
        name: 'hot',
        icon: 'CatalogTrendingUp',
        title: '熱銷排行',
        list: [] as MenuItem[]
    },
    {
        name: 'vip',
        icon: 'CatalogVip',
        title: '專屬分析',
        list: [] as MenuItem[]
    },
]);

let injectStyles = [
    `
    :host{
        --swiper-navigation-size: 33px;
        --swiper-navigation-color: #00430b;
    }`
    // .swiper-button-next{
    //     right:18%;
    // }
    // .swiper-button-prev{
    //     left:18%;
    // }
    // `
]

let lineMargin = ref(25);
let side = ref('front');
let timers: (ReturnType<typeof setTimeout> | null)[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let timeStamp: number | null = null;

function switchText(e: MouseEvent) {
    if (!timeStamp) {
        timeStamp = Date.now();
        determineClass(e.type);
        timer = setTimeout(() => {
            timeStamp = null;
        }, 250 - (Date.now() - timeStamp));
        return
    }
    if (timer) {
        clearTimeout(timer);
        const index = timers.indexOf(timer);
        if (index !== -1) {
            timers.splice(index, 1);
        }
    }
    timeStamp = Date.now();
    timer = setTimeout(() => {
        determineClass(e.type);
        timeStamp = null;
    }, 250 - (Date.now() - timeStamp));
    timers.push(timer);
}

function determineClass(type: string) {
    switch (type) {
        case 'mouseenter':
            side.value = 'back';
            lineMargin.value = 0;
            break;
        case 'mouseleave':
            side.value = 'front';
            lineMargin.value = 25;
            break;
        default:
            break;
    }
}

// function switchText(e: MouseEvent) {
//     switch (e.type) {
//         case 'mouseenter':
//             lineMargin.value = 0;
//             break;
//         case 'mouseleave':
//             lineMargin.value = 25;
//             break;
//         default:
//             break;
//     }
// }

let show = ref(0);
let transitionName = ref('init');
const swiperRef = useTemplateRef<SwiperContainer[]>('swiperRef');
function changeTab(n: number) {
    show.value = n;
}

function updateSwiper(index: number) {
    if (!menu[index].list || menu[index].list.length == 0) return
    nextTick(() => {
        if (!swiperRef.value || !swiperRef.value[index].swiper) return
        swiperRef.value[index].swiper.update()
    })
}

let getTabClass = (index: number) => index === show.value ? 'active' : '';

let imgCount = ref(0);
function imgCounter() {
    imgCount.value++;
}

let { loaderActivated } = storeToRefs(useLoaderStore());
let isLoaded = ref(false);
// watch([imgCount, menu], ([newCount,]) => {
//     let done = (menu[0].list!.length) + (menu[1].list!.length);
//     if (newCount == done) {
//         loaderActivated.value = false;
//         isLoaded.value = true;
//     }
// })

watch(show, (newVal, oldVal) => {
    newVal > oldVal ? transitionName.value = 'rightIn' : transitionName.value = 'leftIn';
})

// 路由跳轉
/**
 * ?todo hot new list 儲存到Store
 */
// const { getInfoByName } = useMenuStore();
const router = useRouter();

function gotoProductPage(name: string) {
    router.push({
        name: 'Product',
        query: {
            name
        }
    })
}

//  數據請求
const { fetchHotList, fetchNewList } = useMenuStore();
// const { hotList } = storeToRefs(useMenuStore());
async function fetchMenuList() {
    try {
        [menu[0].list, menu[1].list] = await Promise.all([fetchNewList(), fetchHotList()]);
        isLoaded.value = true;
        nextTick(() => {
            if (swiperRef.value) {
                swiperRef.value.forEach((container) => {
                    container.swiper.update();
                })
            }
        })

    } catch (error) {
        console.log(fetchMenuList.name, error);
    }
}

//route to analyst result
const questionnaireStore = useQuestionnaireStore();
const { initQNR, getRecList } = questionnaireStore;
const { QNR_isDone } = storeToRefs(questionnaireStore);
const isResultCheck = ref(false);

async function initVIPtab() {
    try {
        await initQNR();
        isResultCheck.value = true;
        if (!QNR_isDone.value) return
        menu[2].list = getRecList();
        // console.log(getRecList());
    } catch (error) {
        console.log(error);
    }
}


onBeforeMount(() => {
    // fetchMenuList();
});

onMounted(() => {
    fetchMenuList();
    initVIPtab();
})
</script>

<style lang="scss" scoped>
* {
    // outline: 1px solid black;
}

%flipper {
    @include WnH(64px, 42px);

    .flipper {
        @include WnH(100%);
        position: relative;
        top: -1px;
        transform-style: preserve-3d;
        text-align: center;
        font-variation-settings: 'wght' 500;

        .linkText {
            @include WnH(100%);
            @include flex-center-center;
            color: $secondBacColor;
            position: absolute;
            right: 0;
            background-color: $primaryBacColor;
            backface-visibility: hidden;
            line-height: 42px;
        }

    }
}

.tabContainer {
    @include main-part;
    margin-inline: auto;
    margin-block: 6rem 9rem;
    display: flex;
    align-items: normal;
    justify-content: flex-start;
    gap: 3rem;
    // height: 898px;
    min-height: 100%;
    flex-direction: column;
    overflow: hidden;

    .titleContainer {
        @include flex-center-center;
        position: relative;
        margin: 0.5rem 0rem;

        .btnContainer {
            display: flex;
            align-items: center;
            width: 65%;

            &:after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: $secondBacColor;
                margin: 1rem 2rem;
                margin-right: calc(2rem - var(--lineMargin, 25px));
                transition: margin 0.25s ease;
            }

            button {
                background-color: transparent;
                border: none;
                display: inline-flex;
                align-items: center;
                padding: 0;

                .clickZone {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 0.5rem;
                    opacity: 30%;
                    transition: all 0.2s;

                    &>div {
                        margin: 3px;
                        border-radius: 10%;
                    }

                    &:hover {
                        opacity: 1;
                        transform: scale(1.1);
                    }

                    span {
                        color: $secondBacColor;
                        white-space: nowrap;
                        overflow: hidden;
                        font-variation-settings: 'wght' 500;
                    }
                }

                .active {
                    cursor: default;
                    opacity: 1;
                    transform: scale(1.1);
                }

                .title-enter-active,
                .title-leave-active {
                    transition: width 0.5s ease-out;
                }

                .title-enter-from,
                .title-leave-to {
                    width: 0;
                }

                .title-enter-to,
                .title-leave-from {
                    width: 64px;
                }


            }
        }

        a {
            @extend %flipper;
            // @include WnH(64px, 42px);

            // // &:hover>div {
            // //     transform: rotateX(180deg);
            // // }

            // .flipper {
            //     @include WnH(100%);
            //     position: relative;
            //     top: -1px;
            //     transform-style: preserve-3d;
            //     text-align: center;
            //     font-variation-settings: 'wght' 500;

            //     .linkText {
            //         @include WnH(100%);
            //         @include flex-center-center;
            //         color: $secondBacColor;
            //         position: absolute;
            //         right: 0;
            //         backface-visibility: hidden;
            //         background-color: #FCFAF2;
            //         line-height: 42px;
            //     }

            // }

        }

    }
}

.linkText-enter-active,
.linkText-leave-active {
    // transition: all .25s, transform 0.25s;
    transition: all .5s;
}

.linkText-enter-from,
.linkText-leave-to {
    transform: rotateX(180deg);
}

.linkText-enter-to,
.linkText-leave-from {
    transform: rotateX(0deg);
}

@keyframes loadText {
    from {
        background-position: 100%;
    }

    to {
        background-position: 0%;
    }
}

@keyframes loadImg {
    0% {
        left: -250%;
    }

    100% {
        left: -50%;
    }
}

@mixin skeleton {
    // @include WnH(300px);
    @include flex-center-center;
    position: relative;
    overflow: hidden;

    img {
        @include WnH(230px);
        filter: none;
        display: block;
    }

    &::after {
        @include WnH(300%);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
        animation: loadImg 2s infinite ease-in;
    }
}

@mixin catalogTab {
    margin-bottom: 4rem;

    swiper-slide {
        @include flex-center-center;
        gap: 1.5rem;
        background-color: $primaryBacColor;
    }

    a {
        @include WnH(300px);
        position: relative;
        user-select: none;
        display: flex;
        border-radius: 1rem;
        overflow: hidden;
    }

    .imgSkeleton {
        @include WnH(300px);
        @include skeleton;
    }

    img {
        filter: drop-shadow(2px 2px 2px gray);
        transition: scale .3s;
        object-position: center;
        object-fit: contain;

        &:hover {
            scale: 1.05;
        }
    }

    .textSkeleton {
        color: transparent;

        &>* {
            border-radius: 0.25rem;
            background: linear-gradient(115deg,
                    #036313 40%,
                    transparent 50%,
                    #036313 52%);
            background-size: 300%;
            animation: 2s infinite ease-in loadText;
        }
    }
}

@mixin subCatalogTab {
    width: fit-content;

    .swiper-slide-thumb-active {
        opacity: 1;
        transform: none;
    }

    swiper-slide {
        @include flex-center-center;
        width: fit-content !important;
        opacity: 0.5;
        transition: transform 0.5s ease;
        transform: scale(0.9);

        &:hover {
            transform: scale(1);
        }
    }

    a {
        @include WnH(150px);
        user-select: none;
        border-radius: 1rem;
        overflow: hidden;
    }

    .imgSkeleton {
        @include WnH(135px);
        @include skeleton;

        img {
            @include WnH(110px);
        }
    }

    img {
        filter: drop-shadow(2px 2px 2px gray);
        object-position: center;
        object-fit: contain;
    }


}

.tabsContainer {
    @include flex-center-center;
    position: relative;
    min-height: 550px;
}

.tabs {
    opacity: 0;
    position: absolute;
    width: 75%;
    transition: opacity .5s;
}

.currSwiper {
    opacity: 1;
}

.tab {
    // margin: 0.5rem 0 1rem 0;
    position: relative;
}

[class^="menuSwiper"] {
    @include catalogTab;
}

.prevBtn,
.nextBtn {
    height: fit-content;
    position: absolute;
    bottom: -2rem;
    left: 50%;
    z-index: 4;
    // transform: translate(-50%, -50%);
    // transform-origin: left top;
    transform-origin: center;
    transition: scale .2s;
    translate: -50% 50%;

    &:hover {
        scale: 1.15;
    }

    &:active {
        translate: calc(-50% + 1px) calc(50% + 1px);
        // transform: translate(calc(-50% + 1px), calc(50% + 1px));
    }
}

.prevBtn {
    left: 45%;
    // translate: -50% -50%;
    // translate: -60%
}

.nextBtn {
    left: 55%;
    // translate: 50% -50%;
    // translate: 60%
}

[class^="menuSubSwiper"] {
    @include subCatalogTab;

    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
}

.tabContent {
    // outline: 1px solid black;
    width: 375px;
    transform: translateY(-18px);
    color: $secondBacColor;

    h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        font-variation-settings: 'wght' 600;
        letter-spacing: 1px;
    }

    p {
        font-size: 1rem;
        line-height: 1.75;
        font-variation-settings: 'wght' 500;
    }
}

.analyzeLink {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: .75rem 1rem;
    border-radius: 1rem;
    background-color: $secondBacColor;
    filter: drop-shadow(2px 2px 1px black);
    transition: scale .15s;
    transform-origin: left top;

    &:hover {
        scale: 1.1;
    }

    &:active {
        transform: translate(calc(-50% + 1px), calc(-50% + 1px));
    }

    span {
        @include flex-center-center;
        @include WnH(100%);
        color: $primaryBacColor;
        font-size: 1rem;
        text-wrap: nowrap;
    }
}



// .rightIn-enter-active,
// .rightIn-leave-active {
//     transition: transform 0.5s, opacity .25s;
// }

// .rightIn-enter-from,
// .leftIn-leave-to {
//     transform: translateX(100%);
//     opacity: 0;
// }

// .rightIn-enter-to,
// .leftIn-leave-from {
//     transform: translateX(0);
//     opacity: 1;
// }

// .leftIn-enter-active,
// .leftIn-leave-active {
//     transition: transform 0.5s, opacity .25s;
// }

// .leftIn-enter-to,
// .rightIn-leave-from {
//     transform: translateX(0);
//     opacity: 1;
// }

// .leftIn-enter-from,
// .rightIn-leave-to {
//     transform: translateX(-100%);
//     opacity: 0;
// }

swiper-container::part(container) {
    overflow: visible;
}

swiper-container::part(pagination) {
    opacity: 0;
}

.mobileMoreBtn {
    // @include WnH(100%);
    // color: $secondBacColor;
    position: absolute;
    display: none;

    a {
        @extend %flipper;
        // @include WnH(72px, 42px);
    }
}

@include large {}

@include medium($width: 1024px) {

    .tabContainer {
        gap: 0;
    }

    [class^="menuSwiper"] {
        margin-bottom: 3rem;

        a {
            @include WnH(250px);
        }
    }

    [class^="menuSubSwiper"] {
        a {
            @include WnH(125px);
        }
    }

    .nextBtn,
    .prevBtn {
        bottom: -1.5rem;
        transform: scale(.75);
    }
}

@include medium {
    .tabContainer {
        margin-block: 3rem;

        .titleContainer .btnContainer {
            width: 80%;
        }
    }

    .tabsContainer {
        min-height: 450px;
    }

    .tabContent {
        width: 300px;

        h2 {
            font-size: 1.75rem;
        }

        p {
            font-size: .75rem;
        }
    }

    [class^="menuSwiper"] {
        a {
            @include WnH(200px);
        }
    }

    [class^="menuSubSwiper"] {
        a {
            @include WnH(100px);
        }
    }
}

@include small {
    .tabsContainer {
        min-height: 300px;
    }

    .tabs {
        width: 100%;
    }

    .tabContainer {
        margin-block: 1rem 4rem;

        .titleContainer {
            a {
                display: none;
            }

            .btnContainer {
                width: 75%;

                &::after {
                    display: none;
                }
            }
        }
    }

    .tabContent {
        width: 250px;

        h2 {
            font-size: 1.5rem;
            margin-bottom: .25rem;
        }

        p {
            font-size: .75rem;
        }
    }

    .nextBtn,
    .prevBtn {
        bottom: -1.5rem;
        transform: scale(.5);
        translate: -50% 100%;

        &:active {
            translate: calc(-50% + 1px) calc(100% + 1px);
        }
    }

    [class^="menuSwiper"] {
        a {
            @include WnH(150px);
        }
    }

    [class^="menuSubSwiper"] {
        display: none;
    }

    swiper-container::part(pagination) {
        opacity: 1;
        bottom: -.75rem;
    }

    swiper-container::part(bullet-active) {
        background-color: $btnBacColor_light;
    }

    .mobileMoreBtn {
        @include flex-center-center;
        right: 12%;
        bottom: 0;
    }
}

@include small($width: 430px) {

    .tabContainer {
        overflow: visible;

        .titleContainer {
            .btnContainer {
                position: relative;
                left: 1rem;
                width: 100%;
            }
        }
    }

    [class^="menuSwiper"] {
        a {
            @include WnH(125px);
            margin-bottom: 1rem;
        }

        swiper-slide {
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .tabContent {
        width: auto;
        padding-inline: 2rem;

        h2 {
            font-size: 1.5rem;
            margin-bottom: .25rem;
        }

        p {
            font-size: .75rem;
        }
    }

    swiper-container::part(pagination) {
        opacity: 1;
        bottom: -.5rem;
    }

    .nextBtn,
    .prevBtn {
        bottom: -9px;
    }

    .mobileMoreBtn {
        bottom: -1.5rem;

        a {
            height: 22px;
        }
    }
}

@include small($width: 320px) {
    [class^="menuSwiper"] {
        // display: none;
    }

    .tabsContainer {
        min-height: 325px;
    }


}
</style>