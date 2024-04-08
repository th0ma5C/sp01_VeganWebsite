<template>
    <div class="tabContainer">
        <div class="btnContainer">
            <button @click="changeTab(index)"
                v-for="(item, index) in menu" :key="index">
                <SvgIcon :name="item.icon" width="24"
                    height="24"></SvgIcon>
                <transition>
                    <span v-show="show == index">{{
                        item.title }}</span>
                </transition>
            </button>
        </div>
        <div class="tabs" v-for="(item, index) in menu"
            :key="index" v-show="show == index">
            <div class="tab" v-for="(item, index) in menu"
                :key="index" v-show="show == index">
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
                    space-between="10" slides-per-view="2"
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
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 新、熱門請求統一? 服務端數據整理(v-for)、btn、Swiper樣式完善、沙拉去背統一背景顏色
 * *swiper圖片大小?按鈕樣式?說明字樣?
 * todo: 類型問題
 */
import { nextTick, onMounted, ref, type Ref } from 'vue';
import { reqGetMenu } from '@/api'

let imgUrls = ref<string[]>([]);
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

let show = ref(0)
function changeTab(n: number) {
    show.value = n;
}

onMounted(async () => {
    try {
        let data = await reqGetMenu();
        imgUrls.value = data
    } catch (error) {
        console.log('請求失敗');
    }
})
</script>

<style scoped lang="scss">
.tabContainer {
    @include flex-center-center;
    @include main-part;

    align-items: normal;
    flex-direction: column;

    .btnContainer {
        display: flex;

        button {
            background-color: transparent;
            border-bottom: none;
            display: inline-flex;
            align-items: center;

            &>div {
                margin-right: 3px;
            }

            span {
                white-space: nowrap;
                overflow: hidden;
            }

            .v-enter-active,
            .v-leave-active {
                transition: width 0.5s ease;
            }

            .v-enter-from,
            .v-leave-to {
                width: 0;
            }

            .v-enter-to,
            .v-leave-from {
                width: 64px;
            }
        }
    }

    .tabs {
        border: 1px solid black;

        .tab {
            img {
                width: 100%;
            }
        }
    }
}
</style>