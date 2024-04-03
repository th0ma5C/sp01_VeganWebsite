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
        <div class="tabs">
            <div class="tab" v-show="show == 0">
                111
            </div>
            <div class="tab" v-show="show == 1">
                222
            </div>
            <div class="tab" v-show="show == 2">
                333
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 分頁動畫完成、數據導入(v-for)、swiper導入、整體樣式、服務端?
 */
import { ref } from 'vue';

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

let show = ref(0)
function changeTab(n: number) {
    show.value = n;
}

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
    }
}
</style>