<template>
    <div :style="{
        // opacity: loaderActivated ? 0 : 1
    }">
        <transition name="loader">
            <Loader v-show="loaderActivated"></Loader>
        </transition>
        <header>
            <VeganHeader></VeganHeader>
        </header>
        <main>
            <router-view
                v-if="!$route.meta?.keepAlive"></router-view>

            <router-view v-slot="{ Component }">
                <keep-alive :max="3">
                    <component
                        :key="$route.query.name || 'default'"
                        v-if="$route.meta?.keepAlive"
                        :is="Component">
                    </component>
                </keep-alive>
            </router-view>

            <CartCard></CartCard>
            <Toast></Toast>
        </main>
        <footer>
            <VeganFooter></VeganFooter>
        </footer>
    </div>
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
            }, 0)
        }
    });

    // preloadImgList.forEach(el => {
    //     const img = new Image();
    //     img.src = el;
    // });
    console.log(import.meta.env.VITE_API_BASE_URL);
})

onUnmounted(() => {

})
</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@use "./style/index.scss" as *;
@use './style/fonts.scss' as *;

* {
    // outline: 1px solid black;
}

body {
    overflow: hidden;
}

// .flyToCartContainer {}

#app {
    background-color: $primaryBacColor;
    min-width: 320px;
    // overflow: hidden;
}

main {
    margin-inline: auto;
    // max-width: 1920px;
}

footer {
    // background-color: $secondBacColor;
    // position: relative;
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



// @include XLarge {
//     #app>div {
//         margin-inline: auto;
//         max-width: 1920px;
//     }
// }</style>