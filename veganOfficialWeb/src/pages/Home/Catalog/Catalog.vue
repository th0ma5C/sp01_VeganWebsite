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
                    <swiper-container
                        :class="{ 'menuSwiper0': index == 0, 'menuSwiper1': index == 1 }"
                        :thumbs-swiper="`.menuSubSwiper${index}`"
                        navigation="true" rewind="true"
                        :injectStyles="injectStyles">
                        <swiper-slide
                            v-for="(url, index) in item.url"
                            :key="index">
                            <a href="" @click.prevent>
                                <img :src="url" alt=""
                                    @load="imgCounter"
                                    v-show="isLoaded == true">
                                <div class="tabsSkeleton"
                                    v-show="isLoaded == false">
                                </div>
                            </a>
                        </swiper-slide>
                    </swiper-container>
                    <swiper-container
                        :class="{ 'menuSubSwiper0': index == 0, 'menuSubSwiper1': index == 1 }"
                        space-between="2"
                        :slides-per-view="item.url?.length"
                        free-mode="true"
                        watch-slides-progress="true">
                        <swiper-slide
                            v-for="(url, index) in item.url"
                            :key="index"
                            :class="{ 'swiper-slide-thumb-active': index == 0 }">
                            <a href="" @click.prevent>
                                <img :src="url" alt=""
                                    v-show="isLoaded == true">
                                <div class="tabsSkeleton"
                                    v-show="isLoaded == false">
                                </div>
                            </a>
                        </swiper-slide>
                    </swiper-container>
                    <div v-if="index == 2">
                        馬上測驗
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 沙拉讀取加Skeleton swiper說明字樣
 * todo: 請求超時進不了首頁(基本架構完成就進頁面) vip測試連結按鈕 地圖區塊 菜單連結+hover、icon
 * todo: vip數據待完成
 * 
 * *0411解決切換動畫進出問題、swiper樣式問題 *0412解決服務端返回數據 *0418完成字體放本地、中英字體分離
 * *0423初步完成catalog skeleton、去背 *0424壓縮圖片、解決兩個swiper實例問題、選中效果
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
        url: newList.value
    },
    {
        name: 'hot',
        icon: 'CatalogTrendingUp',
        title: '熱銷排行',
        url: hotList.value
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
    `
]

let show = ref(0);
let transitionName = ref('init')
function changeTab(n: number) {
    show.value = n;
}

let imgCount = ref(0);
function imgCounter() {
    imgCount.value++;
}

let { loaderActivated } = storeToRefs(useLoader());
let isLoaded = ref(false);
watch([imgCount, menu], ([newCount,]) => {
    let done = (menu.value[0].url!.length) + (menu.value[1].url!.length);
    if (newCount == done) {
        loaderActivated.value = false;
        isLoaded.value = true;
    }
})

watch(show, (newVal, oldVal) => {
    newVal > oldVal ? transitionName.value = 'rightIn' : transitionName.value = 'leftIn';
})

onMounted(() => {
    console.log('catalog');
    type ReqFunction = () => Promise<string[]>;
    async function getUrl(req: ReqFunction) {
        try {
            let data: string[] = await req();
            return data.map((item) => '/api' + item)
        } catch (error) {
            console.log(`${req.name}請求失敗`, error);
        }
    }
    getUrl(reqGetNewMenu).then(data => {
        if (data) menu.value[0].url = data;
    });

    getUrl(reqGetHotMenu).then(data => {
        if (data) menu.value[1].url = data;
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

    @keyframes loading {
        from {
            background-position: 100%;
        }

        to {
            background-position: 0%;
        }
    }

    @mixin skeleton {
        border: 1px solid $secondBacColor;
        border-radius: 1rem;
        background: linear-gradient(115deg,
                $primeBacColor 45%,
                white 50%,
                $primeBacColor 52%) $primeBacColor;
        background-size: 300%;
        animation: 2s infinite ease-in loading;
    }

    @mixin catalogTab {
        margin-bottom: 2rem;

        swiper-slide {
            @include flex-center-center;

            img {
                @include WnH(300px);
                filter: drop-shadow(2px 2px 2px gray);
            }

            .tabsSkeleton {
                @include WnH(300px);
                @include skeleton;
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


            .tabsSkeleton {
                @include WnH(150px);
                @include skeleton;
            }
        }
    }

    .tabsContainer {
        @include flex-center-center;
        position: relative;
        min-height: 600px;

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