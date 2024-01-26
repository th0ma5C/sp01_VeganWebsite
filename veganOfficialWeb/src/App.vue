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
@import "./style/index.scss";
</style>