<template>
    <swiper-container :slides-per-view="1" loop="true"
        :pagination="{ clickable: true }" :speed="1000"
        :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }" class="banner">
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <a href="" @click.prevent>
                <img :src="`/imgs/MainBanner/${img.title}.jpg`"
                    alt="">
            </a>
        </swiper-slide>
    </swiper-container>
</template>
<script lang="ts" setup>

const imgs = [
    { title: 'berry-smoothie' },
    { title: 'fruit' },
    { title: 'loaf' },
    { title: 'tomatoes' },
    { title: 'strawberry-smoothie' },
    { title: 'vegetable' },
    { title: 'water' },
];

</script>
<style lang="scss">
:root {
    --swiper-pagination-bullet-width: 10px;
    --swiper-pagination-bullet-height: 10px;
    --swiper-pagination-color: #FCFAF2;
}
</style>