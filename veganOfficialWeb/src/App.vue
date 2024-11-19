<template>
    <!-- <Loader></Loader> -->
    <transition name="app">
        <!-- <div v-show="!loaderActivated"> -->
        <div>
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
            </main>
            <footer>
                <VeganFooter></VeganFooter>
            </footer>
        </div>
    </transition>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue';
import Loader from './components/Loader/Loader.vue';
import CartCard from './components/popover/CartCard.vue';
import { onMounted, watch, toRefs, onUnmounted } from 'vue';
import { useLoader } from '@/store/loader';
import preloadImgList from './utils/preloadImgList';
import { storeToRefs } from 'pinia';


let { loaderActivated } = storeToRefs(useLoader());

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
    // window.addEventListener('scroll', function (event) {
    //     console.log('滾動距離:', window.scrollY);  // 垂直滾動距離
    //     console.log('滾動距離:', window.scrollX);  // 水平滾動距離
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

    * {
        // outline: 1px solid black;
    }
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

footer {
    background-color: $secondBacColor;
    position: relative;

}
</style>