<template>
    <div class="tabContainer">
        <div class="btnContainer">
            <button @click="changeTab(1)">
                <SvgIcon name="CatalogNew" width="24"
                    height="24"></SvgIcon>
                <transition>
                    <span v-show="show == 1">當季新品</span>
                </transition>
            </button>
            <button @click="changeTab(2)">
                <SvgIcon name="CatalogTrendingUp" width="24"
                    height="24"></SvgIcon>
                <transition>
                    <span v-show="show == 2">熱銷排行</span>
                </transition>
            </button>
            <button @click="changeTab(3)">
                <SvgIcon name="CatalogVip" width="24"
                    height="24"></SvgIcon>
                <transition>
                    <span v-show="show == 3">專屬分析</span>
                </transition>
            </button>
        </div>
        <div class="tabs">
            <div class="tab" v-show="show == 1">
                111
            </div>
            <div class="tab" v-show="show == 2">
                222
            </div>
            <div class="tab" v-show="show == 3">
                333
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 分頁動畫完成、swiper導入、v-for數據?
 */
import { ref } from 'vue';

let show = ref(1)
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
            transition: all 0.5s ease;
            overflow: hidden;

            span {
                white-space: nowrap;
                margin-left: 3px;
                overflow: hidden;
                // width: 0;
            }

            .v-enter-active,
            .v-leave-active {
                transition: all 0.5s ease;
            }

            .v-enter-from,
            .v-leave-to {
                width: 0;
            }

            .v-enter-to,
            .v-leave-from {
                width: 100%;
            }
        }
    }

    .tabs {
        border: 1px solid black;
    }
}
</style>