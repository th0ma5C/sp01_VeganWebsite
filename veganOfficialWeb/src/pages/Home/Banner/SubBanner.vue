<template>
    <!-- <swiper-container :slides-per-view="4" loop="true"
        :speed="1000" :space-between="16" :autoplay="{
            delay: 5500,
            disableOnInteraction: false,
        }" class="container"> -->
    <swiper-container :slides-per-view="4" loop="true"
        :speed="1000" :space-between="16" class="container">
        <swiper-slide v-for="(item, index) in getUrl"
            :key="index">
            <a href="" @click.prevent>
                <img :src="item.url" alt="">
            </a>
        </swiper-slide>
    </swiper-container>
</template>

<script lang="ts" setup>
let imgs = [
    { title: 'a' },
    { title: 'b' },
    { title: 'c' },
    { title: 'd' },
    { title: 'e' }
]

const getUrl = imgs.map(item => ({
    url: new URL(`/src/assets/img/SubBanner/${item.title}.jpg`, import.meta.url).href
}))
</script>

<style lang="scss" scoped>
.container {
    padding: 1rem;
    padding-bottom: calc(1rem + 11.75px);

    a {
        img {
            @include WnH(100%);
            display: block;
            object-fit: cover;
            object-position: center center;
        }
    }
}
</style>