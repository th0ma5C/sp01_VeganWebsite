<template>
    <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }" :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }" :speed="1000" :centeredSlides="true" class="banner">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="title"
                        data-swiper-parallax="-200">
                        slideslideslideslideslideslide
                    </div>
                </div>
                <div class="text" data-swiper-parallax="0">
                    <a href="" @click.prevent>
                        <img :src="`/imgs/MainBanner/${img.title}.png`"
                            alt="">
                    </a>
                </div>
            </div>
        </swiper-slide>
    </swiper-container>
    <!-- <swiper-container :slides-per-view="1" loop="true"
        :pagination="{ clickable: true }" :speed="1000"
        :centeredSlides="true" class="banner">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <a href="" @click.prevent>
                <div class="imgTitle">
                    <h1>title</h1>
                </div>
                <div class="imgText">
                    <p>Lorem ipsum do</p>
                </div>
                <img :src="`/imgs/MainBanner/${img.title}.png`"
                    alt="">
            </a>
        </swiper-slide>
    </swiper-container> -->
</template>
<script lang="ts" setup>
/**
 * todo:加入文字，模糊CSS
 */
import { onMounted } from 'vue';


const imgs = [
    { title: '1' },
    { title: '2' },
    { title: '3' },
    { title: '4' },
    { title: '5' },
];
onMounted(() => {
    console.log(innerWidth, innerHeight);
})
</script>
<style lang="scss">
:root {
    --swiper-pagination-bullet-width: 10px;
    --swiper-pagination-bullet-height: 10px;
    --swiper-pagination-color: #FCFAF2;
}

.banner {
    padding: 0 1rem;
    margin: 0 auto;
    max-width: $primeWidth;
}

.title {
    z-index: 2;
    color: white;
    font-size: 3rem;
    position: absolute;
    top: 15%;
    left: 10%;
    backdrop-filter: blur(5px);
}
</style>