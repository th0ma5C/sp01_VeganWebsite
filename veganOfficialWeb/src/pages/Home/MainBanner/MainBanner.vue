<template>
    <swiper :modules="modules" :slides-per-view="1" loop
        :pagination="{ clickable: true }" :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    }" :speed="1000" class="banner">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <a href="" @click.prevent>
                <img :src="`/imgs/MainBanner/${img.title}.jpg`"
                    alt="">
            </a>
        </swiper-slide>
    </swiper>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

const modules = [Pagination, Autoplay]

const imgs = [
    { title: 'berry-smoothie' },
    { title: 'fruit' },
    { title: 'loaf' },
    { title: 'tomatoes' },
    { title: 'strawberry-smoothie' },
    { title: 'vegetable' },
    { title: 'water' },
];

onMounted(() => {
})

</script>
<style lang="scss">
@import 'swiper/scss';
@import 'swiper/scss/navigation';
@import 'swiper/scss/pagination';

.swiper {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;

    .swiper-wrapper {
        display: flex;
    }
}

.swiper-slide {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.swiper-pagination-bullet {
    width: 10px;
    height: 10px;
}

.swiper-pagination-bullet-active {
    background-color: $primeBacColor;
}
</style>