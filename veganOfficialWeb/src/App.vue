<template>
    <div>
        <Loader></Loader>
        <div v-show="!loaderActivated">
            <VeganHeader></VeganHeader>
            <router-view></router-view>
            <VeganFooter></VeganFooter>
        </div>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'
import Loader from './components/Loader/Loader.vue';
import { toRefs } from 'vue';
import { useLoader } from '@/store/loader';

let { loaderActivated } = toRefs(useLoader())

</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@import "./style/index.scss";
@import './style/fonts.scss';

#app {
    background-color: $primeBacColor;
}
</style>