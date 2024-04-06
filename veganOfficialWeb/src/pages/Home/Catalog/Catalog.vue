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
                    space-between="10" navigation="true">
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
 * todo: 分頁動畫完成、數據導入(v-for)、swiper導入、整體樣式、服務端?
 */
import { onMounted, ref } from 'vue';
import { reqGetMenu } from '@/api/menu'

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

onMounted(() => {
    let data = reqGetMenu()
    console.log(data);
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

        .swiper-slide-active {
            width: 100%;
        }
    }
}
</style>