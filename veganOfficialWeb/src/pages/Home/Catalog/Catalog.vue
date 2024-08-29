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
            <a href="">
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
            </a>
        </div>
        <transition-group tag="div" :name="transitionName"
            class="tabsContainer">
            <div class="tabs" v-for="(item, index) in menu"
                :key="index" v-show="show == index">
                <div class="tab">
                    <swiper-container
                        :class="{ 'menuSwiper0': index == 0, 'menuSwiper1': index == 1 }"
                        :thumbs-swiper="`.menuSubSwiper${index}`"
                        navigation="true" rewind="true"
                        :injectStyles="injectStyles">
                        <swiper-slide
                            v-for="({ fileName, name, description }, index) in item.list"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="fileName" alt=""
                                    @load="imgCounter"
                                    v-show="isLoaded == true">
                                <div class="imgSkeleton"
                                    v-show="isLoaded == false">
                                    <img src="@assets/img/Home/Catalog/salad.png"
                                        alt="">
                                </div>
                            </a>
                            <div>
                                <div class="tabContent"
                                    v-show="isLoaded == true">
                                    <h2>{{ name }}</h2>
                                    <p>{{ description }}</p>

                                </div>
                                <div class="textSkeleton"
                                    v-show="isLoaded == false">
                                    <h2>Lorem, ipsum.</h2>
                                    <p>Lorem ipsum dolor sit
                                        amet.</p>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper-container>
                    <swiper-container
                        :class="{ 'menuSubSwiper0': index == 0, 'menuSubSwiper1': index == 1 }"
                        space-between="2"
                        :slides-per-view="item.url?.length"
                        free-mode="true"
                        watch-slides-progress="true">
                        <swiper-slide
                            v-for="({ fileName }, index) in item.list"
                            :key="index"
                            :class="{ 'swiper-slide-thumb-active': index == 0 }">
                            <a href="" @click.prevent>
                                <img :src="fileName" alt=""
                                    v-show="isLoaded == true">
                                <div class="imgSkeleton"
                                    v-show="isLoaded == false">
                                    <img src="@assets/img/Home/Catalog/salad.png"
                                        alt="">
                                </div>
                            </a>
                        </swiper-slide>
                    </swiper-container>
                    <div v-if="index == 2"
                        class="analyzeLink">
                        <a href=""><span>開始免費專屬分析</span></a>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: swiper說明字樣
 * todo: 請求超時進不了首頁(基本架構完成就進頁面) catalog讀取完成後出現動畫
 * 
 * *0411解決切換動畫進出問題、swiper樣式問題 *0412解決服務端返回數據 *0418完成字體放本地、中英字體分離
 * *0423初步完成catalog skeleton、去背 *0424壓縮圖片、解決兩個swiper實例問題、選中效果
 * *0425vip測試連結按鈕 字體轉檔woff2 *0426讀取Skeleton
 * *0429改Skeleton邏輯、CSS Skeleton圖片預加載 *0501完整菜單連結hover、線條動畫
 */
import { watch, onMounted, ref, reactive } from 'vue';
import { reqGetNewMenu, reqGetHotMenu } from '@/api/menu'
import { useLoader } from '@/store/loader';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';

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
        list: []
    },
    {
        name: 'vip',
        icon: 'CatalogVip',
        title: '專屬分析',
    },
]);

let injectStyles = [
    `
    :host{
        --swiper-navigation-size: 33px;
        --swiper-navigation-color: #00430b;
    }
    .swiper-button-next{
        right:0;
    }
    `
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
let transitionName = ref('init')
function changeTab(n: number) {
    show.value = n;
}

let getTabClass = (index: number) => index === show.value ? 'active' : '';

let imgCount = ref(0);
function imgCounter() {
    imgCount.value++;
}

let { loaderActivated } = storeToRefs(useLoader());
let isLoaded = ref(false);
watch([imgCount, menu], ([newCount,]) => {
    let done = (menu[0].list!.length) + (menu[1].list!.length);
    if (newCount == done) {
        loaderActivated.value = false;
        isLoaded.value = true;
    }
})

watch(show, (newVal, oldVal) => {
    newVal > oldVal ? transitionName.value = 'rightIn' : transitionName.value = 'leftIn';
})

onMounted(() => {
    reqGetNewMenu().then((data) => {
        menu[0].list = [...data]
    })
    reqGetHotMenu().then((data) => {
        menu[1].list = [...data]
    })
})
</script>

<style lang="scss" scoped>
.tabContainer {
    @include main-part;
    margin: 1rem auto;
    margin-top: 66px;
    display: flex;
    align-items: normal;
    justify-content: flex-start;
    gap: 9rem;
    height: 898px;
    flex-direction: column;
    overflow: hidden;

    .titleContainer {
        @include flex-center-center;
        position: relative;
        margin: 0.5rem 0rem;

        .btnContainer {
            display: flex;
            align-items: center;
            width: 80%;

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

                    &>div {
                        margin: 3px;
                        border-radius: 10%;
                    }

                    &:hover {
                        opacity: 1;
                        transform: scale(1.1);
                        transition: all 0.2s linear
                    }

                    span {
                        color: $secondBacColor;
                        white-space: nowrap;
                        overflow: hidden;
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
            @include WnH(64px, 19px);

            // &:hover>div {
            //     transform: rotateX(180deg);
            // }

            .flipper {
                @include WnH(100%);
                position: relative;
                transform-style: preserve-3d;
                text-align: center;

                .linkText {
                    @include flex-center-center;
                    color: $secondBacColor;
                    position: absolute;
                    right: 0;
                    backface-visibility: hidden;
                    background-color: #FCFAF2;
                }

            }

        }

    }

    .linkText-enter-active,
    .linkText-leave-active {
        transition: transform 0.25s;
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
        @include WnH(300px);
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
        margin-bottom: 2rem;

        swiper-slide {
            @include flex-center-center;
            gap: 1rem;

            img {
                @include WnH(300px);
                filter: drop-shadow(2px 2px 2px gray);
            }

            a {
                position: relative;

                .imgSkeleton {
                    @include skeleton;
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
    }

    @mixin subCatalogTab {
        width: fit-content;


        .swiper-slide-thumb-active {
            opacity: 1;
            transform: none
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

            img {
                filter: drop-shadow(2px 2px 2px gray);
            }

            img,
            a {
                @include WnH(150px);
            }


            .imgSkeleton {
                @include skeleton;
                @include WnH(135px);

                img {
                    @include WnH(110px);
                }
            }
        }
    }

    .tabsContainer {
        @include flex-center-center;
        position: relative;
        min-height: 550px;

        .tabs {
            position: absolute;
            width: 80%;

            .tab {
                margin: 0.5rem 0 1rem 0;

                .menuSwiper0,
                .menuSwiper1 {
                    @include catalogTab;
                }

                .menuSubSwiper0,
                .menuSubSwiper1 {
                    @include subCatalogTab;
                }

                .tabContent {
                    width: 300px;
                }

                .analyzeLink {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 140px;
                    height: 80px;
                    border-radius: 1rem;
                    background-color: $secondBacColor;
                    filter: drop-shadow(2px 2px 1px black);
                    transition: transform 0.5s ease;

                    &:hover {
                        transform: translate(-50%, -50%) scale(1.05);
                        transform-origin: center;
                    }

                    span {
                        @include flex-center-center;
                        @include WnH(100%);
                        color: $primaryBacColor;
                        font-size: 1rem;
                    }
                }
            }
        }
    }

    .rightIn-enter-active,
    .rightIn-leave-active {
        transition: all 0.5s ease;
    }

    .rightIn-enter-from,
    .leftIn-leave-to {
        transform: translateX(100%);
        opacity: 0;
    }

    .rightIn-enter-to,
    .leftIn-leave-from {
        transform: translateX(0);
        opacity: 1;
    }

    .leftIn-enter-active,
    .leftIn-leave-active {
        transition: all 0.5s ease;
    }

    .leftIn-enter-to,
    .rightIn-leave-from {
        transform: translateX(0);
        opacity: 1;
    }

    .leftIn-enter-from,
    .rightIn-leave-to {
        transform: translateX(-100%);
        opacity: 0;
    }
}
</style>