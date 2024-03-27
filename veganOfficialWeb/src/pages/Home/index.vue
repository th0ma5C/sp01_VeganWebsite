<template>
    <div>
        <Marquee></Marquee>
        <MainBanner></MainBanner>
        <carousel :showNum="1" :autoplay="{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }" :speed="1000" :swiperList="getUrl">
        </carousel>
        <SubBanner></SubBanner>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 1.carousel組件解決類型問題 2.carousel導入mainBanner 3.getUrl如何傳入
 */

import Marquee from './MainBanner/Marquee.vue';
import MainBanner from './MainBanner/MainBanner.vue';
import SubBanner from './MainBanner/SubBanner.vue';
import carousel from '@components/global/carousel/carousel.vue'

let subBanner = [
    { title: 'dishes' },
    { title: 'smoothie' },
    { title: 'friend' },
    { title: 'app' },
    { title: 'hiring' }
];

const getUrl = subBanner.map(item => ({
    url: new URL(`../../assets/img/SubBanner/${item.title}.png`, import.meta.url).href
}))

console.log(getUrl);
</script>

<style scoped></style>