<template>
    <div class="container">
        <div class="mainBanner">
            <transition-group name="banner" tag="div"
                class="banner" :style="swiperStyle"
                ref="div">
                <div v-for="(img) in imgs" :key="img"
                    :class="[{ 'dragging': isDown }]">
                    <a href="" @click.prevent>
                        <img :src="`/imgs/MainBanner/${img}.jpg`"
                            alt="">
                    </a>
                </div>
            </transition-group>
            <div class="pagination">
                <span v-for="(img, index) in imgs"
                    :key="img"
                    @click="change(index)"></span>
            </div>
        </div>
        <SubBanner></SubBanner>
    </div>
</template>

<script lang="ts" setup>
import SubBanner from './SubBanner.vue';
import { onMounted, ref, onUpdated } from 'vue';
import { useSwiper } from '@/hooks/useSwiper';

const imgs = ref([
    'berry-smoothie',
    'fruit',
    'loaf',
    'tomatoes',
    'strawberry-smoothie',
    'vegetable',
    'water'
]);

const div = ref();
// let { changeSwiper, isDown, swiperStyle } = useSwiper(div, imgs, 5050);

let amount = imgs.value.length;
let currentItem = 0;
function change(index) {
    // if (index == currentItem) {
    //     return
    // } else if (index < currentItem) {
    //     for (index; index < currentItem; index++) {
    //         changeSwiper(1);
    //     }
    //     currentItem = index;
    // } else {
    //     for (index; index > currentItem; index--) {
    //         changeSwiper(0);
    //     }
    //     currentItem = index;
    // }
}

onMounted(() => {
})
onUpdated(() => {
})

</script>

<style lang="scss" scoped>
.container {

    .mainBanner {
        position: relative;
        overflow: hidden;

        .banner {
            display: flex;
            position: relative;

            div {
                flex: 0 0 auto;
                width: 100%;

                img {
                    width: 100%;
                }
            }

            div:first-child,
            div:last-child {
                opacity: 0;
            }

            .banner-move {
                transition: transform 1s ease;
            }

            .dragging {
                transition: none !important;
            }

        }

        .pagination {
            position: absolute;
            right: 6rem;
            bottom: 10%;
            transform: translateX(-50%);

            span {
                @include WnH(0.5rem);
                display: inline-block;
                border: 1px solid black;
                border-radius: 100%;
                margin-left: 0.5rem;

                &:hover {
                    cursor: pointer;
                }
            }
        }

    }
}
</style>