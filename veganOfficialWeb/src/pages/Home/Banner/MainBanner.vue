<template>
    <!-- <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        pagination-dynamic-bullets="true" :speed="1000"
        :centeredSlides="true" :autoplay="{
            delay: 5500,
            disableOnInteraction: false,
        }" :injectStyles="injectStyles" class="mainBanner"> -->
    <swiper-container :parallax="true" :loop="true"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        pagination-dynamic-bullets="true" :speed="1000"
        :centeredSlides="true" :injectStyles="injectStyles"
        class="mainBanner">
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
                        <img :src="`/imgs/MainBanner/${img.url}.jpg`"
                            alt="">
                    </a>
                </div>
            </div>
        </swiper-slide>
    </swiper-container>
</template>
<script lang="ts" setup>
/**
 * todo:加入跳轉按鈕
 */
import { onMounted } from 'vue';


const imgs = [
    {
        url: '1',
        title: '專屬分析',
        text: '快來看看屬於你的餐盒與果席的搭配'
    },
    {
        url: '2',
        title: '新餐盒上市',
        text: '查看夏季新上市的餐盒與果昔'
    },
    {
        url: '3',
        title: '最新鮮的本地蔬食',
        text: '完整的食材履歷，讓您安心享用'
    },
    {
        url: '4',
        title: '好友分享拿優惠',
        text: '輸入好友推薦碼拿300元優惠券'
    },
    {
        url: '5',
        title: '專屬APP',
        text: '下載我們的APP，一鍵下單更方便'
    },
];
let injectStyles = [
    `
    :host{
        --swiper-pagination-bullet-width: 10px;
        --swiper-pagination-bullet-height: 10px;
        --swiper-pagination-color: #FCFAF2;    
    }
    `
]


onMounted(() => {
    // console.log(innerWidth, innerHeight);
})
</script>
<style lang="scss" scoped>
.mainBanner {
    padding: 0 1rem;
    margin: 0 auto;
    max-width: $primaryWidth;
}

.title {
    z-index: 2;
    font-size: 1.5rem;
    color: white;
    position: absolute;
    top: 10%;
    left: 5%;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    // backdrop-filter: blur(10px);
    border-radius: 1rem;
}

.text {
    a {
        // display: block;
        // height: 0;
    }

    @media screen and (max-width: 1440px) {

        a,
        img {
            height: 776px;
        }
    }

    a,
    img {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
}
</style>