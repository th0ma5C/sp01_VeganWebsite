<template>
    <swiper :modules="modules" :slides-per-view="4" loop
        :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }" :speed="1000" class="banner">
        <swiper-slide v-for="(item, index) in getUrl"
            :key="index">
            <a href="" @click.prevent>
                <img :src="item.url" alt="">
            </a>
        </swiper-slide>
    </swiper>
</template>

<script lang="ts" setup>


import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
const modules = [Autoplay]

let imgs = [
    { title: 'dishes' },
    { title: 'smoothie' },
    { title: 'friend' },
    { title: 'app' },
    { title: 'hiring' }
]

const getUrl = imgs.map(item => ({
    url: new URL(`/src/assets/img/SubBanner/${item.title}.png`, import.meta.url).href
}))

console.log(getUrl);
</script>

<style lang="scss" scoped></style>