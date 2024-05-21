<template>
    <div>
        <div class="banner" ref="bannerRef">
            <Marquee></Marquee>
            <MainBanner></MainBanner>
            <SubBanner></SubBanner>
        </div>
        <div>
            <Catalog></Catalog>
        </div>
        <div class="location" ref="locationRef">
            <nLocation></nLocation>
        </div>
        <div>
            <Concept></Concept>
        </div>
        <div class="hiring" ref="hiringRef">
            <Hiring></Hiring>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Marquee from './Banner/Marquee.vue';
import MainBanner from './Banner/MainBanner.vue';
import SubBanner from './Banner/SubBanner.vue';
import Catalog from './Catalog/Catalog.vue';
import nLocation from './Location/nLocation.vue';
import Concept from './Concept/Concept.vue';
import Hiring from './Hiring/Hiring.vue';

const bannerRef = ref(null);
const locationRef = ref(null);
const hiringRef = ref(null);

let observer: IntersectionObserver | null;

const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
        // console.log(`${entry.target.className} is ${entry.isIntersecting ? 'inside' : 'outside'} the viewport with offset: ${entry.boundingClientRect.top}`);
        if (entry.isIntersecting) {
            console.log('object');
            entry.target.scrollIntoView();
        }
        // console.log(entry);
    });
};

onMounted(() => {
    observer = new IntersectionObserver(observerCallback, {
        root: null,
        // threshold: 0.1, // 触发回调的阈值
        rootMargin: "0px 0px -50% 0px" // 调整触发回调的时机，提早或延后
    });

    if (locationRef.value) observer.observe(locationRef.value);

    window.addEventListener('scroll', () => {
        // console.log(window.scrollY);
    })
});

onUnmounted(() => {
    if (observer) {
        if (locationRef.value) observer.unobserve(locationRef.value);
    }
});
</script>

<style scoped lang="scss">
.banner {
    overflow: hidden;
    min-height: 1290px;

    &,
    &~div {
        overflow: hidden;
    }
}

.location {
    @include flex-center-center;
}

.hiring {
    @include flex-center-center;
}
</style>
