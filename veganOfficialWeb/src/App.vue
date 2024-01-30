<template>
    <div>
        <VeganHeader></VeganHeader>
        <MainBanner></MainBanner>
        <VeganFooter></VeganFooter>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import MainBanner from './components/MainBanner/MainBanner.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'

</script>

<style>
/* 引入全局樣式和字體 */
@import "./style/index.scss";
@import './style/fonts.scss';
</style>