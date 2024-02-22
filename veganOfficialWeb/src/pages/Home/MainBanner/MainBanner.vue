<template>
    <div class="container">
        <div class="mainBanner">
            <transition-group name="banner" tag="div"
                class="banner">
                <div v-for="(img) in imgs" :key="img">
                    <a href="">
                        <img :src="`/imgs/MainBanner/${img}.jpg`"
                            alt="">
                    </a>
                </div>
            </transition-group>
            <div class="pagination">
                <a href="" v-for="img in imgs" :key="img"></a>
            </div>
        </div>
        <SubBanner></SubBanner>
    </div>
</template>

<script lang="ts" setup>
import SubBanner from './SubBanner.vue';
import { ref } from 'vue';

let imgs = ref([
    'berry-smoothie',
    'fruit',
    'loaf',
    'tomatoes',
    'strawberry-smoothie',
    'vegetable',
    'water'
])

</script>

<style lang="scss" scoped>
.container {

    .mainBanner {
        position: relative;

        .banner {
            display: flex;
            overflow: hidden;

            div {
                flex: 0 0 auto;
                width: 100%;

                img {
                    width: 100%;
                }
            }
        }

        .pagination {
            position: absolute;
            right: 6rem;
            bottom: 10%;
            transform: translateX(-50%);

            a {
                @include WnH(0.5rem);
                display: inline-block;
                background-color: transparent;
                border: 1px solid black;
                border-radius: 100%;
                margin-left: 0.5rem;
            }
        }

    }
}
</style>