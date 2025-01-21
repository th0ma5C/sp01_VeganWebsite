<template>
    <swiper-container :slides-per-view="2" loop="true"
        :speed="1000" :space-between="16" :autoplay="{
            delay: 7750,
            disableOnInteraction: false,
        }" grab-cursor="true" :breakpoints="{
            576: {
                slidesPerView: 3
            },
            768: {
                slidesPerView: 4
            }
        }" class="container">
        <swiper-slide v-for="(item, index) in getUrl"
            :key="index">
            <img :src="item" alt="">
        </swiper-slide>
    </swiper-container>
</template>

<script lang="ts" setup>
import useConcatImgPath from '@/hooks/useConcatImgPath';

let imgUrl = [
    'a.jpg',
    'b.jpg',
    'c.jpg',
    'd.jpg',
    'e.jpg',
], folder = 'SubBanner';

let getUrl = useConcatImgPath(imgUrl, folder);

</script>

<style lang="scss" scoped>
.container {
    padding: 1rem;
    padding-bottom: calc(1rem + 11.75px);

    img {
        @include WnH(100%);
        display: block;
        object-fit: cover;
        object-position: center center;
    }
}

@include small {
    // .container {
    //     max-height: 150px;
    // }
}
</style>