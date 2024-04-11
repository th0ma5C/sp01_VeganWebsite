<template>
    <div class="tabContainer">
        <div class="btnContainer">
            <button @click="changeTab(index)"
                v-for="(item, index) in menu" :key="index">

                <div class="clickZone"
                    :class="index == show ? 'active' : 'hovered'">
                    <SvgIcon :name="item.icon" width="36"
                        height="36" color="#036313">
                    </SvgIcon>
                    <transition tag="div" name="title">
                        <span v-show="show == index">{{
                            item.title }}</span>
                    </transition>
                </div>
                <SvgIcon :name="'CatalogSlash'" width="36"
                    height="36" color="#036313"
                    v-if="index == 0 || index == 1"
                    style="cursor: default;">
                </SvgIcon>
            </button>
        </div>
        <transition-group tag="div" :name="transitionName"
            class="tabsContainer">
            <div class="tabs" v-for="(item, index) in menu"
                :key="index" v-show="show == index">
                <div class="tab">
                    <swiper-container class="menuSwiper"
                        thumbs-swiper=".menuSubSwiper"
                        space-between="10" navigation="true"
                        rewind="true">
                        <swiper-slide
                            v-for="(img, index) in imgs"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="img.url" alt="">
                            </a>
                        </swiper-slide>
                    </swiper-container>
                    <swiper-container class="menuSubSwiper"
                        space-between="10"
                        :slides-per-view="newList.length"
                        free-mode="true"
                        watch-slides-progress="true">
                        <swiper-slide
                            v-for="(img, index) in imgs"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="img.url" alt="">
                            </a>
                        </swiper-slide>
                    </swiper-container>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 服務端數據整理(v-for)、btn、Swiper樣式完善、字體、切換動畫、沙拉去背統一背景顏色
 * *swiper圖片大小?按鈕樣式?說明字樣?
 * *0411解決切換動畫進出問題
 */
import { computed, watch, onMounted, ref } from 'vue';
import { reqGetNewMenu, reqGetHotMenu } from '@/api/menu'

let newList = ref<string[]>([]), hotList = ref<string[]>([]);
let menu = ref([
    {
        icon: 'CatalogNew',
        title: '當季新品',
        page: 1,

    },
    {
        icon: 'CatalogTrendingUp',
        title: '熱銷排行',
        page: 2,

    },
    {
        icon: 'CatalogVip',
        title: '專屬分析',
        page: 3,

    },
])
let imgs = [
    {
        id: 1,
        url: "/imgs/HomeCatalog/1.png"
    },
    {
        id: 2,
        url: "/imgs/HomeCatalog/2.png"
    },
    {
        id: 3,
        url: "/imgs/HomeCatalog/3.png"
    },
    {
        id: 4,
        url: "/imgs/HomeCatalog/4.png"
    },
    {
        id: 5,
        url: "/imgs/HomeCatalog/5.png"
    }
]

let show = ref(0);
let transitionName = ref('rightIn')
function changeTab(n: number) {
    show.value = n;
}
watch(show, (newVal, oldVal) => {
    newVal > oldVal ? transitionName.value = 'rightIn' : transitionName.value = 'leftIn';
})
onMounted(async () => {
    try {
        newList.value = await reqGetNewMenu();
        hotList.value = await reqGetHotMenu();
    } catch (error) {
        console.log('請求失敗');
    }
})
</script>

<style lang="scss" scoped>
.tabContainer {
    @include flex-center-center;
    @include main-part;

    align-items: normal;
    flex-direction: column;

    .btnContainer {
        display: flex;
        margin: 0.5rem 1rem;

        button {
            // background-color: $secondBacColor;
            background-color: transparent;
            border: none;
            display: inline-flex;
            align-items: center;
            padding: 0;

            .clickZone {
                display: inline-flex;
                align-items: center;

                &>div {
                    margin: 3px;
                    border-radius: 10%;
                }

                span {
                    color: $secondBacColor;
                }
            }

            .active {
                cursor: default;
            }

            .hovered {
                border-radius: 0.5rem;
                opacity: 30%;

                &:hover {
                    opacity: 1;
                    transform: scale(1.1);
                    transition: all 0.2s linear
                }
            }

            span {
                white-space: nowrap;
                overflow: hidden;
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

    .tabsContainer {
        @include flex-center-center;
        position: relative;
        min-height: 350px;

        .tabs {
            // border-top: 1px solid black;
            position: absolute;
            width: 80%;

            .tab {
                margin-top: 1rem;

                .menuSwiper {

                    swiper-slide {
                        @include flex-center-center;

                        img {
                            @include WnH(215px)
                        }
                    }
                }

                .menuSubSwiper {
                    width: fit-content;

                    swiper-slide {
                        width: fit-content !important;
                    }

                    img {
                        @include WnH(107px)
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