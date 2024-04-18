<template>
    <div class="tabContainer">
        <div class="titleContainer">
            <div class="btnContainer">
                <button @click="changeTab(index)"
                    v-for="(item, index) in menu"
                    :key="index">
                    <div class="clickZone"
                        :class="index == show ? 'active' : 'hovered'">
                        <SvgIcon :name="item.icon"
                            width="36" height="36"
                            color="#036313">
                        </SvgIcon>
                        <transition tag="div" name="title">
                            <span v-show="show == index">{{
                                item.title }}</span>
                        </transition>
                    </div>
                    <SvgIcon :name="'CatalogSlash'"
                        width="36" height="36"
                        color="#036313"
                        v-if="index == 0 || index == 1"
                        style="cursor: default;">
                    </SvgIcon>
                </button>
            </div>
            <a href=""><span>完整菜單</span></a>
        </div>
        <transition-group tag="div" :name="transitionName"
            class="tabsContainer">
            <div class="tabs" v-for="(item, index) in menu"
                :key="index" v-show="show == index">
                <div class="tab">
                    <swiper-container class="menuSwiper"
                        thumbs-swiper=".menuSubSwiper"
                        space-between="10" navigation="true"
                        rewind="true"
                        :injectStyles="injectStyles">
                        <swiper-slide
                            v-for="(url, index) in item.list"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="url" alt=""
                                    @load="imgCounter">
                            </a>
                        </swiper-slide>
                    </swiper-container>
                    <swiper-container class="menuSubSwiper"
                        space-between="10"
                        :slides-per-view="item.list?.length"
                        free-mode="true"
                        watch-slides-progress="true">
                        <swiper-slide
                            v-for="(url, index) in item.list"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="url" alt="">
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
 * todo: vip數據、字體、切換動畫(vip Skeleton)、沙拉去背統一背景顏色、未選中淡化、hover效果
 * *swiper說明字樣? vip數據待完成
 * 
 * *0411解決切換動畫進出問題、swiper樣式問題
 * *0412解決服務端返回數據
 * todo: 同步loader和axios vip測試連結 地圖區塊 字型放在本地 catalog右側菜單連結
 */
import { watch, nextTick, onMounted, ref } from 'vue';
import { reqGetNewMenu, reqGetHotMenu } from '@/api/menu'
import { useLoader } from '@/store/loader';
import { storeToRefs } from 'pinia';

let newList = ref<string[]>(), hotList = ref<string[]>();
let menu = ref([
    {
        name: 'new',
        icon: 'CatalogNew',
        title: '當季新品',
        list: newList.value
    },
    {
        name: 'hot',
        icon: 'CatalogTrendingUp',
        title: '熱銷排行',
        list: hotList.value
    },
    {
        name: 'vip',
        icon: 'CatalogVip',
        title: '專屬分析',
    },
])
let injectStyles = [
    `
    :host{
        --swiper-navigation-size: 33px;
        --swiper-navigation-color: #036313;
    }
    .swiper-button-next{
    }
    `
]

let show = ref(0);
let transitionName = ref('rightIn')
function changeTab(n: number) {
    show.value = n;
}
let imgCount = ref(0);
function imgCounter() {
    imgCount.value++;
}
let { loaderActivated } = storeToRefs(useLoader())
watch([imgCount, menu], ([newCount,]) => {
    let done = (menu.value[0].list!.length) + (menu.value[1].list!.length);
    if (newCount == done) {
        loaderActivated.value = false;
    }
})

watch(show, (newVal, oldVal) => {
    newVal > oldVal ? transitionName.value = 'rightIn' : transitionName.value = 'leftIn';
})

onMounted(() => {
    type ReqFunction = () => Promise<string[]>;
    async function getUrl(req: ReqFunction) {
        try {
            let data: string[] = await req();
            return data.map((item) => '/api' + item)
        } catch (error) {
            console.log(`${req.name}請求失敗`);
        }
    }
    getUrl(reqGetNewMenu).then(data => {
        if (data) menu.value[0].list = data;
    });

    getUrl(reqGetHotMenu).then(data => {
        if (data) menu.value[1].list = data;
    });
})
</script>

<style lang="scss" scoped>
.tabContainer {
    @include flex-center-center;
    @include main-part;

    align-items: normal;
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
                margin-right: calc(2rem + 64px)
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

                    &>div {
                        margin: 3px;
                        border-radius: 10%;
                    }

                    span {
                        color: $secondBacColor;
                        white-space: nowrap;
                        overflow: hidden;
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
            span {
                position: absolute;
                right: 10%;
                transform: translateY(-50%);
                height: 52%;
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