<template>
    <swiper>
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
<style scoped>
@import 'swiper/css';
</style>