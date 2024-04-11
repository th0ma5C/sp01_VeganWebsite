<template>
    <div>
        <VeganHeader></VeganHeader>
        <router-view></router-view>
        <VeganFooter></VeganFooter>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'

</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@import "./style/index.scss";
@import './style/fonts.scss';

:root {
    --swiper-pagination-bullet-width: 10px;
    --swiper-pagination-bullet-height: 10px;
    --swiper-pagination-color: #FCFAF2;
    --swiper-navigation-size: 22px;
    --swiper-navigation-color: #036313;
}

#app {
    background-color: $primeBacColor;
}
</style>