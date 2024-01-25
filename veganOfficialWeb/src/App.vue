<template>
    <div style="height: 3000px;">
        <VeganHeader></VeganHeader>
        <p>我是內容</p>
        <VeganFooter></VeganFooter>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'

</script>

<style>
@import "./style/index.scss";
</style>