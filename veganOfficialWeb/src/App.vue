<template>
    <div :style="{
        // opacity: loaderActivated ? 0 : 1
    }">
        <Loader>
        </Loader>

        <header>
            <VeganHeader></VeganHeader>
        </header>
        <main>
            <router-view v-slot="{ Component }"
                v-if="!$route.meta?.keepAlive">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>

            <router-view v-slot="{ Component }" v-else>
                <keep-alive :max="3">
                    <component
                        :key="$route.query.name || 'default'"
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
import { useRoute, useRouter } from 'vue-router';

let { loaderActivated } = storeToRefs(useLoaderStore());

const route = useRoute();

onMounted(() => {
    watch(loaderActivated, (newValue) => {
        if (newValue == false) {
            // setTimeout(() => {
            document.body.style.overflow = 'auto';
            // }, 0)
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
@use "./style/index.scss" as *;
@use './style/fonts.scss' as *;

body {
    overflow: hidden;
}


#app {
    background-color: $primaryBacColor;
    min-width: 320px;

    & input::-ms-reveal {
        display: none;
    }
}

main {
    margin-inline: auto;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>