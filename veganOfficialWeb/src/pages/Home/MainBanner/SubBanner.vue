<template>
    <swiper-container :slides-per-view="4" loop="true"
        :speed="1000" :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }">
        <swiper-slide v-for="(item, index) in getUrl"
            :key="index">
            <a href="" @click.prevent>
                <img :src="item.url" alt="">
            </a>
        </swiper-slide>
    </swiper-container>
</template>

<script lang="ts" setup>
/**
 * todo:換輪播樣式
 */
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

<style lang="scss">
a {
    & img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>