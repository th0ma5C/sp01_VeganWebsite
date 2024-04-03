<template>
    <swiper-container :slides-per-view="4" loop="true"
        :speed="1000" :space-between="16" :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }" class="container">
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
    { title: 'dishes' },
    { title: 'smoothie' },
    { title: 'friend' },
    { title: 'app' },
    { title: 'hiring' }
]

const getUrl = imgs.map(item => ({
    url: new URL(`/src/assets/img/SubBanner/${item.title}.png`, import.meta.url).href
}))

</script>

<style lang="scss" scoped>
.container {
    margin: 1rem;

    a {
        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
        }
    }
}
</style>