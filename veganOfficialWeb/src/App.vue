<template>
    <div>
        <!-- <Loader></Loader> -->
        <transition name="app">
            <div v-show="!loaderActivated">
                <VeganHeader></VeganHeader>
                <router-view></router-view>
                <VeganFooter></VeganFooter>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'
import Loader from './components/Loader/Loader.vue';
import { onMounted, watch, toRefs } from 'vue';
import { useLoader } from '@/store/loader';

let { loaderActivated } = toRefs(useLoader());

onMounted(() => {
    watch(loaderActivated, (newValue) => {
        if (newValue == false) {
            setInterval(() => {
                document.body.style.overflow = 'auto';
            }, 2500)
        }
    });
})

</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@import "./style/index.scss";
@import './style/fonts.scss';

body {
    overflow: hidden;
}

#app {
    background-color: $primeBacColor;
}


.app-enter-active {
    transform-origin: top center;
    transition:
        transform 0.5s 2.5s linear;
}

.app-enter-from {
    transform: scale(0.99);
}

.app-enter-to {
    transform: scale(1);
}
</style>