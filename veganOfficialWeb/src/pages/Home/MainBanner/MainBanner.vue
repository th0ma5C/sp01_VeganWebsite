<template>
    <div>
        <div>
            <div v-for="(img, index) in imgs" :key="index">
                <a href="">
                    <img :src="`@assets/img/MainBanner/${img}.jpg`"
                        alt="">
                    <!-- <img :src="`/src/assets/img/MainBanner/${img}.jpg`"
                        alt=""> -->
                </a>
            </div>
            <img src="@assets/img/MainBanner/fruit.jpg" alt="">
            <div>
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
        <SubBanner></SubBanner>
    </div>
</template>

<script lang="ts" setup>
import SubBanner from './SubBanner.vue';
import { ref } from 'vue';

let imgs = ref([
    { name: 'berry-smoothie', src: `` },
    'fruit',
    'loaf',
    'tomatoes',
    'strawberry-smoothie',
    'vegetable',
    'water'
])
</script>

<style lang="scss" scoped>
img {
    max-width: 100%;
}
</style>