<template>
    <div :class="swiperClass">
        <swiper :modules="modules"
            :slides-per-view="showNum" loop
            :pagination="pagination" :autoplay="autoplay"
            :speed="speed">
            <swiper-slide
                v-for="(item, index) in swiperList"
                :key="index">
                <a href="" @click.prevent>
                    <img :src="item.url" alt="">
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 1.解決類型問題 2.參數如何傳入 3.數據如何傳入
 * 要用pinia?
 */

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'

import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'
import 'swiper/scss/autoplay'

const modules = [Pagination, Autoplay]

interface SwiperItem {
  url: string;
}

const props = defineProps<{
  showNum: number,
  pagination: Object,
  autoplay: Object,
  speed: number,
  swiperList: SwiperItem[],
  swiperClass: string
}>();

const { showNum, pagination, autoplay, speed, swiperList, swiperClass } = props
</script>

<style scoped></style>