<template>
    <transition name="loader">
        <Loader v-show="loaderActivated"></Loader>
    </transition>

    <!-- <transition name="app"> -->
    <div :style="{
        opacity: loaderActivated ? 0 : 1
    }">
        <header>
            <VeganHeader></VeganHeader>
        </header>
        <main>
            <router-view
                v-if="!$route.meta?.keepAlive"></router-view>

            <router-view v-slot="{ Component }">
                <keep-alive :max="3">
                    <component :key="$route.query.name"
                        v-if="$route.meta?.keepAlive"
                        :is="Component">
                    </component>
                </keep-alive>
            </router-view>

            <CartCard></CartCard>
            <div class="flyToCartContainer"></div>
            <Toast></Toast>
        </main>
        <footer>
            <VeganFooter></VeganFooter>
        </footer>
    </div>
    <!-- </transition> -->
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue';
import Loader from './components/Loader/Loader.vue';
import CartCard from './components/popover/CartCard.vue';
import Toast from './components/popover/Toast.vue';
import { onMounted, watch, toRefs, onUnmounted } from 'vue';
import { useLoaderStore } from '@/store/loader';
import preloadImgList from './utils/preloadImgList';
import { storeToRefs } from 'pinia';

let { loaderActivated } = storeToRefs(useLoaderStore());

onMounted(() => {
    watch(loaderActivated, (newValue) => {
        if (newValue == false) {
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 2500)
        }
    });

    // preloadImgList.forEach(el => {
    //     const img = new Image();
    //     img.src = el;
    // });
})

onUnmounted(() => {

})
</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@use "./style/index.scss" as *;
@use './style/fonts.scss' as *;


body {
    // overflow: hidden;
}

// .flyToCartContainer {}

#app {
    background-color: $primaryBacColor;
    // overflow: hidden;
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

.loader-enter-active,
.loader-leave-active {
    transition: opacity 1s, transform 1s;
}

.loader-enter-from,
.loader-leave-to {
    opacity: 0;
    transform: scale(5) translateZ(0);
}

.loader-enter-to,
.loader-leave-from {
    opacity: 1;
    transform: scale(1) translateZ(0);
    // display: none;
}

footer {
    background-color: $secondBacColor;
    position: relative;

}
</style>