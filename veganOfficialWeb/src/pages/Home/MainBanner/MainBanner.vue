<template>
    <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }" :speed="1000"
        :centeredSlides="true" class="banner">
        <!-- :autoplay="{
        delay: 5500,
        disableOnInteraction: false,
    }" :speed="1000" -->
        <swiper-slide v-for="(img, index) in imgs"
            :key="index">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="title"
                        data-swiper-parallax="-500">
                        <h1>{{ img.title }}</h1>
                        <p>{{ img.text }}</p>
                    </div>
                </div>
                <div class="text" data-swiper-parallax="0">
                    <a href="" @click.prevent>
                        <img :src="`/imgs/MainBanner/${img.url}.png`"
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
 * todo:模糊CSS，圖片置中顯示，是否要放字
 */
import { onMounted } from 'vue';


const imgs = [
    {
        url: '1',
        title: '新餐盒上市',
        text: '查看夏季新上市的餐盒與果昔'
    },
    {
        url: '2',
        title: '專屬分析',
        text: '快來看看屬於你的餐盒與果席的搭配'
    },
    {
        url: '3',
        title: '好友分享拿優惠',
        text: '輸入好友推薦碼拿300元優惠券'
    },
    {
        url: '4',
        title: '專屬APP',
        text: '下載我們的APP，一鍵下單更方便'
    },
    {
        url: '5',
        title: '最新鮮的本地蔬食',
        text: '完整的食材履歷，讓您安心享用'
    },
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
    font-size: 1.5rem;
    color: white;
    position: absolute;
    top: 5%;
    right: 3%;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.text {
    & img {
        object-fit: cover;
        object-position: center center;
    }
}
</style>