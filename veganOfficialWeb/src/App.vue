<template>
    <!-- <Loader></Loader> -->
    <transition name="app">
        <!-- <div v-show="!loaderActivated"> -->
        <div>
            <header>
                <VeganHeader></VeganHeader>
            </header>
            <main>
                <router-view></router-view>
            </main>
            <footer>
                <VeganFooter></VeganFooter>
            </footer>
        </div>
    </transition>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
// import VeganFooter from './components/Footer/VeganFooter.vue'
import VeganFooter from './components/Footer/VeganFooter.vue';
import Loader from './components/Loader/Loader.vue';
import { onMounted, watch, toRefs, onUnmounted } from 'vue';
import { useLoader } from '@/store/loader';
import preloadImgList from './utils/preloadImgList';

let { loaderActivated } = toRefs(useLoader());

onMounted(() => {
    watch(loaderActivated, (newValue) => {
        if (newValue == false) {
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 2500)
        }
    });

    preloadImgList.forEach(el => {
        const img = new Image();
        img.src = el;
    });



    // window.addEventListener('scroll', function (event) {
    //     console.log('滾動距離:', window.scrollY);  // 垂直滾動距離
    //     console.log('滾動距離:', window.scrollX);  // 水平滾動距離
    // });
})
</script>

<style lang="scss">
/* 引入全局樣式和字體 */
@import "./style/index.scss";
@import './style/fonts.scss';


body {
    // overflow: hidden;
}

#app {
    background-color: $primaryBacColor;
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

footer {
    background-color: $secondBacColor;
}
</style>